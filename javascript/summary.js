let Status = "https://join-portfolio-2dadd-default-rtdb.europe-west1.firebasedatabase.app/Status.json"
let amounts = {};

/**
 * Loads account data and updates the summary section with various metrics.
 * This function fetches account data and then updates various counters and metrics on the page.
 * It should be called when the summary page is loaded or refreshed.
 * 
 * @async
 */
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

/**
 * Fetches account data from the server and stores it in the `amounts` variable.
 * @async
 * @throws {Error} Throws an error if the network request fails.
 */
async function loadAccounts() {
  await fetch(Status)
    .then((response) => response.json())
    .then((result) => {
      amounts = result;
    })
    .catch((error) => console.log('Error fetching data:', error));
}

/**
 * Displays a greeting message based on the current time of day.
 * The greeting message will be either "Good morning", "Good afternoon", or "Good evening".
 */
function getGreeting() {
  const now = new Date();
  const hour = now.getHours();
  let greeting;
  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }
  showGreeting(greeting);
}

/**
 * Updates the greeting message displayed on the page.
 * @param {string} greeting - The greeting message to be displayed.
 */
function showGreeting(greeting) {
  document.getElementById('greeting').innerHTML = `${greeting}`;
}

/**
 * Updates the number of to-do tasks displayed on the page.
 */
function setToDoNumbers() {
  let todo = amounts.todo;
  document.getElementById('to-do-counter').innerHTML = `${todo}`;
}

/**
 * Updates the number of completed tasks displayed on the page.
 */
function setDoneNumbers() {
  let done = amounts.done;
  document.getElementById('done-counter').innerHTML = `${done}`;
}

/**
 * Updates the number of urgent tasks displayed on the page.
 */
function setUrgent() {
  let urgent = amounts.urgent;
  document.getElementById('urgent-counter').innerHTML = `${urgent}`;
}

/**
 * Updates the number of tasks currently in progress displayed on the page.
 */
function setTaskInProgress() {
  let progress = amounts.inprogress;
  document.getElementById('tasks-in-progress-counter').innerHTML = `${progress}`;
}

/**
 * Updates the number of tasks awaiting feedback displayed on the page.
 */
function setAwaitFeedback() {
  let feedback = amounts.awaitfeedback;
  document.getElementById('awaiting-feedback-counter').innerHTML = `${feedback}`;
}

/**
 * Updates the total number of tasks in the board by summing up the to-do, done, in-progress, and awaiting feedback tasks.
 */
function setTaskInBoard() {
  let todo = amounts.todo;
  let done = amounts.done;
  let progress = amounts.inprogress;
  let feedback = amounts.awaitfeedback;
  let Tasks = todo + done + progress + feedback;
  document.getElementById('tasks-in-board-counter').innerHTML = `${Tasks}`;
}
