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
let organizedContacts = {};

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
        let test = Object.values(data);
        console.log(test)
        let userKeysArray = Object.keys(data).map(key => {
            return {
                letter: key,
                ...data[key],
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

    for (let index = 0; index < sortedInitials.length; index++) {
        let initial = sortedInitials[index];
        listContentRef.innerHTML += contactTemplateInitial(initial, index);
        let currentContactRef = document.getElementById(`list-content-inner-${index}`);
        
        let contacts = organizedContacts[initial];
        console.table(contacts)
        for (let i = 0; i < contacts.length; i++) {
            let contact = contacts[i];
            let currentName = contact.name;
            let currentEmail = contact.email;
            let currentPhone = contact.phone;
            let initials = getInitials(currentName);
            let currentI = i;
            let color = getRandomColor();

            currentContactRef.innerHTML += getContactsTemplate(currentName, currentEmail, currentPhone, currentI, initials[0], initials[initials.length - 1], color);
        }
    }
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
        nameIn: nameInput,
        emailIn: emailInput,
        phoneIn: phoneInput,
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

function openDetailDialog(name, email, phone, index, first, last, color) {
    openDetailReferences();
    getDetailTemplate(name, email, phone, index, first, last, color);
}

function openDetailReferences() {
    showDetail.classList.remove('d-none');
    detailRef.classList.remove('d-none');
    editButtonRef.classList.remove('d-none');
    contactListRef.classList.add('d-none');
    editBoxRef.classList.add('d-none');
    addButtonRef.classList.add('d-none');
}

function getDetailTemplate(n, e, p, i, f, l, c) {
    currentIndex = i;
    console.log(currentIndex)
    detailRef.innerHTML = detailTemplate(n, e, p, f, l, c); //index wird noch nicht übergeben
}

function closeDetailDialog() {
    showDetail.classList.add('d-none');
    detailRef.classList.add('d-none');
    editButtonRef.classList.add('d-none');
    contactListRef.classList.remove('d-none');
    addButtonRef.classList.remove('d-none');
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
    stopPropagation(event); // Stop propagation when showing the edit box
    document.getElementById('edit-box').classList.toggle('d-none');
}

function hideEditBox() {
    document.getElementById('edit-box').classList.add('d-none');
}


/**
 * Zurück Button Contacts
 * Edit Contact
 * Edit Placeholder = Name
 * Edit / delete / success overlay beim Mauszeiger
 * Desktop
 * Allgemein Styling anpassen
 */