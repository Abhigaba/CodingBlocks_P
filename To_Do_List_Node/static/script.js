const API_BASE_URL = 'http://localhost:3000'; 
const taskList = document.getElementById('taskList');
const addTaskForm = document.getElementById('addTaskForm');
const taskNameInput = document.getElementById('taskName');

async function fetchTasks() {
    taskList.innerHTML = ''; 
    try {
        const res = await axios.get(`${API_BASE_URL}/fetch`);
        const tasks = res.data.data
        tasks.sort((a,b) => a.priority - b.priority)
        tasks.forEach(task => renderTask(task));
    } catch (err) {
        console.error('Failed to fetch tasks:', err);
    }
}

function renderTask(task) {
    const li = document.createElement('li');
    li.dataset.id = task._id;
    li.innerHTML = `
        <span>${task.name}</span>
        <div>
            <button class="up">Up</button>
            <button class="down">Down</button>
            <button class="delete">Delete</button>
        </div>
    `;

    li.querySelector('.up').addEventListener('click', async () => {
        try {
            await axios.patch(`${API_BASE_URL}/priority/${task._id}`, 
                { priorityChange: "1" }
            );
            fetchTasks(); 
        } catch (err) {
            console.error('Failed to move task up:', err);
        }
    });

    li.querySelector('.down').addEventListener('click', async () => {
        try {
            await axios.patch(`${API_BASE_URL}/priority/${task._id}`, {
               priorityChange: "-1" }),
            
            fetchTasks(); 
        } catch (err) {
            console.error('Failed to move task down:', err);
        }
    });

    // Delete button
    li.querySelector('.delete').addEventListener('click', async () => {
        try {
            await axios.delete(`${API_BASE_URL}/delete/${task._id}`
             );
            fetchTasks(); // Refresh the list
        } catch (err) {
            console.error('Failed to delete task:', err);
        }
    });

    taskList.appendChild(li);
}

// Add a new task
addTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const taskName = taskNameInput.value.trim();
    if (!taskName) return;

    try {
        await axios.get(`${API_BASE_URL}/add/${taskNameInput.value}`
        );
        taskNameInput.value = ''; 
        fetchTasks(); 
    } catch (err) {
        console.error('Failed to add task:', err);
    }
});

fetchTasks();
