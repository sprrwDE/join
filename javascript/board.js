let BASE_URL = "https://join-318-default-rtdb.europe-west1.firebasedatabase.app/";

let tasks = [];
let currentDraggedElement;

function initBoard() {
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
  removeHighlightDragArea();
  renderTask();
}

function removeHighlightDragArea() {
  let sections = ["todo", "inprogress", "awaitfeedback", "done"];
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
  emptySection();
}

function renderHelper(section) {
  let allTasks = tasks.filter((t) => t["status"] == section);

  for (let i = 0; i < allTasks.length; i++) {
    let subtasks = getSubtasks(i, allTasks);
    let category = getCategory(allTasks[i].category);
    let prio = getPrio(i, allTasks)
    document.getElementById(section).innerHTML += renderToDos(allTasks, i, subtasks, category, prio);
    let inits = getInitails(i, allTasks);
    for (let j = 0; j < inits.length; j++) {
      let contact = document.getElementById(`contact-images${allTasks[i].id}`);
      let colors = getColors(i, allTasks);
      contact.innerHTML += renderContactsImages(inits[j], colors, j);
    }
  }
}

function getPrio(i, allTasks) {
  if (allTasks[i].prio == "urgent") {
    return "urgent.svg"
  } else if (allTasks[i].prio == "medium") {
    return "Capa 2.svg"
  } else if (allTasks[i].prio == "low") {
    return "low.svg"
  }
}

function getCategory(category) {
  if (category == "User Story") {
    return "pill-blue";
  } else if (category == "Technical Task") {
    return "pill-turkis";
  }
}

function getSubtasks(i, allTasks) {
  let subtasks = allTasks[i].subtask.split(",");
  return subtasks;
}

function startDragging(id) {
  currentDraggedElement = id;
  document.getElementById(`ticket-${id}`).classList.add("shake");
}

function getColors(i, allTasks) {
  let allcolors = allTasks[i].color.match(/rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)/g);
  return allcolors;
}

function getInitails(i, allTasks) {
  let inits = [];
  let contact = allTasks[i].assignedto;

  let contacts = contact.split(",");
  for (id in contacts) {
    let name = contacts[id].split(" ");
    let firstinit = name[0][0];
    let second = name[1] ? name[1][0] : "";
    inits.push([firstinit.toUpperCase(), second.toUpperCase()]);
  }
  return inits;
}

function renderToDos(task, i, subtasks, categoryColor, prio) {
  return `<div class="ticket-card" id="ticket-${task[i].id}" draggable="true" ondragstart="startDragging('${task[i].id}')">
                    <div class="${categoryColor}" id="pill">
                        <p>${task[i].category}</p>
                    </div>

                    <div class="title-notice">
                        <p id="ticket-title">${task[i].title}</p>
                        <p id="ticket-notice">${task[i].description}</p>
                    </div>

                    <div class="progress-bar-section">
                        <div class="progress-bar">
                            <div class="progress-bar-filler"></div>
                        </div>
                        <p>1/${subtasks.length}Subtasks</p>
                    </div>

                    <div class="contacts-section">
                        <div class="contacts" id="contact-images${task[i].id}">
                        </div>
                        <img src="../assets/img/${prio}" alt="">
                    </div>
                </div>`;
}

function renderContactsImages(inits, allcolors, j) {
  return `<div class="contact-initals" id="contact-initals1" style="background-color: ${allcolors[j]};">
                            <span>${inits[0]}${inits[1]}</span>
                          </div>`;
}

function emptySection() {
  let sections = ["todo", "inprogress", "awaitfeedback", "done"];

  for (let i = 0; i < sections.length; i++) {
    let section = document.getElementById(sections[i]);
    let cards = section.getElementsByClassName("ticket-card");
    let empty = document.getElementById(`${sections[i]}-empty`);

    if (cards.length <= 0) {
      empty.classList.remove("d-none");
    } else {
      empty.classList.add("d-none");
    }
  }
}
