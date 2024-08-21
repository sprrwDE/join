let baseUrl = 'https://join-318-default-rtdb.europe-west1.firebasedatabase.app/';
let db = []
/**
 * Fetch API POST
 */

async function init() {
    await fetchApi("contacts");
    renderContacts();
    console.log(db);
    includeHTML()
}

async function fetchApi(path) {
    try {
        let response = await fetch(baseUrl + path + '.json');
        let data = await response.json();
        // noch nicht 100% verstanden
        let userKeysArray = Object.keys(data).map(key => {
            return {
                id: key, 
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

function renderContacts() {
    let contentRef = document.getElementById('list-content-outter');
    contentRef.innerHTML = ''; 

    let organizedContacts = {};
    
    // Erste Schleife zum Organisieren der Kontakte nach Initialen
    for (let i = 0; i < db.length; i++) {
        let contactGroup = db[i]; // Zugriff auf das aktuelle Gruppenobjekt
        let id = contactGroup.id; // Holen der Initialbuchstaben ID

        // Organisieren der Kontakte unter den entsprechenden Initialen
        if (!organizedContacts[id]) {
            organizedContacts[id] = [];
        }

        Object.keys(contactGroup).forEach(key => {
            if (key !== 'id') {
                organizedContacts[id].push(contactGroup[key]);
            }
        });
    }

    // Zweite Schleife zum Rendern der gruppierten Kontakte
    Object.keys(organizedContacts).forEach((initial, index) => {
        contentRef.innerHTML += contactTemplate(initial, index);
        let contentTestRef = document.getElementById(`list-content-inner-${index}`);

        organizedContacts[initial].forEach(contact => {
            let name = contact.name;
            let email = contact.email;
            let phone = contact.phone;
            contentTestRef.innerHTML += getContactsTemplate(name, email, phone);
        });
    });
}

/**
 * Push Data from input-fields into Firestone Database
 */

async function pushData() {
    try {
        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let phone = document.getElementById('phone').value;

        // Funktion, um den Initialbuchstaben des Nachnamens zu erhalten
        function getLastNameInitial(fullName) {
            let nameParts = fullName.trim().split(' ');
            let lastName = nameParts[nameParts.length - 1];
            return lastName.charAt(0).toUpperCase(); // Der erste Buchstabe des Nachnamens
        }

        // Generiere die ID aus dem Initialbuchstaben des Nachnamens
        let id = getLastNameInitial(name);

        // Erstelle das Datenobjekt
        let data = {
            name: name,
            email: email,
            phone: phone
        };

        // Baue den Pfad zusammen
        let path = `contacts/${id}`;

        // Sende die Daten an Firebase
        let response = await fetch(baseUrl + path + '.json', {
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


/**
 * Dialog functions
 */

const detailRef = document.getElementById('detail');
const addContactRef = document.getElementById('add-contact');
const contactListRef = document.getElementById('contact-list')

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
    let contactGroup = db[index];
    let contactKey = Object.keys(contactGroup).find(key => key !== 'id'); // Finde den Schlüssel, der nicht 'id' ist
    let contact = contactGroup[contactKey]; // Holt das tatsächliche Kontaktobjekt basierend auf dem Schlüssel

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