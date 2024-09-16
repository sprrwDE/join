/**
 * Base URL for the Firebase Realtime Database.
 * @constant {string}
 */
let BASE_URL = "https://join-318-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Array of all tasks.
 * @type {Array<Object>}
 */
window.tasks = [];

/**
 * Currently dragged element ID.
 * @type {string}
 */
let currentDraggedElement;

/**
 * ID of the clicked card.
 * @type {string}
 */
window.clickedCardId;

/**
 * Object storing the number of tasks in each section.
 * @type {Object}
 */
let amounts = {};

/**
 * Initializes the board by including HTML components and loading tasks.
 */
function initBoard() {
  includeHTML();
  loadTasks();
  init();
}

/**
 * Allows the drop event on an element.
 * @param {DragEvent} event - The drag event.
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Calculates the number of tasks in each section and updates the amounts object.
 */
function helpAmount() {
  let sections = ["todo", "inprogress", "awaitfeedback", "done"];
  for (let i = 0; i < sections.length; i++) {
    let section = getAmounthelper(sections[i]);
    amounts[sections[i]] = section;
  }
}

/**
 * Updates the number of tasks in each section and uploads the data to the server.
 */
function getAmountsOfAllSections() {
  helpAmount();
  let urgent = getUrgentNumber();
  amounts["urgent"] = urgent;
  uploadAmount();
}

/**
 * Gets the number of tasks with 'urgent' priority.
 * @returns {number} The count of urgent tasks.
 */
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

/**
 * Uploads the amounts object to the server.
 */
function uploadAmount() {
  fetch(BASE_URL + "/Status.json", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(amounts),
  });
}

/**
 * Helper function to get the number of cards in a section.
 * @param {string} section - The ID of the section.
 * @returns {number} The number of cards in the section.
 */
function getAmounthelper(section) {
  let todo = document.getElementById(section);
  let card = todo.getElementsByClassName("ticket-card");
  return card.length;
}

/**
 * Moves the current dragged element to a new status.
 * @param {string} status - The new status to move the task to.
 */
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

/**
 * Removes the highlight class from all drag areas.
 */
function removeHighlightDragArea() {
  let sections = ["todo", "inprogress", "awaitfeedback", "done"];
  for (let i = 0; i < sections.length; i++) {
    document.getElementById(sections[i]).classList.remove("drag-area-highlight");
  }
}

/**
 * Adds highlight to a drag area.
 * @param {string} id - The ID of the drag area to highlight.
 */
function highlight(id) {
  document.getElementById(`${id}`).classList.add("drag-area-highlight");
}

/**
 * Removes highlight from a drag area.
 * @param {string} id - The ID of the drag area.
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

/**
 * Updates the task on the server.
 * @param {string} task - The task ID.
 * @param {Object} alltask - The task object to update.
 */
function updateServer(task, alltask) {
  fetch(BASE_URL + "/addTask/" + task + ".json", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(alltask),
  });
}

/**
 * Loads tasks from the server and processes them.
 */
function loadTasks() {
  fetch(BASE_URL + "/addTask.json")
    .then((response) => response.json())
    .then((result) => {
      let keys = result && typeof result === "object" ? Object.keys(result) : "";
      let values = result && typeof result === "object" ? Object.values(result) : "";
      checkTask(keys, values);
    });
}

/**
 * Separates subtasks from a string.
 * @param {string} atasks - The string containing subtasks.
 * @returns {Array<string>} An array of subtasks.
 */
function separatSubtask(atasks) {
  if (!atasks == "") {
    let inputString = atasks;
    let matches = inputString.match(/'([^']*)'/g).map((s) => s.replace(/'/g, ""));
    return matches;
  }
}

/**
 * Processes tasks and prepares them for rendering.
 * @param {Array<string>} keys - The task IDs.
 * @param {Array<Object>} values - The task objects.
 */
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

/**
 * Converts an array of subtasks into an object.
 * @param {Array<string>} subtask - The array of subtasks.
 * @returns {Object} An object with subtasks as keys and 'inwork' as values.
 */
function renderToObject(subtask) {
  if (subtask) {
    let newsubtaskArray = {};
    for (let i = 0; i < subtask.length; i++) {
      newsubtaskArray[subtask[i]] = "inwork";
    }
    return newsubtaskArray;
  }
}

/**
 * Renders all tasks to the board.
 */
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

/**
 * Helper function to render tasks in a specific section.
 * @param {string} section - The section to render tasks in.
 */
