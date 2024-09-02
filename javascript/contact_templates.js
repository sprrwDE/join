/**
 * Templates
 */
function contactTemplateInitial(initial, index) {
    return `
        <h2 class="initial-letter">${initial}</h2>
        <div class="seperator-list"></div>
        <div class="list-content-wrapper" id="list-content-inner-${index}">
        </div>
    `;
}

function getContactsTemplate(name, email, phone, currentId, first, last, color, indexCard) {
    return `
        <div class="list-card" id="contact-card-${indexCard}" onclick="openDetailDialog('${name}', '${email}', '${phone}', '${currentId}', '${first}', '${last}', '${color}', '${indexCard}')">
        <div class="card-image list-image" style="background-color: ${color}">
            <h4>${first}${last}</h4>
        </div>
        <div>
            <h4 class="list-name">${name}</h4>
            <a href="mailto:${email}" class="list-email">${email}</a>
        </div>
        </div>
    `;
}

function detailTemplate(name, email, phone, first, last, color) {
    return `
    <div class="exit-detail" id="exit-detail" onclick="closeDetailDialog()">
        <img src="../assets/img/exit-detail.svg">
    </div>            

    <div class="contact-info-wrapper">
        <div class="avatar-wrapper">
            <div class="card-image" style="background-color: ${color}">
                <h4>${first}${last}</h4> 
            </div>
            <div class="name-wrapper">
            <h4>${name}</h4>
            <div class="edit-button-desk-wrapper">
                <div>Edit</div>
                <div>Delete</div>
            </div>
            </div>
        </div>
        <div class="contact-content">
            <h4>Contact information</h4>
            <p><b>Email</b></p>
            <a href="mailto:${email}">${email}</a>
            <p><b>Phone</b></p>
            <p>${phone}</p>
        </div>
    </div>`;
}

function addDialogTemplate() {
    return `<div class="contact-card add">
        <div class="exit-wrapper">
            <img class="exit" src="../assets/img/contact-card/close.svg" onclick="closeAddContactDialog()">
        </div>
        <div class="card-header">
            <img src="../assets/img/contact-card/join-logo-card.svg">
            <h2>Add contact</h2>
            <h3>Tasks are better with a team!</h3>
            <div class="seperator-card"></div>
        </div>
        <div class="card-image-outter">
            <div class="card-image"><img src="../assets/img/contact-card/avatar.svg"></div>
        </div>
        <div class="card-body">
            <div class="input-wrapper">
                <div class="input-container">
                    <input type="text" required placeholder="Name" id="name">
                    <img class="icon" src="../assets/img/contact-card/person.svg">
                </div>
                <div class="input-container">
                    <input type="text" required placeholder="Email" id="email">
                    <img class="icon" src="../assets/img/contact-card/mail.svg">
                </div>
                <div class="input-container">
                    <input type="text" required placeholder="Phone" id="phone">
                    <img class="icon" src="../assets/img/contact-card/call.svg">
                </div>
            </div>
            <div class="btn-wrapper">
                <button class="btn cancel" onclick="closeAddContactDialog()">
                    Cancel
                    <img src="../assets/img/contact-card/exit.svg">
                </button>
                <button class='btn create' onclick="getInputValues()">
                    Create contact
                    <img src="../assets/img/contact-card/check.svg">
                </button>
            </div>
        </div>
    </div>`;
}

function showEditOverlay() {
    return`
    <div class="contact-card add">
    <div class="exit-wrapper">
        <img class="exit" src="../assets/img/contact-card/close.svg" onclick="closeEditContactDialog()">
    </div>
    <div class="card-header">
        <img src="../assets/img/contact-card/join-logo-card.svg">
        <h2>Edit contact</h2>
        <h3>Tasks are better with a team!</h3>
        <div class="seperator-card"></div>
    </div>
    <div class="card-image-outter">
        <div class="card-image"><img src="../assets/img/contact-card/avatar.svg"></div>
    </div>
    <div class="card-body">
        <div class="input-wrapper">
            <div class="input-container">
                <input type="text" required placeholder="Name" id="edit-name">
                <img class="icon" src="../assets/img/contact-card/person.svg">
            </div>
            <div class="input-container">
                <input type="text" required placeholder="Email" id="edit-email">
                <img class="icon" src="../assets/img/contact-card/mail.svg">
            </div>
            <div class="input-container">
                <input type="text" required placeholder="Phone" id="edit-phone">
                <img class="icon" src="../assets/img/contact-card/call.svg">
            </div>
        </div>
        <div class="btn-wrapper">
            <button class="btn cancel" onclick="closeEditContactDialog()">
                Cancel
                <img src="../assets/img/contact-card/exit.svg">
            </button>
            <button class='btn create' onclick="updateContact()">
                Save changes
                <img src="../assets/img/contact-card/check.svg">
            </button>
        </div>
    </div>
</div>`
}