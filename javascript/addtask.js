/**
 * Global task object to store task information.
 * @type {Object}
 */
let tasks = {
  title: "",
  description: "",
  assignedto: [],
  date: "",
  prio: "",
  category: "",
  subtask: [],
  color: "",
  inits: "",
};

/** @type {string} */
let section;

/** @type {Object} */
let listOfContacts;

/**
 * Loads initial data and initializes the application.
 */
function onload() {
  loadContacts();
  includeHTML();
  dropDown();
  taskSelected();
  selectedPrio("medium");
  init();
}

/**
 * Sends task information to the server to save it.
 */
function postInfos() {
  fetch(BASE_URL + "/addTask.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: `${tasks.title}`,
      description: `${tasks.description}`,
      assignedto: `${tasks.assignedto}`,
      date: `${tasks.date}`,
      prio: `${tasks.prio}`,
      category: `${tasks.category}`,
      subtask: `${tasks.subtask}`,
      status: `${section}`,
      id: 0,
      color: `${tasks.color}`,
      inits: `${tasks.inits}`,
    }),
  });
}

/** @constant {string} */
let BASE_URL = "https://join-318-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Loads contacts from the server and passes them for rendering.
 */
function loadContacts() {
  fetch(BASE_URL + "/contacts.json")
    .then((response) => response.json())
    .then((result) => renderContacts(result))
    .catch((error) => console.log(error));
}

/**
 * Extracts the initials of a contact.
 * @param {string} contacts - The full name of the contact.
 * @returns {Array<string>} - An array containing the initials.
 */
function getContactInitials(contacts) {
  let newcontact = contacts.split(" ");
  let firstinits = newcontact[0]?.charAt(0).toUpperCase() || "";
  let secondinits = newcontact[1]?.charAt(0).toUpperCase() || "";
  return [firstinits, secondinits];
}

/**
 * Renders the loaded contacts in the UI.
 * @param {Object} contacts - An object containing contact data.
 */
function renderContacts(contacts) {
  listOfContacts = contacts;
  let contactcontainer = document.getElementById("all-contacts");
  let allcontacts = [];
  let colors = [];

  for (let letter in contacts) {
    allcontacts.push(contacts[letter].nameIn);
    colors.push(contacts[letter].color);
  }
  for (i = 0; i < allcontacts.length; i++) {
    allcontacts[i] ||= "Contact not found";
    let [firstinits, secondinits] = getContactInitials(allcontacts[i]);
    tasks.inits += firstinits + secondinits + ",";
    contactcontainer.innerHTML += renderAssignedTo(allcontacts, i, firstinits, secondinits, colors);
    contactsImages(i);
  }
}

/**
 * Updates the contact images in the UI.
 * @param {number} i - The index of the current contact.
 */
function contactsImages(i) {
  let imgcontainer = document.getElementById("contacts-imges");
  let inits = document.getElementById(`inits${i}`).innerHTML;
  imgcontainer.innerHTML += renderContactsImages(inits, i);
}

/**
 * Manages the dropdown menu for the contact list.
 */
function dropDown() {
  let dropdown = document.getElementById("all-contacts");
  let dropdownToggle = document.getElementById("contacts-searchfield");
  let arrow = document.getElementById("arrow-down");
  arrowstate = false;

  document.addEventListener("click", (event) => {
    if (dropdownToggle.contains(event.target) && event.target.tagName === "IMG") {
      if (arrowstate === false) {
        openAssignedList();
      } else {
        closeAssignedList();
      }
      arrowstate = !arrowstate;
    } else if (!dropdown.contains(event.target) && !dropdownToggle.contains(event.target)) {
      closeAssignedList();
    } else if (arrow.contains(event.target)) {
      openAssignedList();
    } else {
      openAssignedList();
    }
  });
}

/**
 * Closes the dropdown list of contacts.
 */
function closeAssignedList() {
  let placeholder = document.getElementById("assigne-placeholder");
  let contactimages = document.getElementById("contacts-imges");
  let search = document.getElementById("search-container");
  let dropdown = document.getElementById("all-contacts");
  let dropdownToggle = document.getElementById("contacts-searchfield");

  placeholder.style.display = "";
  dropdown.classList.add("d-none");
  search.classList.add("d-none");
  dropdown.style.animation = "";
  document.getElementById("arrow-down").style.animation = "";
  contactimages.classList.remove("d-none");
  dropdownToggle.classList.remove("focused");
}

/**
 * Opens the dropdown list of contacts.
 */
