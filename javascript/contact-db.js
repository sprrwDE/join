// Firebase References
/** @type {string} */
let baseUrl = 'https://join-318-default-rtdb.europe-west1.firebasedatabase.app/';

/**
 * Initializes the contact list by fetching data from Firebase.
 * Clears the existing list and renders contacts.
 */
async function initializeContactList() {
    init();
    try {
        db = [];  
        await getData("contacts");  
    } finally {
        listContentRef.innerHTML = '';
        renderContactGroups();
        if (currentId) {
            selectElement(currentId);
        }
    }
}

/**
 * Fetches contact data from Firebase RealtimeDB.
 * 
 * @param {string} path - The path in the Firebase DB to fetch data from.
 */
async function getData(path) {
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
 * Pushes new contact data into Firebase RealtimeDB.
 * 
 * @param {Object} inputData - The contact data to push into the database.
 */
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
        initializeContactList();
    } catch (error) {
        console.log('Fehler beim Pushen der Daten', error);
    }
}

/**
 * Deletes a contact from Firebase RealtimeDB.
 * 
 * @param {number} contactId - The ID of the contact to delete.
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
        initializeContactList();
    } catch (error) {
        console.log('Fehler beim Löschen des Kontakts', error);
    }
    document.getElementById('detail-desk').innerHTML = '';
}

/**
 * Sends an update request to Firebase RealtimeDB for a specific contact.
 * 
 * @param {number} contactId - The ID of the contact to update.
 * @param {Object} updatedData - The updated contact data.
 * @returns {boolean} True if the request was successful, false otherwise.
 */
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

/**
 * Updates the contact information in Firebase RealtimeDB and local database.
 */
async function updateContact() {
    const updatedData = getUpdatedContactData();
    if (!updatedData) return;

    const success = await sendUpdateRequest(currentId, updatedData);
    if (success) {
        updateLocalDatabase(currentId, updatedData);
        closeEditContactDialog();
        await initializeContactList();
        selectElement(currentId);
        updateDetailView(updatedData);
        
        if (updatedData.isUser) {
            await updateAccount();
        }
    } else {
        alert("Fehler beim Aktualisieren des Kontakts.");
    }
}

// User-related functions

/** @type {Array<Object>} */
let userDb;

/**
 * Initializes the user database by fetching user data from Firebase.
 */
async function initializeUsers() {
    try {
        userDb = [];
        await getUserData("curent-user");
    } catch (error) {
        console.log('Fehler beim Abrufen der Daten:', error);
    }
}

/**
 * Fetches user data from Firebase RealtimeDB.
 * 
 * @param {string} path - The path in the Firebase DB to fetch user data from.
 */
async function getUserData(path) {
    try {
        let userResponse = await fetch(baseUrl + path + '.json');
        let userData = await userResponse.json();

        if (userData) {
            let userArray = Object.entries(userData).map(([key, value]) => {
                return {
                    userId: key,
                    ...value
                };
            });
            userDb.push(...userArray);
        }
    } catch (error) {
        console.log('Fehler beim Abrufen der Daten:', error);
    }
}

/**
 * Updates the user account data in Firebase RealtimeDB.
 * 
 * @returns {boolean} True if the update was successful, false otherwise.
 */
async function updateAccount() {
    try {
        const updatedData = getUpdatedContactData();
        let response = await fetch(`${baseUrl}curent-user.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error('Fehler beim Bearbeiten des Benutzerkontos');
        }
        return true;
    } catch (error) {
        console.log('Fehler beim Aktualisieren des Benutzerkontos:', error);
        return false;
    }
}
