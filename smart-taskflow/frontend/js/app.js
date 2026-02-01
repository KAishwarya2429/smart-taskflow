const API = "http://localhost:5000/api/tasks";

// DOM Elements
const form = document.getElementById("taskForm");
const title = document.getElementById("title");
const description = document.getElementById("description");
const status = document.getElementById("status");
const list = document.getElementById("tasks");

const totalTasksEl = document.getElementById("totalTasks");
const inProgressTasksEl = document.getElementById("inProgressTasks");
const completedTasksEl = document.getElementById("completedTasks");

// ===============================
// CREATE TASK ELEMENT
// ===============================
function createTaskElement(task) {
  const li = document.createElement("li");

  li.innerHTML = `
    <strong>${task.title}</strong>
    <p>${task.description || "No description"}</p>
    <span class="status ${task.status.replace(" ", "-")}">${task.status}</span>
  `;

  return li;
}

// ===============================
// RENDER TASKS
// ===============================
async function load() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    list.innerHTML = "";

    data.forEach((task) => {
      const li = createTaskElement(task);
      list.appendChild(li);
    });

    updateStats(data);
  } catch (err) {
    console.error("Error loading tasks:", err);
  }
}

// ===============================
// UPDATE DASHBOARD STATS
// ===============================
function updateStats(tasks) {
  totalTasksEl.textContent = tasks.length;
  inProgressTasksEl.textContent = tasks.filter(
    (t) => t.status === "In-Progress",
  ).length;
  completedTasksEl.textContent = tasks.filter(
    (t) => t.status === "Completed",
  ).length;
}

// ===============================
// HANDLE FORM SUBMIT
// ===============================
form.onsubmit = async (e) => {
  e.preventDefault();

  const newTask = {
    title: title.value.trim(),
    description: description.value.trim(),
    status: status.value,
  };

  try {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });

    form.reset();
    load();
  } catch (err) {
    console.error("Error creating task:", err);
  }
};

// ===============================
// INITIAL LOAD
// ===============================
load();