function renderHelper(section) {
  let allTasks = tasks.filter((t) => t["status"] == section);
  for (let i = 0; i < allTasks.length; i++) {
    let category = getCategory(allTasks[i].category);
    let cleaned = isEmpty(allTasks[i]);
    if (cleaned.description == false) {
      allTasks[i].description = "";
    }
    let prio;
    if (!cleaned.prio == false) {
      prio = getPrio(i, allTasks);
    } else {
      prio = "noprio.svg";
    }
    let checked = 0;
    let count;
    let subtaskslength;
    if (!cleaned.subtask == false) {
      checked = subtaskChecked(i, allTasks[i]);
      count = getCheckedSubtasks(allTasks[i]);
      subtaskslength = Object.values(allTasks[i].subtask);
    } else {
      subtaskslength = [];
    }
    if (cleaned.color == false) {
      allTasks[i].color = "";
    }

    document.getElementById(`${section}-card`).innerHTML += renderToDos(
      allTasks,
      subtaskslength.length,
      i,
      category,
      prio,
      checked
    );
    let inits = getInitails(i, allTasks);
    for (let j = 0; j < inits.length; j++) {
      let contact = document.getElementById(`contact-images${allTasks[i].id}`);
      let colors = getColors(i, allTasks);
      contact.innerHTML += renderContactsImages(inits[j], colors, j);
    }
    if (!subtaskslength.length == 0) {
      renderProgressBar(count, subtaskslength.length, allTasks[i].id);
    } else {
      document.getElementById(`progress-bar-section${allTasks[i].id}`).classList.add("d-none");
    }
    limitContactImgs(allTasks[i].id)
  }
}


/**
 * Limits the display of contact images to a maximum of five and shows the count of hidden contacts.
 *
 * @param {string|number} id - The unique ID used to identify the contact section.
 */
function limitContactImgs(id) {
  let imgSection = document.getElementById(`contacts-section${id}`);
  let images = imgSection.getElementsByClassName("contact-initals");
  let over = document.getElementById(`over-amount${id}`);

  for (let i = 0; i < images.length; i++) {
    if (images.length >= 5) {
      if (i >= 5) {
        over.classList.remove("d-none");
        over.innerHTML = "+" + (i - 4);
        images[i].classList.add("d-none");
      }
    }
  }
}

/**
 * Checks if task properties are empty and sets default values.
 * @param {Object} task - The task object.
 * @returns {Object} The cleaned task object.
 */
function isEmpty(task) {
  task.subtask = task.subtask ?? "";
  task.assignedto = task.assignedto || false;
  task.color = task.color || false;
  task.description = task.description || false;
  task.prio = task.prio || false;
  if (!Object.keys(task.subtask).length) task.subtask = false;
  return task;
}

/**
 * Renders the progress bar for a task.
 * @param {number} count - The number of completed subtasks.
 * @param {number} length - The total number of subtasks.
 * @param {string} id - The task ID.
 */
function renderProgressBar(count, length, id) {
  let progressBar = document.getElementById(`filler-${id}`);
  let result = (count / length) * 100;
  progressBar.style.width = `${result}%`;
}

/**
 * Gets the priority icon based on task priority.
 * @param {number} i - Index of the task.
 * @param {Array<Object>} allTasks - Array of all tasks.
 * @returns {string} The file name of the priority icon.
 */
function getPrio(i, allTasks) {
  if (allTasks[i].prio == "urgent") {
    return "urgent.svg";
  } else if (allTasks[i].prio == "medium") {
    return "Capa 2.svg";
  } else if (allTasks[i].prio == "low") {
    return "low.svg";
  }
}

/**
 * Gets the category class based on the category name.
 * @param {string} category - The category name.
 * @returns {string} The CSS class for the category pill.
 */
function getCategory(category) {
  if (category == "User Story") {
    return "pill-blue";
  } else if (category == "Technical Task") {
    return "pill-turkis";
  }
}

/**
 * Starts dragging a task.
 * @param {string} id - The ID of the task.
 */
function startDragging(id) {
  currentDraggedElement = id;
  document.getElementById(`ticket-${id}`).classList.add("shake");
}

/**
 * Gets the colors associated with assigned contacts.
 * @param {number} i - Index of the task.
 * @param {Array<Object>} allTasks - Array of all tasks.
 * @returns {Array<string>} Array of color strings.
 */
