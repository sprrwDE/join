// Div References
const showDetail = document.getElementById('contact-detail');
const detailRef = document.getElementById('detail');
const addDialogRef = document.getElementById('add-contact');
const contactListRef = document.getElementById('contact-list');
const listContentRef = document.getElementById('list-content-outter');
const addButtonRef = document.getElementById('add-button');
const editButtonRef = document.getElementById('edit-button');
const editBoxRef = document.getElementById('edit-box');
const editContactRef = document.getElementById('edit-contact');
const detailHeaderMob = document.getElementById('mobile-overlay-detail')
let currentSelectedElement = null;

// Data Storage
let db = [];
let inputData;
let organizedContacts = {};
let currentId;
let isCurrentUser

/**
 * Renders Contact List into DOM.
 * Clears the current list, organizes and sorts contacts, and renders them.
 */
function renderContactGroups() {
    listContentRef.innerHTML = '';
    organizedContacts = {};
    groupContactsByInitials();
    sortContactGroups();
    renderContacts(organizedContacts);
}

/**
 * Groups contacts by the initial letter of their names.
 */
function groupContactsByInitials() {
    for (let i = 0; i < db.length; i++) {
        let contact = db[i];
        let initials = getContactInitials(contact.nameIn);
        let letter = initials[1];

        if (!organizedContacts[letter]) {
            organizedContacts[letter] = [];
        }
        organizedContacts[letter].push({
            ...contact,
            initials: initials
        });
    }
}

/**
 * Sorts the contact groups alphabetically by their initials.
 */
function sortContactGroups() {
    const letters = Object.keys(organizedContacts);
    for (let i = 0; i < letters.length; i++) {
        let currentLetter = letters[i];
        organizedContacts[currentLetter].sort(function (a, b) {
            return a.nameIn.localeCompare(b.nameIn);
        });
    }
}

/**
 * Renders the sorted contact groups into the DOM.
 * 
 * @param {Object} organizedContacts - The contacts organized by initials.
 */
function renderContacts(organizedContacts) {
    let sortedInitials = Object.keys(organizedContacts).sort();
    let globalIndex = 0;

    for (let index = 0; index < sortedInitials.length; index++) {
        let initial = sortedInitials[index];
        renderInitialGroup(initial, index, organizedContacts[initial], globalIndex);
        globalIndex += organizedContacts[initial].length;
    }
}

/**
 * Renders an initial group of contacts into the DOM.
 * 
 * @param {string} initial - The initial letter of the group.
 * @param {number} index - The index of the group.
 * @param {Array} contacts - The contacts belonging to the group.
 * @param {number} globalIndex - The global index of the contacts.
 */
function renderInitialGroup(initial, index, contacts, globalIndex) {
    listContentRef.innerHTML += contactTemplateInitial(initial, index);
    let currentContactRef = document.getElementById(`list-content-inner-${index}`);
    renderContactsForInitial(currentContactRef, contacts, globalIndex);
}

/**
 * Renders the individual contacts for a specific initial group.
 * 
 * @param {HTMLElement} containerRef - The container to render the contacts in.
 * @param {Array} contacts - The contacts to render.
 * @param {number} globalIndex - The global index for contacts.
 */
function renderContactsForInitial(containerRef, contacts, globalIndex) {
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        containerRef.innerHTML += getContactsTemplate(
            contact.nameIn,
            contact.emailIn,
            contact.phoneIn,
            contact.id,
            contact.initials[0],
            contact.initials[1],
            contact.color,
            globalIndex + i,
            contact.isUser
        );
    }
}

/**
 * Opens the "Add Contact" dialog.
 */
function openAddContactDialog() {
    addDialogRef.classList.remove('d-none');
    addDialogRef.innerHTML = addDialogTemplate();
    editButtonRef.classList.add('d-none');
    addButtonRef.classList.add('d-none');
}

/**
 * Closes the "Add Contact" dialog.
 */
function closeAddContactDialog() {
    addDialogRef.classList.add('d-none');
    contactListRef.classList.remove('d-none');
    addButtonRef.classList.remove('d-none');
}

/**
 * Gets input values for a new contact.
 * Validates the input and stores it in `inputData`.
 */
function getInputValues(event) {
    event.preventDefault(); // Verhindert das Abschicken des Formulars

    const nameInput = document.getElementById('name').value.trim();
    const emailInput = document.getElementById('email').value.trim();
    const phoneInput = document.getElementById('phone').value.trim();

    if (!validateInput(nameInput, emailInput, phoneInput)) {
        return; // Bei Validierungsfehler Funktion beenden
    }

    const inputData = {
        nameIn: nameInput,
        emailIn: emailInput,
        phoneIn: phoneInput,
        isUser: false,
        color: getRandomColor()
    };

    pushData(inputData);
}

