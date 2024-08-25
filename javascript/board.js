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
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == currentDraggedElement) {
      tasks[i]["status"] = status;
      updateServer(currentDraggedElement, tasks[i]);

    }
  }
  removeHighlightDragArea()
  renderTask();
}

function removeHighlightDragArea() {
  let sections = ["todo", "inprogress", "awaitfeedback", "done"]
  for (let i = 0; i < sections.length; i++) {
    document.getElementById(sections[i]).classList.remove("drag-area-highlight");
  }
}


function highlight(id) {
  document.getElementById(`${id}`).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

function updateServer(task, alltask) {
  fetch(BASE_URL + "/addTask/" + task + ".json", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(alltask),
  });
}

function loadTasks() {
  fetch(BASE_URL + "/addTask.json")
    .then((response) => response.json())
    .then((result) => {
      let keys = Object.keys(result);
      let values = Object.values(result);
      checkTask(keys, values);
    })
    .catch((error) => console.log("Fehler beim Abrufen der Daten:", error));
}


function checkTask(keys, values) {
  tasks = [];

  for (let i = 0; i < values.length; i++) {
    tasks.push(values[i]);
    tasks[i].id = `${keys[i]}`;
  }
  renderTask();
}

function renderTask() {
  let todo = document.getElementById("todo");
  let inProgess = document.getElementById("inprogress");
  let awaitFeedback = document.getElementById("awaitfeedback");
  let done = document.getElementById("done");

  let clearProgress = inProgess.getElementsByClassName("ticket-card");
  let clearToDo = todo.getElementsByClassName("ticket-card");
  let clearFeedback = awaitFeedback.getElementsByClassName("ticket-card");
  let clearDone = done.getElementsByClassName("ticket-card");

  for (let i = 0; i < tasks.length; i++) {
    clearProgress[0]?.remove() || "";
    clearToDo[0]?.remove() || "";
    clearFeedback[0]?.remove() || "";
    clearDone[0]?.remove() || "";
  }
  renderHelper("todo");
  renderHelper("inprogress");
  renderHelper("awaitfeedback");
  renderHelper("done");
}

function renderHelper(section) {
  let allTasks = tasks.filter((t) => t["status"] == section);
  for (let i = 0; i < allTasks.length; i++) {
    document.getElementById(section).innerHTML += renderToDos(allTasks, i);
  }
}

function startDragging(id) {
  currentDraggedElement = id;
}

function renderToDos(task, i) {
  return `<div class="ticket-card" id="ticket-${task[i].id}" draggable="true" ondragstart="startDragging('${task[i].id}')">
                    <div class="pill-blue" id="pill">
                        <p>User Story</p>
                    </div>

                    <div class="title-notice">
                        <p id="ticket-title">${task[i].title}</p>
                        <p id="ticket-notice">${task[i].description}</p>
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