function getColors(i, allTasks) {
  let color = [];
  if (typeof allTasks[i].color === "object") {
    color = JSON.stringify(allTasks[i].color);
  } else {
    color = allTasks[i].color;
  }

  let allcolors;
  if (color == "") {
    allcolors = "white";
  } else {
    allcolors = color.match(/rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)/g);
  }

  return allcolors;
}

/**
 * Gets the initials of assigned contacts.
 * @param {number} i - Index of the task.
 * @param {Array<Object>} allTasks - Array of all tasks.
 * @returns {Array<Array<string>>} Array of initials.
 */
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

    for (let id in contacts) {
      let name = contacts[id].split(" ");
      let firstinit = name[0][0];
      let second = name[1] ? name[1][0] : "";
      inits.push([firstinit.toUpperCase(), second.toUpperCase()]);
    }
    return inits;
  } else {
    return [];
  }
}

/**
 * Counts the number of completed subtasks.
 * @param {number} i - Index of the task.
 * @param {Object} alltask - The task object.
 * @returns {number} Number of completed subtasks.
 */
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

/**
 * Renders a task card.
 * @param {Array<Object>} task - Array of tasks in the section.
 * @param {number} subtasklength - Number of subtasks.
 * @param {number} i - Index of the task.
 * @param {string} categoryColor - CSS class for the category.
 * @param {string} prio - Priority icon file name.
 * @param {number} checked - Number of completed subtasks.
 * @returns {string} HTML string for the task card.
 */
function renderToDos(task, subtasklength, i, categoryColor, prio, checked) {
  return `
      <div class="ticket-card" id="ticket-${task[i].id}" draggable="true" onclick="openCard('${task[i].id}')"
            ondragstart="startDragging('${task[i].id}')">
            <div class="top-part" id="top-part">
                <div class="${categoryColor}" id="pill">
                    <p>${task[i].category}</p>
                </div>
                <div class="dropdown">
                     <img src="../assets/img/3dots.svg" alt="" id="dots-${task[i].id}" class="dots" onclick="openMenu('${task[i].id}', event)">
                  <div id="myDropdown-${task[i].id}" class="dropdown-content">
                    <a onclick="stopEventPropagation(event); changeSections('todo','${task[i].id}');">To do</a>
                    <a onclick="stopEventPropagation(event); changeSections('inprogress', '${task[i].id}');">In progress</a>
                    <a onclick="stopEventPropagation(event); changeSections('awaitfeedback', '${task[i].id}');">Await feedback</a>
                    <a onclick="stopEventPropagation(event); changeSections('done','${task[i].id}');">Done</a>
                  </div>
                </div>
            </div>
            <div class="title-notice">
                <p id="ticket-title">${task[i].title}</p>
                <p class="ticket-notice" id="ticket-notice">${task[i].description}</p>
            </div>

            <div class="progress-bar-section" id="progress-bar-section${task[i].id}">
                <div class="progress-bar">
                    <div class="progress-bar-filler" id="filler-${task[i].id}"></div>
                </div>
                <p id="subtasks">${checked}/${subtasklength} Subtasks</p>
            </div>

            <div class="contacts-section" id="contacts-section${task[i].id}">
                <div class="contacts" id="contact-images${task[i].id}"></div>
                <p class="d-none" id="over-amount${task[i].id}"> test </p>
                <img src="../assets/img/${prio}" alt="" />
            </div>
      </div>`;
}

/**
 * Changes the section of a task.
 * @param {string} section - The new section to move the task to.
 * @param {string} id - The ID of the task.
 */
function changeSections(section, id) {
  currentDraggedElement = id;
  moveTo(section);
}

/**
 * Renders contact initials.
 * @param {Array<string>} inits - Initials of the contact.
 * @param {Array<string>} allcolors - Colors associated with contacts.
 * @param {number} j - Index of the contact.
 * @returns {string} HTML string for the contact initials.
 */
function renderContactsImages(inits, allcolors, j) {
  return `<div class="contact-initals" id="contact-initals1" style="background-color: ${allcolors[j]};">
                                <span>${inits[0]}${inits[1]}</span>
                              </div>`;
}

/**
 * Checks if sections are empty and shows/hides the empty message.
 */
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

/**
 * Opens the 'Add Task' form.
 * @param {string} section - The section where the task will be added.
 */
