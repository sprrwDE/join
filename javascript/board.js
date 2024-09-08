let BASE_URL = "https://join-318-default-rtdb.europe-west1.firebasedatabase.app/";

window.tasks = [];
let currentDraggedElement;
window.clickedCardId;
let amounts = {};

function initBoard() {
  includeHTML();
  loadTasks();
  init();
}

function allowDrop(event) {
  event.preventDefault();
}

function helpAmount() {
  let sections = ["todo", "inprogress", "awaitfeedback", "done"]
  for (let i = 0; i < sections.length; i++) {
    let section = getAmounthelper(sections[i])
    amounts[sections[i]] = section
  }
}

function getAmountsOfAllSections() {
  helpAmount()
  let urgent = getUrgentNumber();
  amounts["urgent"] = urgent;
  uploadAmount();
}

function getUrgentNumber() {
  let amount = 0;
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    if (task.prio == "urgent") {
      amount++;
    }
  }
  return amount;
}

function uploadAmount() {
  fetch(BASE_URL + "/Status.json", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(amounts),
  });
}

function getAmounthelper(section) {
  let todo = document.getElementById(section);
  let card = todo.getElementsByClassName("ticket-card");
  return card.length;
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
  getAmountsOfAllSections();
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

function separatSubtask(atasks) {
  if (!atasks == "") {
    let inputString = atasks;
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
      if (values[i].subtask === "") {
        values[i].subtask = "''";
      }
      let sep = separatSubtask(values[i].subtask);
      let subtask = renderToObject(sep);
      tasks.push(values[i]);
      tasks[i].id = `${keys[i]}`;
      tasks[i].subtask = subtask;
    } else {
      tasks.push(values[i]);
      tasks[i].id = `${keys[i]}`;
    }
  }
  renderTask();
  getAmountsOfAllSections();
}

function renderToObject(subtask) {
  if (subtask) {
    let newsubtaskArray = {};
    for (let i = 0; i < subtask.length; i++) {
      newsubtaskArray[subtask[i]] = "inwork";
    }
    return newsubtaskArray;
  }
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
/* 
category : Pflicht
date: Pflicht
id: Pflicht
title: Pflicht
status: Pflicht
inits: Pflicht

assignedto: false
color: false
description: false
prio: false
subtask: false

*/
function renderHelper(section) {
  let allTasks = tasks.filter((t) => t["status"] == section);
  for (let i = 0; i < allTasks.length; i++) {
    let category = getCategory(allTasks[i].category);
    let cleaned = isEmpty(allTasks[i])
    console.log(cleaned)
    if (cleaned.description == false) {
      allTasks[i].description = "";
    }

    if (!cleaned.prio == false) {
      prio = getPrio(i, allTasks);
    } else {
      prio = "noprio.svg"
    }

    let checked = 0
    if (!cleaned.subtask == false) {
      checked = subtaskChecked(i, allTasks[i]);
      count = getCheckedSubtasks(allTasks[i]);
      subtaskslength = Object.values(allTasks[i].subtask);
    } else {
      subtaskslength = []
    }

    if (cleaned.color == false) {
      allTasks[i].color = ""
    }


    document.getElementById(section).innerHTML += renderToDos(allTasks, subtaskslength.length, i, category, prio, checked);
    let inits = getInitails(i, allTasks);
    for (let j = 0; j < inits.length; j++) {
      let contact = document.getElementById(`contact-images${allTasks[i].id}`);
      let colors = getColors(i, allTasks);
      contact.innerHTML += renderContactsImages(inits[j], colors, j);
    }
    if (!subtaskslength.length == 0) {
      renderProgressBar(count, subtaskslength.length, allTasks[i].id);
    } else {
      document.getElementById(`progress-bar-section${allTasks[i].id}`).classList.add("d-none")
    }
    
  }
}

function isEmpty(task) {

  if (task.assignedto == "") {
    task.assignedto = false
  }
  if (task.color == "") {
    task.color = false
  }
  if (task.description == "") {
    task.description = false
  }
  if (task.prio == "") {
    task.prio = false
  }
  if (Object.keys(task.subtask) == "") {
    task.subtask = false
  }
  return task
}

function renderProgressBar(count, length, id) {
  let progressBar = document.getElementById(`filler-${id}`);
  let result = (count / length) * 100;
  progressBar.style.width = `${result}%`;
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
  let color = [];
  if (typeof allTasks[i].color === "object") {
    color = JSON.stringify(allTasks[i].color);
  } else {
    color = allTasks[i].color;
  }

  if (color == "") {
    allcolors = "white"
  } else {
    allcolors = color.match(/rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)/g);
  }

  return allcolors;
}

