let BASE_URL =
  "https://join-318-default-rtdb.europe-west1.firebasedatabase.app/";

let tasks = [];
let currentDraggedElement;

function init() {
  includeHTML();
  loadTasks();
}



function allowDrop(event, id) {
  document.getElementById(`to-do-drag${id}`).style.backgroundColor = "red";
  event.preventDefault();
  if (id == "1") {
    tasks.status = "to-do"
  } else if(id == "2") {
    tasks.status = "in-progress"
  }
  
}

function test() {
  console.table(tasks)
}

function removeHighlicht(section, id) {
  document.getElementById(`to-do-drag${id}`).style.backgroundColor = "";
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
  for(let i = 0; i < tasks.length; i++) {
    tasks[i].id = i
  }
  renderTask();
}

function renderTask() {
  let todo = document.getElementById("to-do-drag1");
  let inProgess = document.getElementById("to-do-drag2");
  let awaitFeedback = document.getElementById("to-do-drag3");
  let done = document.getElementById("to-do-drag4");

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
  currentDraggedElement = id
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
