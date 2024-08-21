function renderAssignedTo(contact, i, firstinits, secondinits) {
  return `
    <div class="contact" id="contact">
                        <div class="flex">
                            <div class="contact-initals" id="contact-initals${i}"style="background-color: ${getRandomColor()};">
                        <span id="inits${i}">${firstinits}${secondinits}</span>
                    </div>
                            <p>${contact[i]}</p>
                        </div>
                        <div class="checkbox-wrapper-19">
                            <input type="checkbox" id="cbtest-19-${i}" onclick="assignedToChecked(${i})"/>
                            <label for="cbtest-19-${i}" class="check-box"></label>
                        </div>
                    </div>
    `;
}

function renderContactsImages(inits, i) {
  return `
  <div class="contact-initals d-none" id="contact-initals1${i}" style="background-color: ${getRandomColor()};">
    <span>${inits}</span>
  </div>`;
}

function renderAddToSubtaskList(id, input) {
  return `<div class="task" id="id-${id}">
                            <li id="subtask${id}">${input.value}</li>
                            <div class="edit-delete"  id="edit-delete${id}">
                                <img src="../assets/img/edit.svg" alt="" onclick="editSubtask(${id})">
                                <img src="../assets/img/Vector 3.svg" alt="">
                                <img src="../assets/img/delete.svg" alt="" onclick="deleteSubtask(${id})">
                            </div>
                        </div>`;
}

function renderEditOptions(id) {
  return `<img src="../assets/img/delete.svg" alt="" onclick="deleteSubtask(${id})">
    <img src="../assets/img/Vector 3.svg" alt="">
    <img src="../assets/img/check.svg" alt="" style="filter: invert();" onclick="edited(${id})">`;
}

function renderEditDoneImages(id) {
  return `<img src="../assets/img/edit.svg" alt="" onclick="editSubtask(${id})">
                                <img src="../assets/img/Vector 3.svg" alt="">
                                <img src="../assets/img/delete.svg" alt="" onclick="deleteSubtask(${id})">`;
}

function renderInputfieldEdit() {
  return `<input type="text" name="" id="newtask${id}" class="border"></input>`;
}
