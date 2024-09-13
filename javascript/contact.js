const showDetail = document.getElementById('contact-detail');
const detailRef = document.getElementById('detail');
const addContactRef = document.getElementById('add-contact');
const contactListRef = document.getElementById('contact-list');
const listContentRef = document.getElementById('list-content-outter');
const addButtonRef = document.getElementById('add-button');
const editButtonRef = document.getElementById('edit-button');
const editBoxRef = document.getElementById('edit-box');
const editContactRef = document.getElementById('edit-contact');
const detailHeaderMob = document.getElementById('mobile-overlay-detail');
let currentSelectedElement = null;

let db = [];
let inputData;
let organizedContacts = {};
let currentId;
let isCurrentUser;

function renderContactGroups() {
    listContentRef.innerHTML = '';
    organizedContacts = {};
    groupContactsByInitials();
    sortContactGroups();
    renderContacts(organizedContacts);
}

function groupContactsByInitials() {
    db.forEach(contact => {
        let initials = getContactInitials(contact.nameIn);
        let letter = initials[1];

        if (!organizedContacts[letter]) {
            organizedContacts[letter] = [];
        }
        organizedContacts[letter].push({
            ...contact,
            initials: initials
        });
    });
}

function sortContactGroups() {
    Object.keys(organizedContacts).forEach(letter => {
        organizedContacts[letter].sort((a, b) => a.nameIn.localeCompare(b.nameIn));
    });
}

function renderContacts(organizedContacts) {
    let sortedInitials = Object.keys(organizedContacts).sort();
    let globalIndex = 0;

    sortedInitials.forEach((initial, index) => {
        renderInitialGroup(initial, index, organizedContacts[initial], globalIndex);
        globalIndex += organizedContacts[initial].length;
    });
}

function renderInitialGroup(initial, index, contacts, globalIndex) {
    listContentRef.innerHTML += contactTemplateInitial(initial, index);
    let currentContactRef = document.getElementById(`list-content-inner-${index}`);
    renderContactsForInitial(currentContactRef, contacts, globalIndex);
}

function renderContactsForInitial(containerRef, contacts, globalIndex) {
    contacts.forEach((contact, i) => {
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
    });
}

function openAddContactDialog() {
    addContactRef.innerHTML = addDialogTemplate();
    addContactRef.classList.remove('d-none');
    setupDialogAnimation(addContactRef);
    addInputEventListeners(['name', 'email', 'phone']);
}

function closeAddContactDialog() {
    closeDialog(addContactRef);
}

function getInputValues(event) {
    event.preventDefault();

    const nameInput = document.getElementById('name').value.trim();
    const emailInput = document.getElementById('email').value.trim();
    const phoneInput = document.getElementById('phone').value.trim();

    if (!validateInput(nameInput, emailInput, phoneInput)) return;

    const inputData = {
        nameIn: nameInput,
        emailIn: emailInput,
        phoneIn: phoneInput,
        isUser: false,
        color: getRandomColor()
    };

    pushData(inputData);
    closeAddContactDialog();
}

function openDetailDialog(name, email, phone, id, first, last, color, indexCard, user) {
    if (window.innerWidth >= 1024) {
        openDetailReferenceDesk(name, email, phone, id, first, last, color, user);
    } else {
        openDetailReferenceMob(name, email, phone, id, first, last, color, user);
    }
}

function closeDetailDialog() {
    showDetail.classList.add('d-none');
    detailRef.classList.add('d-none');
    editButtonRef.classList.add('d-none');
    contactListRef.classList.remove('d-none');
    addButtonRef.classList.remove('d-none');
    listContentRef.classList.remove('d-none');
}

function openDetailReferenceDesk(name, email, phone, id, first, last, color, user) {
    currentId = id;
    const detailContentRef = document.getElementById('detail-desk');
    detailContentRef.innerHTML = detailTemplate(name, email, phone, id, first, last, color, user);
    setupDetailAnimation(detailContentRef);
    selectElement(id);
}

function selectElement(contactId) {
    const selectedElement = document.getElementById(`contact-card-${contactId}`);
    if (!selectedElement) return;
    if (currentSelectedElement && currentSelectedElement !== selectedElement) {
        currentSelectedElement.classList.remove('selected');
    }
    selectedElement.classList.add('selected');
    currentSelectedElement = selectedElement;
}

function openDetailReferenceMob(name, email, phone, id, first, last, color, user) {
    currentId = id;
    mobileDetailDivs();
    getDetailTemplateMob(name, email, phone, id, first, last, color, user);
}

function mobileDetailDivs() {
    showDetail.classList.remove('d-none');
    detailRef.classList.remove('d-none');
    editButtonRef.classList.remove('d-none');
    contactListRef.classList.add('d-none');
    editBoxRef.classList.add('d-none');
    addButtonRef.classList.add('d-none');
}

function getDetailTemplateMob(name, email, phone, id, first, last, color, user) {
    const initialsArray = getContactInitials(name);
    first = initialsArray[0];
    last = initialsArray[1];
    detailRef.innerHTML = detailTemplate(name, email, phone, id, first, last, color, user);
}