function getInitails(i, allTasks) {
  let inits = [];
  let contact;
  if (allTasks[i].assignedto) {
    if (typeof allTasks[i].assignedto === "object") {
      let contactt = JSON.stringify(allTasks[i].assignedto);
      contact = contactt.replaceAll('"', "").replaceAll("[", "").replaceAll("]", "");
    } else {
      contact = allTasks[i].assignedto;
    }
  } else {
    contact = "";
  }

  if (!contact == "") {
    let contacts = contact.split(",");

    for (id in contacts) {
      let name = contacts[id].split(" ");
      let firstinit = name[0][0];
      let second = name[1] ? name[1][0] : "";
      inits.push([firstinit.toUpperCase(), second.toUpperCase()]);
    }
    return inits;
  } else {
    return []
  }
}

function subtaskChecked(i, alltask) {
  let checked = 0;
  let subtasks = Object.values(alltask.subtask);
  for (let j = 0; j < subtasks.length; j++) {
    if (subtasks[j] == "done") {
      checked++;
    }
  }
  return checked;
}

function renderToDos(task, subtasklength, i, categoryColor, prio, checked) {
  return `<div class="ticket-card" id="ticket-${task[i].id}" draggable="true" onclick="openCard('${task[i].id
    }')" ondragstart="startDragging('${task[i].id}')">
                    <div class="${categoryColor}" id="pill">
                        <p>${task[i].category}</p>
                    </div>

                    <div class="title-notice">
                        <p id="ticket-title">${task[i].title}</p>
                        <p id="ticket-notice">${task[i].description}</p>
                    </div>

                    <div class="progress-bar-section" id="progress-bar-section${task[i].id}">
                        <div class="progress-bar">
                            <div class="progress-bar-filler" id="filler-${task[i].id}"></div>
                        </div>
                        <p id="subtasks">${checked}/${subtasklength} Subtasks</p>
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
  if (iframe) {
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
  } else {
    let iframe = document.getElementById("edit-card");
    let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    tasks.filter((card) => {
      if (card.id == idnumber) {
        renderEditCardInfos(iframeDocument, card);
      }
    });
  }
}

function renderEditCardInfos(iframeDocument, card) {
  let iframe = document.getElementById("edit-card");
  let subtaskcontainer = iframeDocument.getElementById("subtasklist");
  iframeDocument.getElementById("input-title").value = card.title;
  iframeDocument.getElementById("text-area").value = card.description;
  iframeDocument.getElementById("input-date").value = card.date;
  iframe.contentWindow.selectedPrio(card.prio);

  let imgContainer = iframeDocument.getElementById("contacts-imges");
  imgContainer.innerHTML += `
  <span class="d-none" id="deliver-names">${card.assignedto}</span>
  <span class="d-none" id="deliver-category">${card.category}</span>
  <span class="d-none" id="deliver-status">${card.status}</span>
  <span class="d-none" id="deliver-cardId">${card.id}</span>
  `;

  for (let i = 0; i < Object.values(card.subtask).length; i++) {
    let keys = Object.keys(card.subtask);
    subtaskcontainer.innerHTML += iframe.contentWindow.renderAddToSubtaskList(i, keys[i]);
  }
}

let id = 0;
function setSubtasks() {
  let input = document.getElementById("input-subtask");
  let subtaskcontainer = document.getElementById("subtasklist");
  id++;
  if (input.value == "") {
    subtaskIsEmpty();
  } else {
    subtaskcontainer.innerHTML += renderAddToSubtaskList(id, input.value);
    input.value = "";
  }
}

function getAllSubtasks(card, iframeDocument) {
  let task = Object.keys(card.subtask);
  let sectionsElement = iframeDocument.getElementById("subtasks");
  sectionsElement.parentElement.id = `board-card-content-${card.id}`;

  let boardCardContent = sectionsElement.parentElement;
  if (!task[0] == "") {
    for (let i = 0; i < task.length; i++) {
      let checked = ifChecked(card, i);
      sectionsElement.innerHTML += subtasksHTML(i, task, task.length, checked, card);
    }
    boardCardContent.innerHTML += renderBoardCardButtons(card.id);
  }
}

function renderBoardCardButtons(id) {
  return `<div class="delete-edit">
            <div class="delete" id="delete-btn-${id}" onclick="deleteTask('${id}')">
                <img src="../assets/img/delete.svg" alt="">
                <p>Delete</p>
            </div>
            <img src="../assets/img/Vector 3.svg" alt="">
            <div class="edit" id="edit-btn-${id}" onclick="parent.editTask('${id}')">
                <img src="../assets/img/edit.svg" alt="">
                <p>Edit</p>
            </div>
        </div>`;
}

function ifChecked(card, i) {
  let alltasks = Object.values(card.subtask);
  if (alltasks[i] == "inwork") {
    return "";
  } else if (alltasks[i] == "done") {
    return "checked";
  }
}

function getAssignedTo(card, iframeDocument) {
  if (typeof card.assignedto === "object") {
    let newcard = JSON.stringify(card.assignedto);
    let reuslt = newcard.replaceAll("[", "").replaceAll("]", "").replaceAll('"', "");
    card.assignedto = reuslt;
  }
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

  if (typeof card.color === "object") {
    let newcolor = JSON.stringify(card.color);
    let reuslt = newcolor.replaceAll("[", "").replaceAll("]", "");
    card.color = reuslt;
  }
  let color = card.color.match(/rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)/g);

  for (let i = 0; i < contacts.length; i++) {
    let cleanInits = inits[i].join().replace(",", "");
    iframeDocument.getElementById("assigned-to").innerHTML += contactsHTML(contacts[i], cleanInits, color[i]);
  }
}

function subtasksHTML(i, task, tasklength, checked, card) {
  return `<div class="subtasks-checkboxes" id="board-card-${card.id}-${i}">
                <div class="checkbox-wrapper-19" >
                    <input type="checkbox" id="cbtest-19-${i}" onclick="parent.subtaskProcesBar('${card.id}', ${i}, ${tasklength}); boardCardSubtaskChecked(${i})" ${checked}/>
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
  clickedCardId = id;
  let body = document.getElementById("body");
  let background = document.getElementById("background-grey");
  background.classList.remove("d-none");

  body.innerHTML += `<iframe class="card-info" id="card-infos" src="./board-card.html"></iframe>`;
  let iframe = document.getElementById("card-infos");
  iframe.onload = function () {
    renderTaskCardInfos(id);
  };
}

