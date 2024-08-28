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

// Input References
let nameInput, emailInput, phoneInput;

// Firebase References
let baseUrl = 'https://join-318-default-rtdb.europe-west1.firebasedatabase.app/';
let currentIndex;

// Data Storage
let db = [];
let inputData;
let organizedContacts = {};

/**
 * Fetches Firebase RealtimeDB
 */
async function init() {
    try {
        db = [];
        await fetchApi("contacts");
    } finally {
        listContentRef.innerHTML = '';
        renderContactGroups();
        includeHTML();
    }
}

async function fetchApi(path) {
    try {
        let response = await fetch(baseUrl + path + '.json');
        let data = await response.json();

        if (data) {
            let contactsArray = Object.entries(data).map(([key, value]) => {
                return {
                    id: key, 
                    ...value
                };
            });
            db.push(...contactsArray);
        }
    } catch (error) {
        console.log('Fehler beim Abrufen der Daten:', error);
    }
}

/**
 * Renders Contact List into DOM
 */
function renderContactGroups() {
    listContentRef.innerHTML = '';
    organizedContacts = {}; 

    // get initials
    db.forEach(contact => {
        let initials = getInitials(contact.nameIn);
        let letter = initials[1];

        if (!organizedContacts[letter]) {
            organizedContacts[letter] = [];
        }
        organizedContacts[letter].push({
            ...contact,
            initials: initials
        });
    });

    // sort
    for (let letter in organizedContacts) {
        organizedContacts[letter].sort((a, b) => {
            return a.nameIn.localeCompare(b.nameIn);
        });
    }

    renderContacts(organizedContacts);
}

function renderContacts(organizedContacts) {
    let sortedInitials = Object.keys(organizedContacts).sort();

    for (let index = 0; index < sortedInitials.length; index++) {
        let initial = sortedInitials[index];
        listContentRef.innerHTML += contactTemplateInitial(initial, index);
        let currentContactRef = document.getElementById(`list-content-inner-${index}`);
        
        let contacts = organizedContacts[initial];
        for (let i = 0; i < contacts.length; i++) {
            let contact = contacts[i];
            let currentName = contact.nameIn;
            let currentEmail = contact.emailIn;
            let currentPhone = contact.phoneIn;
            let initials = contact.initials;
            let currentI = contact.id; 
            let color = contact.color;
            currentContactRef.innerHTML += getContactsTemplate(currentName, currentEmail, currentPhone, currentI, initials[0], initials[initials.length - 1], color);
        }
    }
}

/**
 * Add Contact Dialog
 */
function openAddContactDialog() {
    addDialogRef.classList.remove('d-none');
    addDialogRef.innerHTML = addDialogTemplate();
    editButtonRef.classList.add('d-none');
    addButtonRef.classList.add('d-none');
}

function closeAddContactDialog() {
    addDialogRef.classList.add('d-none');
    contactListRef.classList.remove('d-none');
    addButtonRef.classList.remove('d-none');
}

/**
 * Push Data from input-fields into Firebase Database
 */
function getInputValues() {
    nameInput = document.getElementById('name').value.trim();
    emailInput = document.getElementById('email').value.trim();
    phoneInput = document.getElementById('phone').value.trim();
    
    if (!nameInput || !emailInput || !phoneInput) {
        alert('Bitte füllen Sie alle Felder aus.');
        return;
    }

    inputData = {
        nameIn: nameInput,
        emailIn: emailInput,
        phoneIn: phoneInput,
        color: getRandomColor()
    };

    pushData(inputData);
}

async function pushData(inputData) {
    try {
        let response = await fetch(baseUrl + 'contacts.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputData)
        });

        if (!response.ok) {
            throw new Error('Fehler beim Pushen der Daten');
        }

        closeAddContactDialog(); 
        init(); 
    } catch (error) {
        console.log('Fehler beim Pushen der Daten', error);
    }
}