function openAssignedList() {
  let placeholder = document.getElementById("assigne-placeholder");
  let input = document.getElementById("myInput");
  let contactimages = document.getElementById("contacts-imges");
  let search = document.getElementById("search-container");
  let dropdown = document.getElementById("all-contacts");
  let dropdownToggle = document.getElementById("contacts-searchfield");

  dropdown.classList.remove("d-none");
  search.classList.remove("d-none");
  dropdown.style.animation = "slowdropdown 0.7s forwards";
  document.getElementById("arrow-down").style.animation = "rotate 0.5s forwards";
  contactimages.classList.add("d-none");
  input.focus();
  placeholder.style.display = "none";
  dropdownToggle.classList.add("focused");
}

/**
 * Filters the contact list based on user input.
 */
function filterFunction() {
  let input = document.getElementById("myInput");
  let filter = input.value.toUpperCase();
  let div = document.getElementById("all-contacts");
  let pElements = div.getElementsByTagName("p");
  let nocontact = document.getElementById("noContact");
  let filteredContacts = [];

  nocontact.classList.add("d-none");
  for (let i = 0; i < pElements.length; i++) {
    let txtValue = pElements[i].textContent || pElements[i].innerText;
    let grandParent = pElements[i].parentElement.parentElement;

    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      grandParent.style.display = "";
      filteredContacts.push(txtValue);
    } else {
      grandParent.style.display = "none";
    }
  }
  if (filteredContacts.length == 0) {
    nocontact.classList.remove("d-none");
  }
}

/**
 * Sets the selected priority for the task.
 * @param {string} prio - The selected priority ("urgent", "medium", "low").
 */
function selectedPrio(prio) {
  let urgent = document.getElementById("urgent");
  let medium = document.getElementById("medium");
  let low = document.getElementById("low");
  let urgentimg = document.getElementById("urgent-img");
  let mediumimg = document.getElementById("medium-img");
  let lowimg = document.getElementById("low-img");

  setPrioDefault(urgent, medium, low, urgentimg, mediumimg, lowimg);

  if (prio == "urgent") {
    urgent.style.backgroundColor = "rgb(255, 61, 0)";
    urgent.style.color = "white";
    urgentimg.src = "../assets/img/urgent white.svg";
    tasks.prio = "urgent";
  } else if (prio == "medium") {
    medium.style.backgroundColor = "rgb(255, 168, 0)";
    medium.style.color = "white";
    mediumimg.src = "../assets/img/Capa 2 white.svg";
    tasks.prio = "medium";
  } else if (prio == "low") {
    low.style.backgroundColor = "rgb(122, 226, 41)";
    low.style.color = "white";
    lowimg.src = "../assets/img/low white.svg";
    tasks.prio = "low";
  }
}

/**
 * Resets the priority display to default values.
 * @param {HTMLElement} urgent - The urgent priority element.
 * @param {HTMLElement} medium - The medium priority element.
 * @param {HTMLElement} low - The low priority element.
 * @param {HTMLImageElement} urgentimg - The image for urgent priority.
 * @param {HTMLImageElement} mediumimg - The image for medium priority.
 * @param {HTMLImageElement} lowimg - The image for low priority.
 */
function setPrioDefault(urgent, medium, low, urgentimg, mediumimg, lowimg) {
  urgent.style.backgroundColor = "white";
  medium.style.backgroundColor = "white";
  low.style.backgroundColor = "white";
  urgentimg.src = "../assets/img/urgent.svg";
  mediumimg.src = "../assets/img/Capa 2.svg";
  lowimg.src = "../assets/img/low.svg";
  urgent.style.color = "black";
  medium.style.color = "black";
  low.style.color = "black";
}

/**
 * Handles the selection of a contact in the assignment list.
 * @param {number} id - The ID of the selected contact.
 */
function assignedToChecked(id) {
  let checkbox = document.getElementById(`cbtest-19-${id}`);
  let grandParent = checkbox.parentElement.parentElement;
  let img = document.getElementById(`contact-initals1${id}`);
  let contactimg = document.getElementById(`contact-initals${id}`);
  let color = contactimg.style.backgroundColor;
  let contactid = document.getElementById(`id=${id}`);
  let contact = contactid.getElementsByTagName("p");
  toggleCheckbox(id);

  if (checkbox.checked) {
    img.classList.remove("d-none");
    img.style.backgroundColor = color;
    getSelectedColor(color);
    tasks.assignedto.push(contact[0].textContent);
  } else {
    deleteSelectedColor(color);
    img.classList.add("d-none");
    let remove = tasks.assignedto.indexOf(contact[0].textContent);
    tasks.assignedto.splice(remove, 1);
  }
  grandParent.classList.toggle("background");
}

