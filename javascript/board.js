let BASE_URL =
  "https://join-318-default-rtdb.europe-west1.firebasedatabase.app/";

let tasks = [];
let currentDraggedElement;

function init() {
  includeHTML();
  loadTasks();
}

function allowDrop(event) {
  event.preventDefault();
}

function moveTo(status) {
  tasks[currentDraggedElement]['status'] = status;
  renderTask()
}

function test() {
  console.table(tasks);
}

function highlight(id) {
  document.getElementById(`${id}`).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove('drag-area-highlight');
}

function loadTasks() {
  fetch(BASE_URL + "/addTask.json")
    .then((response) => response.json())
    .then((result) => {
      const accounts = Object.values(result);
      checkTask(accounts);
    })
    .catch((error) => console.log("Fehler beim Abrufen der Daten:", error));
}

function checkTask(task) {
  tasks = task;
  for (let i = 0; i < tasks.length; i++) {
    tasks[i].id = i;
  }
  renderTask();
}

function asd() {
  renderTask();
}

function renderTask() {
  let todo = document.getElementById("to-do");
  let inProgess = document.getElementById("in-progress");
  let awaitFeedback = document.getElementById("await-feedback");
  let done = document.getElementById("done");

  let clearProgress = inProgess.getElementsByClassName("ticket-card");
  let clearToDo = todo.getElementsByClassName("ticket-card");
  let clearFeedback = awaitFeedback.getElementsByClassName("ticket-card");
  let clearDone = done.getElementsByClassName("ticket-card");

  for (let i = 0; i < tasks.length; i++) {
    clearProgress[0]?.remove() || ""
    clearToDo[0]?.remove() || ""
    clearFeedback[0]?.remove() || ""
    clearDone[0]?.remove() || ""
  }

  let allToDos = tasks.filter((t) => t["status"] == "to-do");
  for (let i = 0; i < allToDos.length; i++) {
    todo.innerHTML += renderToDos(allToDos, i);
  }
  let allInPorgress = tasks.filter((t) => t["status"] == "in-progress");
  for (let i = 0; i < allInPorgress.length; i++) {
    inProgess.innerHTML += renderToDos(allInPorgress, i);
  }
  let allAwaitFeedback = tasks.filter((t) => t["status"] == "await-feedback");
  for (let i = 0; i < allAwaitFeedback.length; i++) {
    awaitFeedback.innerHTML += renderToDos(allAwaitFeedback, i);
  }
  let allDone = tasks.filter((t) => t["status"] == "done");
  for (let i = 0; i < allDone.length; i++) {
    done.innerHTML += renderToDos(allDone, i);
  }
}

function startDragging(id) {
  currentDraggedElement = id;
}

function renderToDos(task, i) {
  return `<div class="ticket-card" id="ticket-${task[i].id}" draggable="true" ondragstart="startDragging(${task[i].id})">
                    <div class="pill-blue" id="pill">
                        <p>User Story</p>
                    </div>

                    <div class="title-notice">
                        <p id="ticket-title">${task[i].title}</p>
                        <p id="ticket-notice">Build start page with recipe recommendation...</p>
                    </div>

                    <div class="progress-bar-section">
                        <div class="progress-bar">
                            <div class="progress-bar-filler"></div>
                        </div>
                        <p>1/2 Subtasks</p>
                    </div>

                    <div class="contacts-section">
                        <div class="contacts">
                            <img src="../assets/img/Profile badge.svg" alt="">
                            <img src="../assets/img/Profile badge.svg" alt="">
                            <img src="../assets/img/Profile badge.svg" alt="">
                        </div>
                        <img src="../assets/img/Capa 2.svg" alt="">
                    </div>
                </div>`;
}