function getInitials(name) {
    let namesArray = name.trim().split(' ');
    let lastName = namesArray[namesArray.length - 1];
    let firstName = namesArray[0];
    let initialFirst = firstName.charAt(0).toUpperCase();
    let initialLast = lastName.charAt(0).toUpperCase();
    return [initialFirst, initialLast];
}

/**
 * Detail Dialog
 */
function openDetailDialog(name, email, phone, index, first, last, color) {
    openDetailReferences();
    currentIndex = index; 
    getDetailTemplate(name, email, phone, first, last, color); 
}

function openDetailReferences() {
    showDetail.classList.remove('d-none');
    detailRef.classList.remove('d-none');
    editButtonRef.classList.remove('d-none');
    contactListRef.classList.add('d-none');
    editBoxRef.classList.add('d-none');
    addButtonRef.classList.add('d-none');
}

function getDetailTemplate(name, email, phone, first, last, color) {
    detailRef.innerHTML = detailTemplate(name, email, phone, first, last, color);
}

function closeDetailDialog() {
    showDetail.classList.add('d-none');
    detailRef.classList.add('d-none');
    editButtonRef.classList.add('d-none');
    contactListRef.classList.remove('d-none');
    addButtonRef.classList.remove('d-none');
    listContentRef.classList.remove('d-none');
}

function getRandomColor() {
    let randomNumber = Math.floor(Math.random() * 16777215);
    let randomColor = "#" + randomNumber.toString(16).padStart(6, "0");
    return randomColor;
}

/**
 * Edit / Delete
 */
function stopPropagation(event) {
    event.stopPropagation();
}

function showEditBox(event) {
    stopPropagation(event); 
    editBoxRef.classList.remove('d-none');
}

function hideEditBox() {
    editBoxRef.classList.add('d-none');
}

function closeEditContactDialog() {
    editContactRef.classList.add('d-none');
    contactListRef.classList.remove('d-none');
    listContentRef.classList.add('d-none');
}

function openEditContactDialog() {
    const contact = db.find(c => c.id === currentIndex);
    document.getElementById('edit-name').value = contact.nameIn;
    document.getElementById('edit-email').value = contact.emailIn;
    document.getElementById('edit-phone').value = contact.phoneIn;

    editContactRef.classList.remove('d-none');
    contactListRef.classList.add('d-none');
}

async function updateContact() {
    const updatedData = {
        nameIn: document.getElementById('edit-name').value.trim(),
        emailIn: document.getElementById('edit-email').value.trim(),
        phoneIn: document.getElementById('edit-phone').value.trim(),
        color: getRandomColor()
    };

    if (!updatedData.nameIn || !updatedData.emailIn || !updatedData.phoneIn) {
        alert('Bitte füllen Sie alle Felder aus.');
        return;
    }

    try {
        let response = await fetch(baseUrl + `contacts/${currentIndex}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error('Fehler beim Bearbeiten des Kontakts');
        }

        const contactIndex = db.findIndex(contact => contact.id === currentIndex);
        if (contactIndex > -1) {
            db[contactIndex] = { id: currentIndex, ...updatedData };
        }

        const initials = getInitials(updatedData.nameIn);

        if (!showDetail.classList.contains('d-none')) {
            getDetailTemplate(
                updatedData.nameIn,
                updatedData.emailIn,
                updatedData.phoneIn,
                initials[0],  
                initials[1],  
                updatedData.color
            );
        }

        closeEditContactDialog(); 
        init(); 
    } catch (error) {
        console.log('Fehler beim Bearbeiten des Kontakts', error);
    }
}

async function deleteContact(contactId) {
    try {
        let response = await fetch(baseUrl + `contacts/${contactId}.json`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Fehler beim Löschen des Kontakts');
        }
        closeDetailDialog();
        init(); 
    } catch (error) {
        console.log('Fehler beim Löschen des Kontakts', error);
    }
}