/**
 * Toggles the state of the checkbox.
 * @param {number} i - The index of the checkbox.
 */
function toggleCheckbox(i) {
  let checkbox = document.getElementById(`cbtest-19-${i}`);
  checkbox.checked = !checkbox.checked;
}

/** @type {Array<string>} */
getcolors = [];

/**
 * Removes a selected color from the list.
 * @param {string} color - The color to be removed.
 */
function deleteSelectedColor(color) {
  let index = getcolors.indexOf(color);
  getcolors.splice(index, 1);
  tasks.color = getcolors;
}

/**
 * Adds a selected color to the list.
 * @param {string} color - The color to be added.
 */
function getSelectedColor(color) {
  if (!getcolors.includes(color)) {
    getcolors.push(color);
    tasks.color = getcolors;
  }
}

/**
 * Handles the selection of a category or task.
 * @param {string} [task] - The selected task or category.
 */
function taskSelected(task) {
  let categorylist = document.getElementById("categorys");
  let category = document.getElementById("input-category");
  let selecttask = document.getElementById("select-task");
  let tech = document.getElementById("tech");
  let user = document.getElementById("user");
  let categorytext = document.getElementById("category-required");
  let categoryDiv = document.getElementById("input-category");
  selecttask.innerHTML = "Select task category";

  document.addEventListener("click", (event) => {
    if (!category.contains(event.target)) {
      categorylist.classList.add("d-none");
    } else if (category.contains(event.target) && event.target.tagName === "IMG") {
      categorylist.classList.add("d-none");
    } else {
      categorylist.classList.remove("d-none");
      categorytext.classList.add("d-none");
      categoryDiv.classList.remove("notfound");
    }
  });

  if (task == "tech") {
    tech.classList.add("background");
    user.classList.remove("background");
    selecttask.innerHTML = "Technical Task";
    tasks.category = "Technical Task";
  } else if (task == "user") {
    user.classList.add("background");
    tech.classList.remove("background");
    selecttask.innerHTML = "User Story";
    tasks.category = "User Story";
  }
}

/**
 * Adds a new subtask.
 */
function addSubtask() {
  let addimg = document.getElementById("add-img");
  let notok = document.getElementById("ok-notok-section");
  let subtasklist = document.getElementById("subtasklist");
  let input = document.getElementById("input-subtask");
  let searchbar = document.getElementById("subtask-search-bar");
  let required = document.getElementById("subtask-required");
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      if (input.value === "") {
        subtaskIsEmpty();
      } else {
        addToSubtask();
      }
    } else {
      searchbar.classList.remove("notfound");
      required.classList.add("d-none");
    }
  });

  addimg.classList.add("d-none");
  notok.classList.remove("d-none");
  subtasklist.classList.remove("d-none");
}

/**
 * Displays an error message when the subtask is empty.
 */
function subtaskIsEmpty() {
  let searchbar = document.getElementById("subtask-search-bar");
  let required = document.getElementById("subtask-required");

  searchbar.classList.add("notfound");
  required.classList.remove("d-none");
}

/** @type {number} */
let id = 0;

/**
 * Cancels the input of a new subtask.
 */
function cancelSubtaskInput() {
  let input = document.getElementById("input-subtask");
  let addimg = document.getElementById("add-img");
  let notok = document.getElementById("ok-notok-section");

  input.value = "";
  addimg.classList.remove("d-none");
  notok.classList.add("d-none");
}

/**
 * Adds the entered subtask to the list.
 */
