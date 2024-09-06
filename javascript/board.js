let BASE_URL = "https://join-318-default-rtdb.europe-west1.firebasedatabase.app/";

window.tasks = [];
let currentDraggedElement;
window.clickedCardId;

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
    });
}

function separatSubtask(tasks) {
  if (!tasks == "") {
    let inputString = tasks;
    let matches = inputString.match(/'([^']*)'/g).map((s) => s.replace(/'/g, ""));

    return matches;
  } else {
    console.log("texyst");
  }
}

function checkTask(keys, values) {
  tasks = [];
  for (let i = 0; i < values.length; i++) {
    if (!values[i].subtask === "" || typeof values[i].subtask === "string") {
      let sep = separatSubtask(values[i].subtask);
      let subtask = renderToObject(sep);
      tasks.push(values[i]);
      tasks[i].id = `${keys[i]}`;
      tasks[i].subtask = subtask;
    } else {
      tasks.push(values[i]);
      tasks[i].id = `${keys[i]}`;
    }
    renderTask();
  }
}

function renderToObject(subtask) {
  let newsubtaskArray = {};
  for (let i = 0; i < subtask.length; i++) {
    newsubtaskArray[subtask[i]] = "inwork";
  }
  return newsubtaskArray;
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
    let category = getCategory(allTasks[i].category);
    let prio = getPrio(i, allTasks);
    
    let checked = subtaskChecked(i);
    document.getElementById(section).innerHTML += renderToDos(allTasks, i, category, prio, checked);
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
    return "urgent.svg";
  } else if (allTasks[i].prio == "medium") {
    return "Capa 2.svg";
  } else if (allTasks[i].prio == "low") {
    return "low.svg";
  }
}

function getCategory(category) {
  if (category == "User Story") {
    return "pill-blue";
  } else if (category == "Technical Task") {
    return "pill-turkis";
  }
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

function subtaskChecked(i) {
  let checked = 0;
  let task = Object.values(tasks[i].subtask);
  for (let j = 0; j < task.length; j++) {
    console.log(tasks[i].subtask)
    if (task[i] == "inwork") {
      checked++;
    } else if (task[i] == "done"){
      checked--;
    }
  }
  return checked;
}

function renderToDos(task, i, categoryColor, prio, checked) {
  return `<div class="ticket-card" id="ticket-${task[i].id}" draggable="true" onclick="openCard('${
    task[i].id
  }')" ondragstart="startDragging('${task[i].id}')">
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
                        <p id="subtasks">${checked}/${
    Object.keys(tasks[0].subtask).length
  } Subtasks</p>
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

function openAddTask() {
  let body = document.getElementById("body");
  let background = document.getElementById("background-grey");
  background.classList.remove("d-none");
  body.innerHTML += `<iframe class="add-task-card" id="whole-addtask-card" src="./addtask-card.html"></iframe>`;
}

function closeWindow(card) {
  let addtask = document.getElementById(card);
  let background = document.getElementById("background-grey");

  background.classList.add("d-none");
  addtask.remove();
  loadTasks();
}

function renderInfoCardHelper(sections, card, iframeDocument) {
  let sectionsElement = iframeDocument.getElementById(sections);
  sectionsElement.innerHTML = card[`${sections}`];
}

function renderTaskCardInfos(idnumber) {
  let iframe = document.getElementById("card-infos");
  let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

  tasks.filter((card) => {
    if (card.id == idnumber) {
      renderInfoCardHelper("title", card, iframeDocument);
      renderInfoCardHelper("description", card, iframeDocument);
      renderInfoCardHelper("date", card, iframeDocument);
      setPrio(card, iframeDocument);
      getAssignedTo(card, iframeDocument);
      getAllSubtasks(card, iframeDocument);
    }
  });
}

function getAllSubtasks(card, iframeDocument) {
  let task = Object.keys(card.subtask);
  let sectionsElement = iframeDocument.getElementById("subtasks");

  if (!task[0] == "") {
    for (let i = 0; i < task.length; i++) {
      let checked = ifChecked(card, i);

      sectionsElement.innerHTML += subtasksHTML(i, task, task.length, checked, card);
    }
  }
}

function ifChecked(card,i) {
  console.log(i)
  let alltasks = Object.values(card.subtask)
  if(alltasks[i] == "inwork") {
    return ""
  } else if (alltasks[i] == "done") {
    return "checked"
  }
}

function getAssignedTo(card, iframeDocument) {
  let contacts = card.assignedto.split(",");

  let inits = [];
  let contact = card.assignedto;

  let contactss = contact.split(",");
  for (id in contacts) {
    let name = contactss[id].split(" ");
    let firstinit = name[0][0];
    let second = name[1] ? name[1][0] : "";
    inits.push([firstinit.toUpperCase(), second.toUpperCase()]);
  }

  let color = card.color.match(/rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)/g);

  for (let i = 0; i < contacts.length; i++) {
    let cleanInits = inits[i].join().replace(",", "");
    iframeDocument.getElementById("assigned-to").innerHTML += contactsHTML(
      contacts[i],
      cleanInits,
      color[i]
    );
  }
}

function subtasksHTML(i, task, tasklength, checked, card) {
  return `<div class="subtasks-checkboxes" id="board-card-${card.id}-${i}">
                <div class="checkbox-wrapper-19" >
                    <input type="checkbox" id="cbtest-19-${i}" onclick="parent.subtaskProcesBar(${i}, ${tasklength}); boardCardSubtaskChecked(${i})" ${checked}/>
                    <label for="cbtest-19-${i}" class="check-box">
                </div>
                <p>${task[i]}</p>
            </div>`;
}

function contactsHTML(contact, init, color) {
  return `<div class="assigned-contacts">
                <div class="contact-circle" id="contact-circle" style="background-color: ${color};"><span id="contact-inits">${init}</span></div>
                <p>${contact}</p>
            </div>`;
}

function setPrio(card, iframeDocument) {
  if (card.prio == "urgent") {
    iframeDocument.getElementById("urgent").classList.remove("d-none");
  } else if (card.prio == "medium") {
    iframeDocument.getElementById("medium").classList.remove("d-none");
  } else if (card.prio == "low") {
    iframeDocument.getElementById("low").classList.remove("d-none");
  }
}

function openCard(id) {
  clickedCardId = id
  let body = document.getElementById("body");
  let background = document.getElementById("background-grey");
  background.classList.remove("d-none");

  body.innerHTML += `<iframe class="card-info" id="card-infos" src="./board-card.html"></iframe>`;
  let iframe = document.getElementById("card-infos");
  iframe.onload = function () {
    renderTaskCardInfos(id);
  };
}

let subTaskCount = 0;
function subtaskProcesBar(id, tasklength) {
  let iframe = document.getElementById("card-infos");
  let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
  let checkbox = iframeDocument.getElementById(`cbtest-19-${id}`);

  if (checkbox.checked) {
    subTaskCount++;
  } else {
    subTaskCount--;
  }
  setSubTaskProces(subTaskCount, tasklength);
}

function setSubTaskProces(count, tasklength) {
  let taskCard = document.getElementById(`ticket-${clickedCardId}`);
  let subtask = taskCard.querySelector("#subtasks");

  subtask.innerHTML = `${count}/${tasklength} Subtasks`;
}
