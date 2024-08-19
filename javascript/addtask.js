function init() {
  loadContacts();
  includeHTML()
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

function loadContacts() {
  fetch(
    "https://join-318-default-rtdb.europe-west1.firebasedatabase.app/contacts.json"
  )
    .then((response) => response.json())
    .then((result) => renderContacts(result))
    .catch((error) => console.log(error));
}

function renderContacts(contacts) {
  let contactcontainer = document.getElementById("all-contacts");
  let contactscount = Object.keys(contacts).length;

  for (i = 0; i < contactscount; i++) {
    let contact = Object.keys(contacts)[i];
    contactcontainer.innerHTML += renderAssignedTo(contacts, contact,i);
  }

}

function search() {
  let palceholder = document.getElementById("assigne-placeholder");
  let search = document.getElementById("search-container");
  let contacts = document.getElementById("all-contacts");
  let input = document.getElementById("myInput");

  
  contacts.classList.toggle("d-none");
  search.classList.toggle("d-none");
  if (palceholder.style.display == "none") {
    palceholder.style.display = "";
    document.getElementById("arrow-down").style.animation = ""
  } else {
    input.focus();
    document.getElementById("arrow-down").style.animation = "rotate 0.5s forwards"
    palceholder.style.display = "none";
    contacts.style.animation = "slowdropdown 2s forwards"
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

  if (checkbox.checked) {
    console.log("checked" + id);
  } else {
    console.log("not checked" + id);
  }
  grandParent.classList.toggle("background");
}
