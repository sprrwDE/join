// Div References
const showDetail = document.getElementById('contact-detail');
const detailRef = document.getElementById('detail');
const addContactRef = document.getElementById('add-contact');
const contactListRef = document.getElementById('contact-list');
const listContentRef = document.getElementById('list-content-outter');
const addButtonRef = document.getElementById('add-button');
const editButtonRef = document.getElementById('edit-button');
const editBoxRef = document.getElementById('edit-box')

// Input References
let nameInput, emailInput, phoneInput

// Firebase References
let baseUrl = 'https://join-318-default-rtdb.europe-west1.firebasedatabase.app/';
let pathPush;
let currentIndex;

// Data Storage
let db = [];
let inputData;

/**
 * Fetches Firebase RealtimeDB
 */

async function init() {
    try {
        db = [];
        await fetchApi("contacts");
    }
    finally {
        listContentRef.innerHTML = '';
        renderContactGroups();
        includeHTML();
    }
}

async function fetchApi(path) {
    try {
        let response = await fetch(baseUrl + path + '.json');
        let data = await response.json();
        let userKeysArray = Object.keys(data).map(key => {
            return {
                letter: key,
                ...data[key]
            };
        });
        db.push(...userKeysArray);
    } catch (error) {
        console.log('Error Brudi')
    }
}

/**
 * Renders Contact List into DOM
 */

function renderContactGroups() {
    listContentRef.innerHTML = '';
    let organizedContacts = {};

    for (let i = 0; i < db.length; i++) {
        let currentContact = db[i];
        let letter = currentContact.letter;
        organizedContacts[letter] = [];
        Object.keys(currentContact).forEach(key => {
            if (key !== 'letter') {
                organizedContacts[letter].push(currentContact[key]);
            }
        });
    }
    renderContacts(organizedContacts);
}

function renderContacts(organizedContacts) {
    let sortedInitials = Object.keys(organizedContacts).sort();

    sortedInitials.forEach((initial, index) => {
        listContentRef.innerHTML += contactTemplateInitial(initial, index);
        let currentContactRef = document.getElementById(`list-content-inner-${index}`);
        organizedContacts[initial].forEach((contact, i) => {
            let name = contact.name;
            let email = contact.email;
            let phone = contact.phone;
            currentContactRef.innerHTML += getContactsTemplate(name, email, phone, i);
        });
    });
}

/**
 * Add Contact Dialog
 */

function openAddContactDialog() {
    addContactRef.classList.remove('d-none');
    editButtonRef.classList.add('d-none');
    addButtonRef.classList.add('d-none');
}

function closeAddContactDialog() {
    addContactRef.classList.add('d-none');
    contactListRef.classList.remove('d-none');
    addButtonRef.classList.remove('d-none');
}

/**
 * Push Data from input-fields into Firestone Database
 */

function getInputValues() {
    nameInput = document.getElementById('name').value;
    emailInput = document.getElementById('email').value;
    phoneInput = document.getElementById('phone').value;
    
    let initials = getInitials(nameInput);
    pathPush = `contacts/${initials[1]}`;

    inputData = {
        name: nameInput,
        email: emailInput,
        phone: phoneInput
    };

    pushData(inputData, pathPush);
}

async function pushData(inputData, pathPush) {
    try {
        let response = await fetch(baseUrl + pathPush + '.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputData)
        });
    } catch (error) {
        console.log('Error pushing data', error);
    } finally {
        closeAddContactDialog();
        init();
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

function openDetailDialog(index) {
    currentIndex = index;
    showDetail.classList.remove('d-none');
    detailRef.classList.remove('d-none');
    contactListRef.classList.add('d-none');
    editButtonRef.classList.remove('d-none');
    editBoxRef.classList.add('d-none');
    addButtonRef.classList.add('d-none');
    getDetailTemplate(currentIndex);
}

function getDetailTemplate(index) {
    currentIndex = index;
    let currentContact = db[index];
    let contactId = Object.keys(currentContact).find(key => key !== 'letter');
    let contact = currentContact[contactId];
    detailRef.innerHTML = detailTemplate(contact, currentIndex);
}

function closeDetailDialog() {
    showDetail.classList.add('d-none');
    detailRef.classList.add('d-none');
    contactListRef.classList.remove('d-none');
    editButtonRef.classList.add('d-none');
    addButtonRef.classList.remove('d-none');
}

/**
 * Edit / Delete
 */

function stopPropagation(event) {
    event.stopPropagation();
}

function showEditBox(event) {
    stopPropagation(event); // Stop propagation when showing the edit box
    document.getElementById('edit-box').classList.toggle('d-none');
}

function hideEditBox() {
    document.getElementById('edit-box').classList.add('d-none');
}

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

function getContactsTemplate(name, email, phone, index) {
    return `
        <div class="list-card" onclick="openDetailDialog(${index})">
        <div class="card-image">
            <h4>${name}</h4>
        </div>
        <div class="list-content">
            <h4>${name}</h4>
            <a href="mailto:${email}">${email}</a>
            <p>${phone}</p>
        </div>
        </div>
    `;
}

function detailTemplate(contact) {
    return `
    <div class="exit-detail" id="exit-detail" onclick="closeDetailDialog()">
        <img src="../assets/img/exit-detail.svg">
    </div>            
    <div class="contact-detail-header">
        <h2>Contacts</h2>
        <h3>Better with a team!</h3>
        <div class="seperator-card"></div>
    </div>
    <div class="contact-info-wrapper">
        <div class="avatar-wrapper">
            <div class="card-image">
                <h4>${contact.name ? contact.name.charAt(0) : "N/A"}</h4>
            </div>
            <h4>${contact.name || "Name not available"}</h4>
        </div>
        <div class="contact-content">
            <h4>Contact information</h4>
            <p><b>Email</b></p>
            <a href="mailto:${contact.email || ""}">${contact.email || "Email not available"}</a>
            <p><b>Phone</b></p>
            <p>${contact.phone || "Phone not available"}</p>
        </div>
    </div>`
}

/**
 * Zurück Button Contacts
 * Edit Contact
 * Edit Placeholder = Name
 * Edit / delete / success overlay beim Mauszeiger
 * Desktop
 * Allgemein Styling anpassen
 */