function openAddTask(section) {
  if (window.innerWidth > 1024) {
    let body = document.getElementById("body");
    let background = document.getElementById("background-grey");
    background.classList.remove("d-none");
    body.innerHTML += `<iframe class="add-task-card" name="${section}" id="whole-addtask-card" src="./addtask-card.html"></iframe>`;
  } else {
    window.location.href = "./addtask.html";
  }
}

/**
 * Closes a window or modal.
 * @param {string} card - The ID of the card or modal to close.
 */
function closeWindow(card) {
  let addtask = document.getElementById(card);
  let background = document.getElementById("background-grey");
  setTimeout(() => {
    background.classList.add("d-none");
    addtask.remove();
    loadTasks();
  }, 100);
}

/**
 * Helper function to render information in the task card.
 * @param {string} sections - The section to render.
 * @param {Object} card - The task object.
 * @param {Document} iframeDocument - The document of the iframe.
 */
function renderInfoCardHelper(sections, card, iframeDocument) {
  let sectionsElement = iframeDocument.getElementById(sections);
  sectionsElement.innerHTML = card[`${sections}`];
}

/**
 * Renders the information of a task in the task card.
 * @param {string} idnumber - The ID of the task.
 */
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

/**
 * Renders information in the edit task card.
 * @param {Document} iframeDocument - The document of the iframe.
 * @param {Object} card - The task object.
 */
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

/**
 * ID counter for subtasks.
 * @type {number}
 */
let id = 0;

/**
 * Adds a subtask to the subtask list.
 */
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

/**
 * Retrieves all subtasks of a task and renders them.
 * @param {Object} card - The task object.
 * @param {Document} iframeDocument - The document of the iframe.
 */
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
  }
  boardCardContent.innerHTML += renderBoardCardButtons(card.id);
}

/**
 * Renders the delete and edit buttons on the task card.
 * @param {string} id - The ID of the task.
 * @returns {string} HTML string for the buttons.
 */
