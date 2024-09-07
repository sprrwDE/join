let tasks = window.parent.tasks;
let clickedCardId = window.parent.clickedCardId;
let BASE_URL = "https://join-318-default-rtdb.europe-west1.firebasedatabase.app/";

function initBoardCard() {}

function boardCardSubtaskChecked(id) {
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

function updateServer(task) {
  fetch(BASE_URL + "/addTask/" + clickedCardId + "/subtask/" + ".json", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
}
