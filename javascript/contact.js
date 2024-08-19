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

function openDetailDialog() {
    detailRef.classList.remove('d-none');
    contactListRef.classList.add('d-none');
}

function closeDetailDialog() {
    detailRef.classList.add('d-none'); 
    contactListRef.classList.remove('d-none');
}

/**
 * Fetch API POST
 */

async function fetchApi() {
    try {
        let response = await fetch('https://join-318-default-rtdb.europe-west1.firebasedatabase.app/.json');
        let responseToJson = response.json();
        console.log(responseToJson);
    } catch (error) {
        console.log('Error Brudi')
    }
    includeHTML()
}




async function pushData() {
    try {
        let data = {
            name: `${document.getElementById('name').value}`,
            email: `${document.getElementById('email').value}`,
            phone: `${document.getElementById('phone').value}`
        };

        let response = await fetch('https://join-318-default-rtdb.europe-west1.firebasedatabase.app/test.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        let responseToJson = await response.json();
        console.log('Data pushed successfully:', responseToJson);
    } catch (error) {
        console.log('Error pushing data', error);
    } finally {
        closeAddContactDialog();
    }
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