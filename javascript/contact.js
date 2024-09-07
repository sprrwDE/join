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
let currentSelectedElement = null;

// Firebase References
let baseUrl = 'https://join-318-default-rtdb.europe-west1.firebasedatabase.app/';
let currentId;

// Data Storage
let db = [];
let inputData;
let organizedContacts = {};

/**
 * Fetches Firebase RealtimeDB
 */
function closeEditContactDialog() {
    // Verberge den Edit-Dialog
    editContactRef.classList.add('d-none');

    // Zeige die Kontaktliste wieder an
    contactListRef.classList.remove('d-none');

    // Wenn wir im mobilen Modus sind, blende die Listeninhalte wieder ein
    if (window.innerWidth <= 1024) {
        listContentRef.classList.remove('d-none');
    }

    // Rücksetzen der Formularfelder im Edit-Dialog (optional)
    const nameInput = document.getElementById('edit-name');
    const emailInput = document.getElementById('edit-email');
    const phoneInput = document.getElementById('edit-phone');
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (phoneInput) phoneInput.value = '';
}


async function getData(path) {
    try {
        let response = await fetch(baseUrl + path + '.json');
        let data = await response.json();

        if (data) {
            let contactsArray = Object.entries(data).map(([key, value]) => {
                return {
                    id: key,  // Hier wird die Firebase ID dem Kontakt zugewiesen
                    ...value
                };
            });
            db.push(...contactsArray);
        }
    } catch (error) {
        console.log('Fehler beim Abrufen der Daten:', error);
    }
}

async function initialize() {
    try {
        db = [];  // Setze die lokale Datenbank zurück
        await getData("contacts");  // Hole neue Daten aus Firebase
    } finally {
        // Leere die Kontaktliste und rendere neu
        listContentRef.innerHTML = '';
        renderContactGroups();
    }
}


/**
 * Renders Contact List into DOM
 */
function renderContactGroups() {
    listContentRef.innerHTML = '';
    organizedContacts = {};
    groupContactsByInitials();
    sortContactGroups();
    renderContacts(organizedContacts);
}

