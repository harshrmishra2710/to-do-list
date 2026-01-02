const titleInput = document.getElementById("task-title");
const dateInput = document.getElementById("task-date");
const priorityInput = document.getElementById("task-priority");
const addBtn = document.getElementById("add-btn");
const taskList = document.querySelector(".task-list");
const filterButtons = document.querySelectorAll(".filters button");
const searchInput = document.getElementById("search");
const clearCompletedBtn = document.querySelector(".danger");
const countText = document.getElementById("count");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "All";
let editId = null;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  let filtered = tasks.filter(t =>
    currentFilter === "All" ? true : t.category === currentFilter
  );

  filtered = filtered.filter(t =>
    t.title.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  filtered.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="task-left">
        <label>
          <input type="checkbox" ${task.completed ? "checked" : ""}>
          <span class="task-title" style="text-decoration:${task.completed ? "line-through" : "none"}">
            ${task.title}
          </span>
        </label>
        <span class="task-date">🗓️ ${task.dueDate}</span>
        <span class="badge ${task.priority.toLowerCase()}">${task.priority}</span>
      </div>
      <div class="icons">
        <i class="fas fa-edit"></i>
        <i class="fas fa-trash"></i>
      </div>
    `;

    li.querySelector("input").addEventListener("change", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    li.querySelector(".fa-edit").addEventListener("click", () => {
      titleInput.value = task.title;
      dateInput.value = task.dueDate;
      priorityInput.value = task.priority;
      editId = task.id;
      addBtn.innerText = "Update Task";
    });

    li.querySelector(".fa-trash").addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(li);
  });

  updateCount();
}

addBtn.addEventListener("click", () => {
  if (!titleInput.value || !dateInput.value || !priorityInput.value) {
    alert("Please fill all fields");
    return;
  }

  if (editId) {
    const task = tasks.find(t => t.id === editId);
    task.title = titleInput.value;
    task.dueDate = dateInput.value;
    task.priority = priorityInput.value;
    editId = null;
    addBtn.innerText = "Add Task";
  } else {
    tasks.push({
      id: Date.now(),
      title: titleInput.value,
      dueDate: dateInput.value,
      priority: priorityInput.value,
      category: currentFilter === "All" ? "Work" : currentFilter,
      completed: false
    });
  }

  titleInput.value = "";
  dateInput.value = "";
  priorityInput.value = "";

  saveTasks();
  renderTasks();
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.innerText;
    renderTasks();
  });
});

searchInput.addEventListener("input", renderTasks);

clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
});

function updateCount() {
  const completed = tasks.filter(t => t.completed).length;
  countText.innerText = `Pending: ${tasks.length - completed} | Completed: ${completed}`;
}

renderTasks();
