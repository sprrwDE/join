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

function onload() {
  loadContacts();
  includeHTML();
  dropDown();
  taskSelected();
}

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
      status: "todo",
      id: 0,
      color: `${tasks.color}`,
      inits: `${tasks.inits}`,
    }),
  });
}

let BASE_URL = "https://join-318-default-rtdb.europe-west1.firebasedatabase.app/";

function loadContacts() {
  fetch(BASE_URL + "/contacts.json")
    .then((response) => response.json())
    .then((result) => renderContacts(result))
    .catch((error) => console.log(error));
}

function getContactInitials(contacts) {
  let newcontact = contacts.split(" ");
  let firstinits = newcontact[0]?.charAt(0).toUpperCase() || "";
  let secondinits = newcontact[1]?.charAt(0).toUpperCase() || "";
  return [firstinits, secondinits];
}

function renderContacts(contacts) {
  let contactcontainer = document.getElementById("all-contacts");
  let allcontacts = [];
  let colors = [];

  for (let letter in contacts) {
    allcontacts.push(contacts[letter].nameIn);
    colors.push(contacts[letter].color);
  }
  for (i = 0; i < allcontacts.length; i++) {
    allcontacts[i] ||= "Kontakt nicht gefunden";
    let [firstinits, secondinits] = getContactInitials(allcontacts[i]);
    tasks.inits += firstinits+secondinits+","
    console.log(tasks.inits)
    contactcontainer.innerHTML += renderAssignedTo(allcontacts, i, firstinits, secondinits, colors);
    contactsImages(i);
  }
}

function contactsImages(i) {
  let imgcontainer = document.getElementById("contacts-imges");
  let inits = document.getElementById(`inits${i}`).innerHTML;
  imgcontainer.innerHTML += renderContactsImages(inits, i);
}

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

function closeAssignedList() {
  let palceholder = document.getElementById("assigne-placeholder");
  let contactimages = document.getElementById("contacts-imges");
  let search = document.getElementById("search-container");
  let dropdown = document.getElementById("all-contacts");
  let dropdownToggle = document.getElementById("contacts-searchfield");

  palceholder.style.display = "";
  dropdown.classList.add("d-none");
  search.classList.add("d-none");
  dropdown.style.animation = "";
  document.getElementById("arrow-down").style.animation = "";
  contactimages.classList.remove("d-none");
  dropdownToggle.classList.remove("focused");
}

function openAssignedList() {
  let palceholder = document.getElementById("assigne-placeholder");
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
  palceholder.style.display = "none";
  dropdownToggle.classList.add("focused");
}

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

function assignedToChecked(id) {
  let checkbox = document.getElementById(`cbtest-19-${id}`);
  let grandParent = checkbox.parentElement.parentElement;
  let img = document.getElementById(`contact-initals1${id}`);
  let contactimg = document.getElementById(`contact-initals${id}`);
  let color = contactimg.style.backgroundColor;
  let contactid = document.getElementById(`id=${id}`);
  let contact = contactid.getElementsByTagName("p");
  toggleCheckbox(id);
  console.log(id)

  if (checkbox.checked) {
    img.classList.remove("d-none");
    img.style.backgroundColor = color;
    tasks.assignedto.push(contact[0].textContent);
    getSelectedColor(color);
  } else {
    deleteSelectedColor(color);
    img.classList.add("d-none");
    let remove = tasks.assignedto.indexOf(contact[0].textContent);
    tasks.assignedto.splice(remove, 1);
  }
  grandParent.classList.toggle("background");
}

function toggleCheckbox(i) {
  let checkbox = document.getElementById(`cbtest-19-${i}`);
  checkbox.checked = !checkbox.checked;
}

getcolors = [];
function deleteSelectedColor(color) {
  let index = getcolors.indexOf(color);
  getcolors.splice(index, 1);
  tasks.color = getcolors;
}

function getSelectedColor(color) {
  if (!getcolors.includes(color)) {
    getcolors.push(color);
    tasks.color = getcolors
  }
}

function taskSelected(task) {
  let categorylist = document.getElementById("categorys");
  let category = document.getElementById("input-category");
  let selecttask = document.getElementById("select-task");
  let tech = document.getElementById("tech");
  let user = document.getElementById("user");
  let categorytext = document.getElementById("category-required");
  let categoryDiv = document.getElementById("input-category");

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

function subtaskIsEmpty() {
  let searchbar = document.getElementById("subtask-search-bar");
  let required = document.getElementById("subtask-required");

  searchbar.classList.add("notfound");
  required.classList.remove("d-none");
}

let id = 0;

function cancelSubtaskInput() {
  let input = document.getElementById("input-subtask");
  let addimg = document.getElementById("add-img");
  let notok = document.getElementById("ok-notok-section");

  input.value = "";
  addimg.classList.remove("d-none");
  notok.classList.add("d-none");
}

function addToSubtask() {
  let input = document.getElementById("input-subtask");
  let subtaskcontainer = document.getElementById("subtasklist");
  id++;
  if (input.value == "") {
    subtaskIsEmpty();
  } else {
    subtaskcontainer.innerHTML += renderAddToSubtaskList(id, input);
    input.value = "";
  }
}

function getTitle() {
  let input = document.getElementById("input-title");
  let required = document.getElementById("title-required");

  if (input.value == "") {
    console.log(input.value);
    input.style.border = "1px solid rgb(248, 84, 103)";
    required.classList.remove("d-none");
  } else {
    tasks.title = input.value;
  }
}

function deleteSubtask(id) {
  let subtask = document.getElementById(`id-${id}`);
  subtask.remove();
}

function editSubtask(id) {
  let subtask = document.getElementById(`id-${id}`);
  let editdelete = document.getElementById(`edit-delete${id}`);
  let task = document.getElementById(`subtask${id}`);

  task.innerHTML = renderInputfieldEdit(id, task.innerHTML);
  editdelete.innerHTML = renderEditOptions(id);
  subtask.classList.replace("task", "onedit");
}

function edited(id) {
  let newtask = document.getElementById(`newtask${id}`).value;
  let subtask = document.getElementById(`id-${id}`);
  let task = document.getElementById(`subtask${id}`);
  let editdelete = document.getElementById(`edit-delete${id}`);
  subtask.classList.replace("onedit", "task");

  editdelete.innerHTML = renderEditDoneImages(id);
  task.innerHTML = newtask;
}

function inputTyping() {
  document.getElementById("input-title").style.border = "";
  document.getElementById("title-required").classList.add("d-none");
}

function getDescription() {
  let description = document.getElementById("text-area").value;
  tasks.description = description;
}

function getDate() {
  let dateInput = document.getElementById("input-date");
  tasks.date = dateInput.value;
  document.getElementById("date-required").classList.add("d-none");
  dateInput.style.border = "";
}

function getSubtasks() {
  let subtasklist = document.getElementById("subtasklist");
  let subtask = subtasklist.getElementsByTagName("li");

  for (let i = 0; i < subtask.length; i++) {
    tasks.subtask.push(subtask[i].innerHTML);
  }
}

function requiredFieldsCheck() {
  let date = document.getElementById("input-date");
  isCategroySelected();

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

function isCategroySelected() {
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

function getAllInfos() {
  getTitle();
  getDescription();
  getSubtasks();
  if (requiredFieldsCheck() == true) {
    postInfos();
    setTimeout(() => {
      window.location.reload()
    }, 1000);
  }
}

function clearAllFields() {
  window.location.reload();
}