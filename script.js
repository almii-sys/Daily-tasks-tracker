class ToDoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        this.totalTasksEl = document.getElementById('totalTasks');
        this.completedTasksEl = document.getElementById('completedTasks');
        this.remainingTasksEl = document.getElementById('remainingTasks');
        
        this.init();
    }

    init() {
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });
        
        this.renderTasks();
        this.updateStats();
    }

    loadTasks() {
        try {
            const savedTasks = localStorage.getItem('bloomGrowTasks');
            return savedTasks ? JSON.parse(savedTasks) : [];
        } catch (error) {
            console.warn('Could not load tasks from localStorage:', error);
            return [];
        }
    }

    saveTasks() {
        try {
            localStorage.setItem('bloomGrowTasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.warn('Could not save tasks to localStorage:', error);
        }
    }

    addTask() {
        const taskText = this.taskInput.value.trim();
        if (!taskText) return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(newTask);
        this.taskInput.value = '';
        this.saveTasks();
        this.renderTasks();
        this.updateStats();

        // Add a little celebration animation
        this.addBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.addBtn.style.transform = '';
        }, 150);
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }

    renderTasks() {
        if (this.tasks.length === 0) {
            this.emptyState.style.display = 'block';
            this.taskList.innerHTML = '';
            this.taskList.appendChild(this.emptyState);
            return;
        }

        this.emptyState.style.display = 'none';
        this.taskList.innerHTML = '';

        this.tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            this.taskList.appendChild(taskElement);
        });
    }

    createTaskElement(task) {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        taskItem.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-id="${task.id}"></div>
            <span class="task-text">${this.escapeHtml(task.text)}</span>
            <button class="delete-btn" data-id="${task.id}">Remove 🗑️</button>
        `;

        // Add event listeners
        const checkbox = taskItem.querySelector('.task-checkbox');
        const deleteBtn = taskItem.querySelector('.delete-btn');

        checkbox.addEventListener('click', () => {
            this.toggleTask(task.id);
        });

        deleteBtn.addEventListener('click', () => {
            // Add a fade out animation
            taskItem.style.transform = 'translateX(100%)';
            taskItem.style.opacity = '0';
            setTimeout(() => {
                this.deleteTask(task.id);
            }, 300);
        });

        return taskItem;
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const remaining = total - completed;

        this.totalTasksEl.textContent = total;
        this.completedTasksEl.textContent = completed;
        this.remainingTasksEl.textContent = remaining;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ToDoApp();
});