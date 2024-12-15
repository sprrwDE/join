let tasks = window.parent.tasks;
let clickedCardId = window.parent.clickedCardId;
let BASE_URL = "https://join-portfolio-2dadd-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Initializes the board card.
 */
function initBoardCard() { }

/**
 * Handles the checkbox state change of a subtask in a board card.
 * Updates the subtask status and synchronizes with the server.
 *
 * @param {number} id - The ID of the subtask.
 */
function boardCardSubtaskChecked(id) {
  parent.fillProgressBar();
  let checkboxdiv = document.getElementById(`board-card-${clickedCardId}-${id}`);
  let checkbox = checkboxdiv.querySelector(`#cbtest-19-${id}`);

  if (checkbox.checked) {
    tasks.forEach((task) => {
      if (task.id == clickedCardId) {
        let status = Object.values(task.subtask);
        status[id] = "done";

        // Aktualisiere das Subtask-Objekt im Task
        Object.keys(task.subtask).forEach((key, index) => {
          task.subtask[key] = status[index];
        });
        updateServer(task.subtask);
        window.parent.tasks = tasks;
      }
    });
  } else {
    tasks.forEach((task) => {
      if (task.id == clickedCardId) {
        let status = Object.values(task.subtask);
        status[id] = "inwork";

        // Aktualisiere das Subtask-Objekt im Task
        Object.keys(task.subtask).forEach((key, index) => {
          task.subtask[key] = status[index];
        });
        updateServer(task.subtask);
        window.parent.tasks = tasks;
      }
    });
  }
}

/**
 * Updates the server with the provided subtask status.
 *
 * @param {Object} task - The subtask object to update on the server.
 */
function updateServer(task) {
  fetch(BASE_URL + "/addTask/" + clickedCardId + "/subtask/" + ".json", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
}

/**
 * Deletes a task from the local tasks array and updates the parent window.
 *
 * @param {number} id - The ID of the task to delete.
 */
function deleteTask(id) {
  let index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
  }
  deleteFromServer(id)
  window.parent.tasks = tasks;
}

/**
 * Deletes a task from the server.
 *
 * @param {number} id - The ID of the task to delete from the server.
 */
function deleteFromServer(id) {
  fetch(BASE_URL + "/addTask/" + id + ".json", {
    method: "DELETE"
  });
}
