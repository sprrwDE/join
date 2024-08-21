function init() {
  loadContacts();
  includeHTML();
}

function test() {
  fetch(
    "https://jjoin-1146d-default-rtdb.europe-west1.firebasedatabase.app/addTask.json",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "erer", description: "cvcvcvc" }),
    }
  );
}

let BASE_URL =
  "https://join-318-default-rtdb.europe-west1.firebasedatabase.app/";

function loadContacts() {
  fetch(BASE_URL + "/contacts.json")
    .then((response) => response.json())
    .then((result) => renderContacts(result))
    .catch((error) => console.log(error));
}

function getRandomColor() {
  let randomNumber = Math.floor(Math.random() * 16777215);
  let randomColor = "#" + randomNumber.toString(16).padStart(6, "0");
  return randomColor;
}

function getContactInitials(contacts) {
  let newcontact = contacts.split(" ");
  let firstinits = newcontact[0].charAt(0);
  let secondinits = newcontact[1]?.charAt(0) || "";
  return [firstinits, secondinits];
}

function renderContacts(contacts) {
  let contactcontainer = document.getElementById("all-contacts");
  let allcontacts = [];

  for (let letter in contacts) {
    for (let key in contacts[letter]) {
      allcontacts.push(contacts[letter][key].name);
    }
  }
  for (i = 0; i < allcontacts.length; i++) {
    let [firstinits, secondinits] = getContactInitials(allcontacts[i]);
    contactcontainer.innerHTML += renderAssignedTo(
      allcontacts,
      i,
      firstinits,
      secondinits
    );
    contactsImages(i);
  }
}

function contactsImages(i) {
  let imgcontainer = document.getElementById("contacts-imges");
  let inits = document.getElementById(`inits${i}`).innerHTML;
  imgcontainer.innerHTML += renderContactsImages(inits, i);
}

function search() {
  let palceholder = document.getElementById("assigne-placeholder");
  let search = document.getElementById("search-container");
  let contacts = document.getElementById("all-contacts");
  let input = document.getElementById("myInput");
  let contactimages = document.getElementById("contacts-imges");

  contacts.classList.toggle("d-none");
  search.classList.toggle("d-none");
  if (palceholder.style.display == "none") {
    contactimages.classList.remove("d-none");
    palceholder.style.display = "";
    document.getElementById("arrow-down").style.animation = "";
  } else {
    contactimages.classList.add("d-none");
    input.focus();
    document.getElementById("arrow-down").style.animation =
      "rotate 0.5s forwards";
    palceholder.style.display = "none";
    contacts.style.animation = "slowdropdown 0.7s forwards";
  }
}

function filterFunction() {
  let input = document.getElementById("myInput");
  let filter = input.value.toUpperCase();
  let div = document.getElementById("all-contacts");
  let pElements = div.getElementsByTagName("p");

  for (let i = 0; i < pElements.length; i++) {
    let txtValue = pElements[i].textContent || pElements[i].innerText;
    let grandParent = pElements[i].parentElement.parentElement;

    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      grandParent.style.display = "";
    } else {
      grandParent.style.display = "none";
    }
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
  } else if (prio == "medium") {
    medium.style.backgroundColor = "rgb(255, 168, 0)";
    medium.style.color = "white";
    mediumimg.src = "../assets/img/Capa 2 white.svg";
  } else if (prio == "low") {
    low.style.backgroundColor = "rgb(122, 226, 41)";
    low.style.color = "white";
    lowimg.src = "../assets/img/low white.svg";
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

  if (checkbox.checked) {
    img.classList.remove("d-none");
    img.style.backgroundColor = color;
  } else {
    img.classList.add("d-none");
  }
  grandParent.classList.toggle("background");
}

function categorys() {
  let categorylist = document.getElementById("categorys");
  categorylist.classList.toggle("d-none");
}

function taskSelected(task) {
  let selecttask = document.getElementById("select-task");
  let tech = document.getElementById("tech");
  let user = document.getElementById("user");

  if (task == "tech") {
    tech.classList.add("background");
    user.classList.remove("background");
    selecttask.innerHTML = "Technical Task";
  } else if (task == "user") {
    user.classList.add("background");
    tech.classList.remove("background");
    selecttask.innerHTML = "User Story";
  }
}

function addSubtask() {
  let addimg = document.getElementById("add-img");
  let notok = document.getElementById("ok-notok-section");
  let subtasklist = document.getElementById("subtasklist");

  addimg.classList.add("d-none");
  notok.classList.remove("d-none");
  subtasklist.classList.remove("d-none");
}

function cancelSubtaskInput() {
  let input = document.getElementById("input-subtask");
  let addimg = document.getElementById("add-img");
  let notok = document.getElementById("ok-notok-section");
  let subtasklist = document.getElementById("subtasklist");
  input.value = "";
  addimg.classList.remove("d-none");
  notok.classList.add("d-none");
  subtasklist.classList.add("d-none");
}

let id = 0

function addToSubtask() {
  let input = document.getElementById("input-subtask");
  let subtaskcontainer = document.getElementById("subtasklist");
  id++
  

  subtaskcontainer.innerHTML += `<div class="task" id="id-${id}">
                            <li>${input.value}</li>
                            <div class="edit-delete">
                                <img src="../assets/img/edit.svg" alt="" onclick="editSubtask(${id})">
                                <img src="../assets/img/Vector 3.svg" alt="">
                                <img src="../assets/img/delete.svg" alt="" onclick="deleteSubtask(${id})">
                            </div>
                        </div>`;
  input.value = "";
}

function deleteSubtask(id) {
  let subtask = document.getElementById(`id-${id}`)
  subtask.remove()
}

function editSubtask(id) {
  let subtask = document.getElementById(`id-${id}`)
  
}