function subtaskProcesBar(cardId, id, tasklength) {
  let iframe = document.getElementById("card-infos");
  let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
  let checkbox = iframeDocument.getElementById(`cbtest-19-${id}`);

  let task = getCardById(cardId);

  let subTaskCount = getCheckedSubtasks(task);
  if (checkbox.checked) {
    subTaskCount++;
  } else {
    subTaskCount--;
  }
  setSubTaskProces(subTaskCount, tasklength);
}

function getCheckedSubtasks(task) {
  let count = 0;
  let checked = Object.values(task.subtask);
  for (let z = 0; z < checked.length; z++) {
    if (checked[z] == "done") {
      count++;
    }
  }
  return count;
}

function getCardById(crypticId) {
  let newtask = {};
  tasks.forEach((task) => {
    if (task.id == crypticId) {
      newtask = task;
    }
  });
  return newtask;
}

function setSubTaskProces(count, tasklength) {
  let taskCard = document.getElementById(`ticket-${clickedCardId}`);
  let subtask = taskCard.querySelector("#subtasks");

  subtask.innerHTML = `${count}/${tasklength} Subtasks`;
  fillProgressBar(count, tasklength);
}

function fillProgressBar(count, length) {
  let progressBar = document.getElementById(`filler-${clickedCardId}`);
  let result = (count / length) * 100;
  progressBar.style.width = `${result}%`;
}

function editTask() {
  let card = document.getElementById("card-infos");
  card.id = "edit-card";
  card.src = "./board-card-edit.html";
}