/**
 * Opens the detail dialog for a contact.
 * 
 * @param {string} name - Contact's name.
 * @param {string} email - Contact's email.
 * @param {string} phone - Contact's phone number.
 * @param {number} id - Contact's ID.
 * @param {string} first - Contact's first initial.
 * @param {string} last - Contact's last initial.
 * @param {string} color - Contact's assigned color.
 * @param {number} indexCard - The index of the contact card.
 * @param {boolean} user - Whether the contact is the user.
 */
function openDetailDialog(name, email, phone, id, first, last, color, indexCard, user) {
    if (window.innerWidth >= 1024) {
        openDetailReferenceDesk(name, email, phone, id, first, last, color, user);
    } else {
        openDetailReferenceMob(name, email, phone, id, first, last, color, user);
    }
}

/**
 * Closes the detail dialog.
 */
function closeDetailDialog() {
    showDetail.classList.add('d-none');
    detailRef.classList.add('d-none');
    editButtonRef.classList.add('d-none');
    contactListRef.classList.remove('d-none');
    addButtonRef.classList.remove('d-none');
    listContentRef.classList.remove('d-none');
}

/**
 * Opens the desktop version of the detail view.
 * 
 * @param {string} name - Contact's name.
 * @param {string} email - Contact's email.
 * @param {string} phone - Contact's phone number.
 * @param {number} id - Contact's ID.
 * @param {string} first - Contact's first initial.
 * @param {string} last - Contact's last initial.
 * @param {string} color - Contact's assigned color.
 * @param {boolean} user - Whether the contact is the user.
 */
function openDetailReferenceDesk(name, email, phone, id, first, last, color, user) {
    currentId = id;
    document.getElementById('detail-desk').innerHTML = detailTemplate(name, email, phone, id, first, last, color, user);
    selectElement(id);
}

/**
 * Selects a contact card element in the DOM.
 * 
 * @param {number} contactId - The ID of the contact to select.
 */
function selectElement(contactId) {
    const selectedElement = document.getElementById(`contact-card-${contactId}`);
    if (!selectedElement) {
        return;
    }
    if (currentSelectedElement && currentSelectedElement !== selectedElement) {
        currentSelectedElement.classList.remove('selected');
    }
    selectedElement.classList.add('selected');
    currentSelectedElement = selectedElement;
}

/**
 * Opens the mobile version of the detail view.
 * 
 * @param {string} name - Contact's name.
 * @param {string} email - Contact's email.
 * @param {string} phone - Contact's phone number.
 * @param {number} id - Contact's ID.
 * @param {string} first - Contact's first initial.
 * @param {string} last - Contact's last initial.
 * @param {string} color - Contact's assigned color.
 * @param {boolean} user - Whether the contact is the user.
 */
function openDetailReferenceMob(name, email, phone, id, first, last, color, user) {
    currentId = id;
    mobileDetailDivs();
    getDetailTemplateMob(name, email, phone, id, first, last, color, user);
    selectElement(id);
}

/**
 * Toggles visibility of detail divs for mobile view.
 */
function mobileDetailDivs() {
    showDetail.classList.remove('d-none');
    detailRef.classList.remove('d-none');
    editButtonRef.classList.remove('d-none');
    contactListRef.classList.add('d-none');
    editBoxRef.classList.add('d-none');
    addButtonRef.classList.add('d-none');
}

/**
 * Populates the mobile detail template.
 * 
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * @param {number} id - The contact's ID.
 * @param {string} first - The contact's first initial.
 * @param {string} last - The contact's last initial.
 * @param {string} color - The contact's color.
 * @param {boolean} user - Is the contact a user?
 */
function getDetailTemplateMob(name, email, phone, id, first, last, color, user) {
    detailRef.innerHTML = detailTemplate(name, email, phone, id, first, last, color, user);
}

/**
 * Displays the edit box for a contact.
 * 
 * @param {Event} event - The event that triggers the edit box.
 */
function showEditBox(event) {
    stopPropagation(event);
    editBoxRef.classList.remove('d-none');
    editBoxRef.style.animation = 'slideInFromRight 0.5s ease-in-out';
}

editBoxRef.addEventListener('animationend', function() {
    editBoxRef.style.animation = ''; // Entfernt die Animation nach dem ersten Abspielen
});

/**
 * Hides the edit box.
 */
function hideEditBox() {
    editBoxRef.classList.add('d-none');
}

/**
 * Opens the dialog to edit an existing contact.
 * 
 * @param {number} id - The contact's ID.
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {boolean} user - Is the contact a user?
 */
