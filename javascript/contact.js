const detailRef = document.getElementById('detail');
const addContactRef = document.getElementById('add-contact');
const contactListRef = document.getElementById('contact-list');
const listContentRef = document.getElementById('list-content-outter');

let baseUrl = 'https://join-318-default-rtdb.europe-west1.firebasedatabase.app/';
let db = [];

let nameInput = document.getElementById('name').value;
let emailInput = document.getElementById('email').value;
let phoneInput = document.getElementById('phone').value;

let pathPush = `contacts/${getInitials(nameInput)}`;

let data = {
    name: nameInput,
    email: emailInput,
    phone: phoneInput
};


/**
 * Fetch API POST
 */

async function init() {
    try {
        db = [];
        await fetchApi("contacts");
    }
    finally {
        listContentRef.innerHTML = '';
        renderGroups();
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
 * Renders Contacts into DOM
 */

function renderGroups() {
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
        listContentRef.innerHTML += contactTemplate(initial, index);
        let currentContactRef = document.getElementById(`list-content-inner-${index}`);

        organizedContacts[initial].forEach(contact => {
            let name = contact.name;
            let email = contact.email;
            let phone = contact.phone;
            currentContactRef.innerHTML += getContactsTemplate(name, email, phone);
        });
    });
}

/**
 * Push Data from input-fields into Firestone Database
 */

async function pushData() {
    try {
        let response = await fetch(baseUrl + pathPush + '.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.log('Error pushing data', error);
    } finally {
        closeAddContactDialog();
        init();
    }
}

// Funktion, um den Initialbuchstaben des Nachnamens zu erhalten
function getInitials(name) {
    let namesArray = name.trim().split(' ');
    let lastName = namesArray[namesArray.length - 1];
    return lastName.charAt(0).toUpperCase(); // Der erste Buchstabe des Nachnamens
}


/**
 * Dialog functions
 */

function openAddContactDialog() {
    addContactRef.classList.remove('d-none');
}

function closeAddContactDialog() {
    addContactRef.classList.add('d-none');
    contactListRef.classList.remove('d-none');
}

function openDetailDialog(index) {
    let currentIndex = index;
    detailRef.classList.remove('d-none');
    contactListRef.classList.add('d-none');
    detailRef.innerHTML = getDetailTemplate(currentIndex);
}

function closeDetailDialog() {
    detailRef.classList.add('d-none');
    contactListRef.classList.remove('d-none');
}

/**
 * Templates
 */

function contactTemplate(initial, index) {
    return `
        <h2 class="initial-letter">${initial}</h2>
        <div class="seperator-list"></div>
        <div class="list-content-wrapper" id="list-content-inner-${index}" onclick="openDetailDialog(${index})">
        </div>
    `;
}

function getContactsTemplate(name, email, phone) {
    return `
        <div class="list-card">
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

function getDetailTemplate(index) {
    let currentContact = db[index];
    let contactId = Object.keys(currentContact).find(key => key !== 'letter');
    let contact = currentContact[contactId];

    return `            
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
        </div>
        <button onclick="closeDetailDialog()">Close</button>`;
}

/**
 * Floating Buttons
 * Zurück Button Contacts
 * Edit Contact
 * Edit / delete / success overlay beim Mauszeiger
 * Desktop
 * Allgemein Styling anpassen
 * Buttons verbergen
 */