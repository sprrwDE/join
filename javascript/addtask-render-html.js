function renderAssignedTo(contacts, contact,i) {
    return `
    <div class="contact" id="contact">
                        <div class="flex">
                            <img src="../assets/img/Profile badge.svg" alt="">
                            <p>${contacts[contact].name}</p>
                        </div>
                        <div class="checkbox-wrapper-19">
                            <input type="checkbox" id="cbtest-19-${i}" onclick="assignedToChecked(${i})"/>
                            <label for="cbtest-19-${i}" class="check-box"></label>
                        </div>
                    </div>
    `
}