function groupContactsByInitials() {
    for (let i = 0; i < db.length; i++) {
        let contact = db[i];
        let initials = getInitials(contact.nameIn);
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

function sortContactGroups() {
    const letters = Object.keys(organizedContacts);
    for (let i = 0; i < letters.length; i++) {
        let currentLetter = letters[i];
        organizedContacts[currentLetter].sort(function (a, b) {
            return a.nameIn.localeCompare(b.nameIn);
        });
    }
}

function renderContacts(organizedContacts) {
    let sortedInitials = Object.keys(organizedContacts).sort();
    let globalIndex = 0;

    for (let index = 0; index < sortedInitials.length; index++) {
        let initial = sortedInitials[index];
        renderInitialGroup(initial, index, organizedContacts[initial], globalIndex);
        globalIndex += organizedContacts[initial].length;
    }
}

function renderInitialGroup(initial, index, contacts, globalIndex) {
    listContentRef.innerHTML += contactTemplateInitial(initial, index);
    let currentContactRef = document.getElementById(`list-content-inner-${index}`);
    renderContactsForInitial(currentContactRef, contacts, globalIndex);
}

function renderContactsForInitial(containerRef, contacts, globalIndex) {
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let currentName = contact.nameIn;
        let currentEmail = contact.emailIn;
        let currentPhone = contact.phoneIn;
        let initials = contact.initials;
        let contactId = contact.id; // Hier wird die ID des Kontakts festgelegt
        let color = contact.color;
        let indexCard = globalIndex + i;

        containerRef.innerHTML += getContactsTemplate(currentName, currentEmail, currentPhone, contactId, initials[0], initials[initials.length - 1], color, indexCard);
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
    const nameInput = document.getElementById('name').value.trim();
    const emailInput = document.getElementById('email').value.trim();
    const phoneInput = document.getElementById('phone').value.trim();

    if (!nameInput || !emailInput || !phoneInput) {
        alert('Bitte füllen Sie alle Felder aus.');
        return;
    }

    inputData = {
        nameIn: nameInput,
        emailIn: emailInput,
        phoneIn: phoneInput,
        isUser: false,
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
        initialize();
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
function openDetailDialog(name, email, phone, id, first, last, color, indexCard) {

    if (window.innerWidth >= 1024) {
        openDetailReferenceDesk(name, email, phone, id, first, last, color);
    } else {
        openDetailReferenceMob(name, email, phone, id, first, last, color);
    }
}

function selectElement(contactId) {
    // Finde das ausgewählte Element anhand der ID des Kontakts
    const selectedElement = document.getElementById(`contact-card-${contactId}`);
    
    // Falls das Element nicht gefunden wird, beende die Funktion (sicherstellen, dass das Element existiert)
    if (!selectedElement) {
        console.error(`Element mit ID contact-card-${contactId} konnte nicht gefunden werden.`);
        return;
    }

    // Entferne die 'selected'-Klasse vom vorherigen Element, falls vorhanden
    if (currentSelectedElement) {
        currentSelectedElement.classList.remove('selected');
    }

    // Füge die 'selected'-Klasse zum neuen ausgewählten Element hinzu
    selectedElement.classList.add('selected');

    // Aktualisiere das aktuell ausgewählte Element
    currentSelectedElement = selectedElement;
}

function openDetailReferenceMob(name, email, phone, id, first, last, color) {
    currentId = id;  // Setze die aktuelle ID
    showDetail.classList.remove('d-none');
    detailRef.classList.remove('d-none');
    editButtonRef.classList.remove('d-none');
    contactListRef.classList.add('d-none');
    editBoxRef.classList.add('d-none');
    addButtonRef.classList.add('d-none');
    getDetailTemplateMob(name, email, phone, id, first, last, color);

    // Selektiere das entsprechende Element in der Liste
    selectElement(id);
}



function openDetailReferenceDesk(name, email, phone, id, first, last, color) {
    // Setze die aktuelle ID des Kontakts
    currentId = id;

    // Aktualisiere den Inhalt des Detailbereichs
    document.getElementById('detail-desk').innerHTML = detailTemplate(name, email, phone, id, first, last, color);

    // Markiere das entsprechende Element in der Liste als ausgewählt
    selectElement(id);
}



function getDetailTemplateMob(name, email, phone, id, first, last, color) {
    detailRef.innerHTML = detailTemplate(name, email, phone, id, first, last, color);
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
    // Verberge den Edit-Dialog
    editContactRef.classList.add('d-none');

    // Zeige die Kontaktliste wieder an
    contactListRef.classList.remove('d-none');

    // Wenn wir im mobilen Modus sind, blende die Listeninhalte aus
    if (window.innerWidth <= 1024) {
        listContentRef.classList.remove('d-none');
    }
}


function openEditContactDialog(id) {
    editContactRef.classList.remove('d-none');
    editContactRef.innerHTML = showEditOverlay();
    currentId = id;
    const contact = db.find(contact => contact.id === currentId);
    const nameInput = document.getElementById('edit-name');
    const emailInput = document.getElementById('edit-email');
    const phoneInput = document.getElementById('edit-phone');

    if (contact && nameInput && emailInput && phoneInput) {
        nameInput.value = contact.nameIn;
        emailInput.value = contact.emailIn;
        phoneInput.value = contact.phoneIn;
    }

    if (window.innerWidth <= 1024) {
        listContentRef.classList.add('d-none');
    }
}

function getUpdatedContactData() {
    const nameIn = document.getElementById('edit-name').value.trim();
    const emailIn = document.getElementById('edit-email').value.trim();
    const phoneIn = document.getElementById('edit-phone').value.trim();
    const color = getRandomColor();

    if (!nameIn || !emailIn || !phoneIn) {
        alert('Bitte füllen Sie alle Felder aus.');
        return null;
    }

    return { nameIn, emailIn, phoneIn, color };
}

async function sendUpdateRequest(contactId, updatedData) {
    try {
        let response = await fetch(baseUrl + `contacts/${contactId}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error('Fehler beim Bearbeiten des Kontakts');
        }

        return true;
    } catch (error) {
        console.log('Fehler beim Bearbeiten des Kontakts', error);
        return false;
    }
}

function updateLocalDatabase(contactId, updatedData) {
    const contactIndex = db.findIndex(contact => contact.id === contactId);
    if (contactIndex > -1) {
        db[contactIndex] = { id: contactId, ...updatedData };
    }
}

async function updateContact() {
    const updatedData = getUpdatedContactData();

    if (!updatedData) return;

    // Versuche, das Update zu senden
    const success = await sendUpdateRequest(currentId, updatedData);

    if (success) {
        // Aktualisiere die lokale Datenbank
        updateLocalDatabase(currentId, updatedData);

        // Aktualisiere die Detailansicht (mobiler und Desktop-Modus)
        updateDetailView(updatedData);

        // Schließe den Bearbeitungsdialog
        closeEditContactDialog();

        // Aktualisiere die Kontaktliste
        initialize();
    } else {
        alert("Fehler beim Aktualisieren des Kontakts.");
    }
}




function updateDetailView(updatedData) {
    const initials = getInitials(updatedData.nameIn);

    // Aktualisiere die mobile Detailansicht, falls sie sichtbar ist
    if (!showDetail.classList.contains('d-none')) {
        getDetailTemplateMob(
            updatedData.nameIn,
            updatedData.emailIn,
            updatedData.phoneIn,
            currentId,  // Verwende die aktualisierte ID
            initials[0],     // Initial des Vornamens
            initials[1],     // Initial des Nachnamens
            updatedData.color
        );
    }

    // Aktualisiere die Desktop-Detailansicht
    openDetailReferenceDesk(
        updatedData.nameIn,
        updatedData.emailIn,
        updatedData.phoneIn,
        currentId,  // Verwende die aktualisierte ID
        initials[0],     // Initial des Vornamens
        initials[1],     // Initial des Nachnamens
        updatedData.color
    );
}

/**
 * Delete
 */

async function deleteContact(contactId) {
    try {
        let response = await fetch(baseUrl + `contacts/${contactId}.json`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Fehler beim Löschen des Kontakts');
        }
        closeDetailDialog();
        initialize();
    } catch (error) {
        console.log('Fehler beim Löschen des Kontakts', error);
    }
    document.getElementById('detail-desk').innerHTML = '';
}