function addToSubtask() {
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
 * Retrieves the task title from the input field.
 */
function getTitle() {
  let input = document.getElementById("input-title");
  let required = document.getElementById("title-required");

  if (input.value == "") {
    input.style.border = "1px solid rgb(248, 84, 103)";
    required.classList.remove("d-none");
  } else {
    tasks.title = input.value;
  }
}

/**
 * Deletes a subtask from the list.
 * @param {number} id - The ID of the subtask to delete.
 */
function deleteSubtask(id) {
  let subtask = document.getElementById(`id-${id}`);
  subtask.remove();
}

/**
 * Enables editing of a subtask.
 * @param {number} id - The ID of the subtask to edit.
 */
function editSubtask(id) {
  let subtask = document.getElementById(`id-${id}`);
  let editdelete = document.getElementById(`edit-delete${id}`);
  let task = document.getElementById(`subtask${id}`);

  task.innerHTML = renderInputfieldEdit(id, task.innerHTML);
  editdelete.innerHTML = renderEditOptions(id);
  subtask.classList.replace("task", "onedit");
}

/**
 * Saves the edited subtask.
 * @param {number} id - The ID of the edited subtask.
 */
function edited(id) {
  let newtask = document.getElementById(`newtask${id}`).value;
  let subtask = document.getElementById(`id-${id}`);
  let task = document.getElementById(`subtask${id}`);
  let editdelete = document.getElementById(`edit-delete${id}`);
  subtask.classList.replace("onedit", "task");

  editdelete.innerHTML = renderEditDoneImages(id);
  task.innerHTML = newtask;
}

/**
 * Resets the input fields for the title when the user types.
 */
function inputTyping() {
  document.getElementById("input-title").style.border = "";
  document.getElementById("title-required").classList.add("d-none");
}

/**
 * Retrieves the task description from the input field.
 */
function getDescription() {
  let description = document.getElementById("text-area").value;
  tasks.description = description;
}

/**
 * Retrieves the task date from the input field.
 */
function getDate() {
  let dateInput = document.getElementById("input-date");
  tasks.date = dateInput.value;
  document.getElementById("date-required").classList.add("d-none");
  dateInput.style.border = "";
}

/**
 * Retrieves all subtasks from the list.
 */
function getSubtasks() {
  let subtasklist = document.getElementById("subtasklist");
  let subtask = subtasklist.getElementsByTagName("li");
  for (let i = 0; i < subtask.length; i++) {
    tasks.subtask.push("'" + subtask[i].innerHTML + "'");
  }
}

/**
 * Checks if all required fields are filled.
 * @returns {boolean} - True if all required fields are filled.
 */
function requiredFieldsCheck() {
  let date = document.getElementById("input-date");
  isCategorySelected();

  if (!date.value) {
    date.style.border = "1px solid rgb(255, 129, 144)";
    document.getElementById("date-required").classList.remove("d-none");
  }
  if (!tasks.date || !tasks.title || !tasks.category) {
    return false;
  } else {
    return true;
  }
}

/**
 * Checks if a category has been selected.
 */
function isCategorySelected() {
  let categoryselected = document.getElementById("select-task").innerHTML;
  let inputfield = document.getElementById("input-category");
  let required = document.getElementById("category-required");

  if (categoryselected == "User Story" || categoryselected == "Technical Task") {
    inputfield.classList.remove("notfound");
    required.classList.add("d-none");
  } else {
    inputfield.classList.add("notfound");
    required.classList.remove("d-none");
  }
}

/**
 * Checks the current status of the task.
 */
function checkStatus() {
  let iframe = window.parent.document.getElementById("whole-addtask-card");
  if (iframe) {
    let name = iframe.getAttribute("name");
    section = name;
  } else {
    section = "todo";
  }
}

/**
 * Checks if the current page is "addtask-card.html".
 * @returns {boolean} - True if the current page is "addtask-card.html".
 */
function checkWindowLocation() {
  if (window.location.href.endsWith("documents/addtask-card.html")) {
    return true;
  } else {
    return false;
  }
}

/**
 * Retrieves all task information and validates inputs.
 */
function getAllInfos() {
  getTitle();
  getDescription();
  getSubtasks();
  if (requiredFieldsCheck() == true) {
    checkStatus();
    postInfos();
    if (checkWindowLocation()) {
      successDisplay();
      setTimeout(() => {
        parent.closeWindow("whole-addtask-card");
      }, 2000);
    } else {
      successDisplay();
      setTimeout(() => {
        window.location = "./board.html";
      }, 2000);
    }
  }
}

/**
 * Clears all input fields and resets the form.
 */
function clearAllFields() {
  tasks = {
    title: "",
    description: "",
    assignedto: [],
    date: "",
    prio: "",
    category: "",
    subtask: [],
    color: "",
    inits: "",
  };

  let title = document.getElementById("input-title");
  let desc = document.getElementById("text-area");
  let contacts = document.getElementById("all-contacts");
  let imges = document.getElementById("contacts-imges");
  let date = document.getElementById("input-date");
  let subtasks = document.getElementById("subtasklist");

  subtasks.innerHTML = "";
  date.value = "";
  imges.innerHTML = "";
  title.value = "";
  desc.value = "";
  contacts.innerHTML = "";
  renderContacts(listOfContacts);
  selectedPrio("medium");
  taskSelected();
}

/**
 * Displays a success message.
 */
function successDisplay() {
  let container = document.getElementById("success-container");
  container.classList.remove("d-none");
}
