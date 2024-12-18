document.addEventListener('DOMContentLoaded', function() {
    const taskList = document.getElementById('taskList');
    const completedTasksList = document.getElementById('completedTasks');
    const incompleteTasksList = document.getElementById('incompleteTasks');
    const deletedTasksList = document.getElementById('deletedTasks');

    let completedArray = [];
    let incompleteArray = [];
    let deletedArray = [];

    loadTasks();

    document.getElementById('addTaskButton').addEventListener('click', function() {
        const taskInput = document.getElementById('taskInput');
        const taskText = taskInput.value.trim();

        if (taskText) {
            addTask(taskText);
            taskInput.value = ''; // Clear the input field
        }
    });

    document.getElementById('resetButton').addEventListener('click', function() {
        taskList.innerHTML = ''; // Clear all tasks
        completedArray = [];
        incompleteArray = [];
        deletedArray = [];
        saveTasks(); // Save the empty list to local storage
        updateStatusDisplay();
    });

    document.getElementById('completedTasksButton').addEventListener('click', function() {
        showList(completedTasksList);
    });

    document.getElementById('incompleteTasksButton').addEventListener('click', function() {
        showList(incompleteTasksList);
    });

    document.getElementById('deletedTasksButton').addEventListener('click', function() {
        showList(deletedTasksList);
    });

    function addTask(taskText, isCompleted = false) {
        const listItem = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isCompleted;

        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;

        if (isCompleted) {
            taskSpan.style.textDecoration = 'line-through';
            completedArray.push(taskText);
        } else {
            incompleteArray.push(taskText);
        }

        checkbox.addEventListener('change', function() {
            toggleTaskStatus(checkbox, taskText);
        });

        const removeIcon = document.createElement('i');
        removeIcon.classList.add('fas', 'fa-trash-alt', 'removeIcon');
        removeIcon.addEventListener('click', function() {
            removeTask(taskText); // Pass the task text, not the listItem
        });

        listItem.appendChild(checkbox);
        listItem.appendChild(taskSpan);
        listItem.appendChild(removeIcon);
        taskList.appendChild(listItem);

        saveTasks();
        updateStatusDisplay();
    }

    function removeTask(taskText) {
        // Remove the task from the task list
        const listItem = Array.from(taskList.children).find(item => 
            item.querySelector('span').textContent === taskText
        );
        if (listItem) {
            listItem.remove();
        }

        // Remove the task from the arrays
        completedArray = completedArray.filter(task => task !== taskText);
        incompleteArray = incompleteArray.filter(task => task !== taskText);
        
        // Only add to the deletedArray if it's not already there
        if (!deletedArray.includes(taskText)) {
            deletedArray.push(taskText);
        }

        // Save the updated tasks to local storage
        saveTasks();
        updateStatusDisplay();
    }

    function toggleTaskStatus(checkbox, taskText) {
        if (checkbox.checked) {
            completedArray.push(taskText);
            incompleteArray = incompleteArray.filter(task => task !== taskText);
            checkbox.nextElementSibling.style.textDecoration = 'line-through';
        } else {
            incompleteArray.push(taskText);
            completedArray = completedArray.filter(task => task !== taskText);
            checkbox.nextElementSibling.style.textDecoration = 'none';
        }

        saveTasks();
        updateStatusDisplay();
    }

    function updateStatusDisplay() {
        updateTaskList(completedTasksList, completedArray);
        updateTaskList(incompleteTasksList, incompleteArray);
        updateTaskList(deletedTasksList, deletedArray);
    }

    function updateTaskList(listElement, tasks) {
        listElement.innerHTML = '';
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.textContent = task;
            listElement.appendChild(listItem);
        });
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(item => {
            const taskText = item.querySelector('span').textContent;
            const isCompleted = item.querySelector('input[type="checkbox"]').checked;
            tasks.push({ text: taskText, completed: isCompleted });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('deletedTasks', JSON.stringify(deletedArray)); // Save deleted tasks
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTask(task.text, task.completed);
        });

        // Load deleted tasks from local storage
        deletedArray = JSON.parse(localStorage.getItem('deletedTasks')) || [];
        updateStatusDisplay();
    }

    function showList(listElement) {
        // Hide all lists
        [completedTasksList, incompleteTasksList, deletedTasksList].forEach(list => {
            list.style.display = 'none';
        });

        // Show the selected list
        listElement.style.display = 'block';
    }
});
