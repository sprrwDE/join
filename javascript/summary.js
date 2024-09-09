let Status = "https://join-318-default-rtdb.europe-west1.firebasedatabase.app/Status.json"

let amounts = {};

async function loadSummary() {
  await loadAccounts();
  setToDoNumbers();
  setDoneNumbers();
  setUrgent();
  setTaskInProgress();
  setAwaitFeedback();
  setTaskInBoard();
  getGreeting();
}


async function loadAccounts() {
  await fetch(Status)
    .then((response) => response.json())
    .then((result) => {
      amounts = result})
    .catch((error) => console.log('Fehler beim Abrufen der Daten:', error));
    
}

function getGreeting() {
  const now = new Date();
  const hour = now.getHours();
  let greeting;

  if (hour < 12) {
      greeting = "Guten Morgen";
  } else if (hour < 18) {
      greeting = "Guten Tag";
  } else {
      greeting = "Guten Abend";
  }

  showGreeting(greeting);
}

function showGreeting(greeting) {
  document.getElementById('greeting').innerHTML = `${greeting}`;
}


function setToDoNumbers() {
  let todo = amounts.todo;
  document.getElementById('to-do-counter').innerHTML = `${todo}`;
}
function setDoneNumbers() {
  let done = amounts.done;
  document.getElementById('done-counter').innerHTML = `${done}`;
}
function setUrgent() {
  let urgent = amounts.urgent;
  document.getElementById('urgent-counter').innerHTML = `${urgent}`;
}
function setTaskInProgress() {
  let progress = amounts.inprogress;
  document.getElementById('tasks-in-progress-counter').innerHTML = `${progress}`;
}
function setAwaitFeedback() {
  let feedback = amounts.awaitfeedback;
  document.getElementById('awaiting-feedback-counter').innerHTML = `${feedback}`;
}
function setTaskInBoard() {
  let todo = amounts.todo;
  let done = amounts.done;
  let progress = amounts.inprogress;
  let feedback = amounts.awaitfeedback;
  let Tasks = todo + done + progress + feedback;
  document.getElementById('tasks-in-board-counter').innerHTML = `${Tasks}`;
}