function openEditContactDialog(id, name, email, user) {
    editContactRef.classList.remove('d-none');
    editContactRef.innerHTML = showEditOverlay(name, email, user);

    currentId = id;
    const contact = db.find(contact => contact.id === currentId);
    isCurrentUser = contact.isUser;

    const nameInput = document.getElementById('edit-name');
    const emailInput = document.getElementById('edit-email');
    const phoneInput = document.getElementById('edit-phone');

    // Delay to ensure DOM is fully loaded
    setTimeout(() => {
        if (contact && nameInput && emailInput && phoneInput) {
            nameInput.value = contact.nameIn;
            emailInput.value = contact.emailIn;
            phoneInput.value = contact.phoneIn;
        }

        // Log the input values to ensure they are set correctly
        console.log("Edit dialog values: ", {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value
        });
    }, 100); // Delay of 100ms to ensure DOM is updated
}

/**
 * Closes the edit contact dialog.
 */
function closeEditContactDialog() {
    editContactRef.classList.add('d-none');
    contactListRef.classList.remove('d-none');
    if (window.innerWidth <= 1024) {
        listContentRef.classList.remove('d-none');
    }
    const nameInput = document.getElementById('edit-name');
    const emailInput = document.getElementById('edit-email');
    const phoneInput = document.getElementById('edit-phone');
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (phoneInput) phoneInput.value = '';
}

/**
 * Gets the updated contact data from the input fields.
 * 
 * @returns {Object|null} The updated contact data or null if validation fails.
 */
function getUpdatedContactData() {
    const nameIn = document.getElementById('edit-name').value.trim();
    const emailIn = document.getElementById('edit-email').value.trim();
    const phoneIn = document.getElementById('edit-phone').value.trim();

    // Debugging: Überprüfe, ob die Werte korrekt ausgelesen werden
    console.log("Name input:", nameIn);
    console.log("Email input:", emailIn);
    console.log("Phone input:", phoneIn);

    if (!validateInput(nameIn, emailIn, phoneIn)) {
        return null;  // Validation failed
    }

    const color = getRandomColor();
    const isUser = isCurrentUser;

    return { nameIn, emailIn, phoneIn, color, isUser };
}


/**
 * Updates the local database with the new contact data.
 * 
 * @param {number} contactId - The contact's ID.
 * @param {Object} updatedData - The updated contact data.
 */
function updateLocalDatabase(contactId, updatedData) {
    const contactIndex = db.findIndex(contact => contact.id === contactId);
    if (contactIndex > -1) {
        db[contactIndex] = { id: contactId, ...updatedData };
    }
}

/**
 * Updates the detail view with the new contact data.
 * 
 * @param {Object} updatedData - The updated contact data.
 */
function updateDetailView(updatedData) {
    const initials = getContactInitials(updatedData.nameIn);
    if (!showDetail.classList.contains('d-none')) {
        getDetailTemplateMob(
            updatedData.nameIn,
            updatedData.emailIn,
            updatedData.phoneIn,
            currentId,
            initials[0],
            initials[1],
            updatedData.color
        );
    }

    openDetailReferenceDesk(
        updatedData.nameIn,
        updatedData.emailIn,
        updatedData.phoneIn,
        currentId,
        initials[0],
        initials[1],
        updatedData.color
    );
}

///
///
// Eventuell in global JS schieben?

/**
 * Validates the input data for a contact.
 * Checks if all fields are filled, the email is in correct format,
 * and the phone number is valid.
 * 
 * @param {string} name - The name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 * @returns {boolean} - Returns `true` if all inputs are valid, otherwise `false`.
 */
function validateInput(name, email, phone) {
    console.log("Validating input:", { name, email, phone });

    if (!isNotEmpty(name, email, phone)) {
        alert('Please fill in all fields.');
        return false;
    }

    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    if (!isValidPhone(phone)) {
        alert('Please enter a valid phone number.');
        return false;
    }

    return true; // All validations passed
}


/**
 * Checks if all provided fields are not empty.
 * 
 * @param {...string} fields - A list of fields to check.
 * @returns {boolean} - Returns `true` if all fields are non-empty, otherwise `false`.
 */
function isNotEmpty(...fields) {
    return fields.every(field => field.trim() !== '');
}

/**
 * Validates an email address.
 * 
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns `true` if the email is valid, otherwise `false`.
 */
function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Validates a phone number.
 * 
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} - Returns `true` if the phone number has at least 10 digits, otherwise `false`.
 */
function isValidPhone(phone) {
    const re = /^[0-9]{10,}$/;
    return re.test(phone);
}
