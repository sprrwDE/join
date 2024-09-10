/**
 * Generates HTML for a contact group's initial letter and its container.
 * 
 * @param {string} initial - The initial letter of the contact group.
 * @param {number} index - The index of the contact group.
 * @returns {string} The HTML for the initial letter and container.
 */
function contactTemplateInitial(initial, index) {
    return `
        <h2 class="initial-letter">${initial}</h2>
        <div class="seperator-list"></div>
        <div class="list-content-wrapper" id="list-content-inner-${index}">
        </div>
    `;
}

/**
 * Generates HTML for an individual contact card.
 * 
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * @param {number} contactId - The contact's ID.
 * @param {string} first - The first initial of the contact.
 * @param {string} last - The last initial of the contact.
 * @param {string} color - The background color of the contact's avatar.
 * @param {number} indexCard - The index of the contact card.
 * @param {boolean} user - Whether the contact is the current user.
 * @returns {string} The HTML for the contact card.
 */
function getContactsTemplate(name, email, phone, contactId, first, last, color, indexCard, user) {
    return `
        <div class="list-card" id="contact-card-${contactId}" onclick="openDetailDialog('${name}', '${email}', '${phone}', '${contactId}', '${first}', '${last}', '${color}', '${indexCard}', ${user})">
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

/**
 * Generates HTML for the contact detail view.
 * 
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * @param {number} id - The contact's ID.
 * @param {string} first - The first initial of the contact.
 * @param {string} last - The last initial of the contact.
 * @param {string} color - The background color of the contact's avatar.
 * @param {boolean} user - Whether the contact is the current user.
 * @returns {string} The HTML for the contact detail view.
 */
function detailTemplate(name, email, phone, id, first, last, color, user) {
    return `<div class="contact-mobile-header-detail" id="mobile-overlay-detail">
                <h2>Contacts</h2>
                <div class="seperator-card-desk"></div>
                <h3>Better with a team!</h3>
            </div>
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
                        <div class="edit-row-desk" onclick="openEditContactDialog('${id}', '${name}', '${email}', ${user})">
                            <img src="../assets/img/edit-small.svg">
                            <p>Edit</p>
                        </div>
                        <div class="edit-row-desk" onclick="deleteContact('${id}')">
                            <img src="../assets/img/delete-small.svg">
                            <p>Delete</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="contact-content">
                <h5>Contact information</h5>
                <p><b>Email</b></p>
                <a href="mailto:${email}">${email}</a>
                <p><b>Phone</b></p>
                <p>${phone}</p>
            </div>
        </div>`;
}

/**
 * Generates HTML for the "Add Contact" dialog.
 * 
 * @returns {string} The HTML for the add contact dialog.
 */
function addDialogTemplate() {
    return `
    <div class="contact-card add">
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
        <form class="card-body form" id="contactForm">
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
                <button class="btn cancel" onclick="closeAddContactDialog(event)">
                    Cancel
                    <img src="../assets/img/contact-card/exit.svg">
                </button>
                <button class="btn create" onclick="getInputValues(event)">
                    Create contact
                    <img src="../assets/img/contact-card/check.svg">
                </button>
            </div>
        </form>
    </div>`;
}

/**
 * Generates HTML for the "Edit Contact" dialog.
 * 
 * @returns {string} The HTML for the edit contact dialog.
 */
function showEditOverlay() {
    return `
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
    <form class="card-body form">
        <div class="input-wrapper">
            <div class="input-container">
                <input type="text" required placeholder="Name" id="edit-name" value="">
                <img class="icon" src="../assets/img/contact-card/person.svg">
            </div>
            <div class="input-container">
                <input type="text" required placeholder="Email" id="edit-email" value="">
                <img class="icon" src="../assets/img/contact-card/mail.svg">
            </div>
            <div class="input-container">
                <input type="text" required placeholder="Phone" id="edit-phone" value="">
                <img class="icon" src="../assets/img/contact-card/call.svg">
            </div>
        </div>
        <div class="btn-wrapper">
            <button class="btn cancel" onclick="closeEditContactDialog()">
                Cancel
                <img src="../assets/img/contact-card/exit.svg">
            </button>
            <button class='btn create' onclick="updateContact(event); if(isCurrentUser) { updateAccount(); }">
                Save changes
                <img src="../assets/img/contact-card/check.svg">
            </button>
    </form>
</div>`
}