function showEditBox(event) {
    stopPropagation(event);
    editBoxRef.classList.remove('d-none');
    editBoxRef.style.animation = 'slideInFromRight 0.5s ease-in-out';
}

editBoxRef.addEventListener('animationend', function () {
    editBoxRef.style.animation = '';
});

function hideEditBox() {
    editBoxRef.classList.add('d-none');
}

function openEditContactDialog(id, name, email, user) {
    const contact = db.find(contact => contact.id === id);
    showEditContactDialog(contact);
    initializeEditDialog(contact);
    addInputEventListeners(['edit-name', 'edit-email', 'edit-phone']);
}

function showEditContactDialog(contact) {
    editContactRef.classList.remove('d-none');
    isCurrentUser = contact.isUser;
    const color = contact.color;
    editContactRef.innerHTML = showEditOverlay(contact.nameIn, contact.emailIn, contact.isUser, color);
    currentId = contact.id;
}

function initializeEditDialog(contact) {
    setTimeout(() => {
        setupDialogAnimation(editContactRef);
        populateEditDialogFields(contact);
    }, 0);
}

function setupDialogAnimation(dialogRef, animationClass = 'animate-from-bottom') {
    const dialogCard = dialogRef.querySelector('.contact-card.add');
    dialogCard.classList.add(animationClass);
    dialogCard.addEventListener('animationend', function () {
        dialogCard.classList.remove(animationClass);
    });
    dialogCard.addEventListener('click', function (event) {
        event.stopPropagation();
    });
    dialogRef.addEventListener('click', function () {
        closeDialog(dialogRef);
    });
}

function setupDetailAnimation(detailRef) {
    detailRef.classList.remove('animate-detail');
    setTimeout(() => {
        detailRef.classList.add('animate-detail');
        detailRef.addEventListener('animationend', function () {
            detailRef.classList.remove('animate-detail');
        });
    }, 10);
}

function populateEditDialogFields(contact) {
    document.getElementById('edit-name').value = contact.nameIn;
    document.getElementById('edit-email').value = contact.emailIn;
    document.getElementById('edit-phone').value = contact.phoneIn;
}

function addInputEventListeners(fields, prefix = '') {
    fields.forEach(field => {
        const input = document.getElementById(`${prefix}${field}`);
        input.addEventListener('input', () => {
            const errorElement = document.getElementById(`${prefix}${field}-error`);
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        });
    });
}

function closeEditContactDialog() {
    closeDialog(editContactRef);
}

function getUpdatedContactData() {
    const nameIn = document.getElementById('edit-name').value.trim();
    const emailIn = document.getElementById('edit-email').value.trim();
    const phoneIn = document.getElementById('edit-phone').value.trim();

    if (!validateInput(nameIn, emailIn, phoneIn, 'edit-')) return null;

    const color = getRandomColor();
    const isUser = isCurrentUser;

    return { nameIn, emailIn, phoneIn, color, isUser };
}

function updateLocalDatabase(contactId, updatedData) {
    const contactIndex = db.findIndex(contact => contact.id === contactId);
    if (contactIndex > -1) {
        db[contactIndex] = { id: contactId, ...updatedData };
    }
}

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

function validateInput(name, email, phone, prefix = '') {
    resetErrorMessages(prefix);
    let isValid = true;
    const fields = [
        { name: 'name', value: name, validate: isValidName, emptyMsg: 'Bitte geben Sie einen Namen ein.', invalidMsg: 'Bitte geben Sie einen gültigen Namen ohne Zahlen ein.' },
        { name: 'email', value: email, validate: isValidEmail, emptyMsg: 'Bitte geben Sie eine E-Mail-Adresse ein.', invalidMsg: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' },
        { name: 'phone', value: phone, validate: isValidPhone, emptyMsg: 'Bitte geben Sie eine Telefonnummer ein.', invalidMsg: 'Bitte geben Sie eine gültige Telefonnummer ein.' }
    ];
    fields.forEach(field => {
        const errorId = `${prefix}${field.name}-error`;
        if (field.value.trim() === '') {
            displayErrorMessage(errorId, field.emptyMsg);
            isValid = false;
        } else if (!field.validate(field.value)) {
            displayErrorMessage(errorId, field.invalidMsg);
            isValid = false;
        }
    });
    return isValid;
}

function isValidName(name) {
    const re = /^[a-zA-ZÀ-ÿ\-\'\s]+$/;
    return re.test(name);
}

function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

function isValidPhone(phone) {
    const re = /^[\d\s+\-()]+$/;
    return re.test(phone);
}

function displayErrorMessage(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function resetErrorMessages(prefix = '') {
    const errorElements = document.querySelectorAll(`.error-message[id^="${prefix}"]`);
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}

function closeDialog(dialogRef) {
    dialogRef.classList.add('d-none');
    dialogRef.innerHTML = '';
}