function renderBoardCardButtons(id) {
  return `<div class="delete-edit">
                <div class="delete" id="delete-btn-${id}" onclick="deleteTask('${id}'), parent.closeWindow('card-infos')">
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

/**
 * Checks if a subtask is completed.
 * @param {Object} card - The task object.
 * @param {number} i - Index of the subtask.
 * @returns {string} 'checked' if completed, otherwise an empty string.
 */
function ifChecked(card, i) {
  let alltasks = Object.values(card.subtask);
  if (alltasks[i] == "inwork") {
    return "";
  } else if (alltasks[i] == "done") {
    return "checked";
  }
}

/**
 * Retrieves and renders assigned contacts for a task.
 * @param {Object} card - The task object.
 * @param {Document} iframeDocument - The document of the iframe.
 */
function getAssignedTo(card, iframeDocument) {
  if (!card.assignedto == false) {
    if (typeof card.assignedto === "object") {
      let newcard = JSON.stringify(card.assignedto);
      let reuslt = newcard.replaceAll("[", "").replaceAll("]", "").replaceAll('"', "");
      card.assignedto = reuslt;
    }
    let contacts = card.assignedto.split(",");

    let inits = [];
    let contact = card.assignedto;

    let contactss = contact.split(",");
    for (let id in contacts) {
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
}

/**
 * Renders HTML for a subtask checkbox.
 * @param {number} i - Index of the subtask.
 * @param {Array<string>} task - Array of subtask names.
 * @param {number} tasklength - Total number of subtasks.
 * @param {string} checked - 'checked' if the subtask is completed.
 * @param {Object} card - The task object.
 * @returns {string} HTML string for the subtask checkbox.
 */
function subtasksHTML(i, task, tasklength, checked, card) {
  return `<div class="subtasks-checkboxes" id="board-card-${card.id}-${i}">
                    <div class="checkbox-wrapper-19" >
                        <input type="checkbox" id="cbtest-19-${i}" onclick="parent.subtaskProcesBar('${card.id}', ${i}, ${tasklength}); boardCardSubtaskChecked(${i})" ${checked}/>
                        <label for="cbtest-19-${i}" class="check-box">
                    </div>
                    <p>${task[i]}</p>
                </div>`;
}

/**
 * Renders HTML for an assigned contact.
 * @param {string} contact - Name of the contact.
 * @param {string} init - Initials of the contact.
 * @param {string} color - Color associated with the contact.
 * @returns {string} HTML string for the assigned contact.
 */
function contactsHTML(contact, init, color) {
  return `<div class="assigned-contacts">
                    <div class="contact-circle" id="contact-circle" style="background-color: ${color};"><span id="contact-inits">${init}</span></div>
                    <p>${contact}</p>
                </div>`;
}

/**
 * Sets the priority indicator in the task card.
 * @param {Object} card - The task object.
 * @param {Document} iframeDocument - The document of the iframe.
 */
function setPrio(card, iframeDocument) {
  if (card.prio == "urgent") {
    iframeDocument.getElementById("urgent").classList.remove("d-none");
  } else if (card.prio == "medium") {
    iframeDocument.getElementById("medium").classList.remove("d-none");
  } else if (card.prio == "low") {
    iframeDocument.getElementById("low").classList.remove("d-none");
  }
}

/**
 * Opens the detailed view of a task.
 * @param {string} id - The ID of the task.
 */
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

/**
 * Updates the subtask progress bar when a subtask is checked or unchecked.
 * @param {string} cardId - The ID of the task.
 * @param {number} id - Index of the subtask.
 * @param {number} tasklength - Total number of subtasks.
 */
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

/**
 * Gets the number of completed subtasks in a task.
 * @param {Object} task - The task object.
 * @returns {number} Number of completed subtasks.
 */
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

/**
 * Retrieves a task by its ID.
 * @param {string} crypticId - The ID of the task.
 * @returns {Object} The task object.
 */
function getCardById(crypticId) {
  let newtask = {};
  tasks.forEach((task) => {
    if (task.id == crypticId) {
      newtask = task;
    }
  });
  return newtask;
}

/**
 * Updates the subtask progress on the task card.
 * @param {number} count - Number of completed subtasks.
 * @param {number} tasklength - Total number of subtasks.
 */
function setSubTaskProces(count, tasklength) {
  let taskCard = document.getElementById(`ticket-${clickedCardId}`);
  let subtask = taskCard.querySelector("#subtasks");

  subtask.innerHTML = `${count}/${tasklength} Subtasks`;
  fillProgressBar(count, tasklength);
}

/**
 * Fills the progress bar based on completed subtasks.
 * @param {number} count - Number of completed subtasks.
 * @param {number} length - Total number of subtasks.
 */
function fillProgressBar(count, length) {
  let progressBar = document.getElementById(`filler-${clickedCardId}`);
  let result = (count / length) * 100;
  progressBar.style.width = `${result}%`;
}

/**
 * Switches the task card to edit mode.
 */
function editTask() {
  let card = document.getElementById("card-infos");
  card.id = "edit-card";
  card.src = "./board-card-edit.html";
}

/**
 * Searches for tasks based on user input.
 */
function searchCard() {
  addEventListener("keyup", () => {
    let input = document.getElementById("search-field");
    if (input.value.length >= 3) {
      for (let i = 0; i < tasks.length; i++) {
        let card = document.getElementById(`ticket-${tasks[i].id}`);
        card.classList.add("d-none");
        if (
          tasks[i].title.toLowerCase().includes(input.value.toLowerCase()) ||
          tasks[i].description.toLowerCase().includes(input.value.toLowerCase())
        ) {
          card.classList.remove("d-none");
        }
      }
    } else {
      for (let i = 0; i < tasks.length; i++) {
        let card = document.getElementById(`ticket-${tasks[i].id}`);
        card.classList.remove("d-none");
      }
    }
  });
}

/**
 * Opens the dropdown menu for a task card.
 * @param {string} id - The ID of the task.
 * @param {Event} event - The click event.
 */
function openMenu(id, event) {
  let dots = document.getElementById(`dots-${id}`);
  dots.src = "../assets/img/3drots-blue.svg";
  event.stopPropagation();

  let dropdowns = document.getElementsByClassName("dropdown-content");
  for (let i = 0; i < dropdowns.length; i++) {
    if (dropdowns[i].classList.contains("show") && dropdowns[i].id !== `myDropdown-${id}`) {
      dropdowns[i].classList.remove("show");
    }
  }
  document.getElementById(`myDropdown-${id}`).classList.toggle("show");
}

/**
 * Global click handler to close dropdown menus when clicking outside.
 * @param {Event} event - The click event.
 */
window.onclick = function (event) {
  let allDots = document.getElementsByClassName("dots");
  for (let x = 0; x < allDots.length; x++) {
    allDots[x].src = "../assets/img/3dots.svg";
  }
  if (!event.target.matches(".dots")) {
    let dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

/**
 * Stops event propagation.
 * @param {Event} event - The event to stop propagation on.
 */
function stopEventPropagation(event) {
  event.stopPropagation();
}
