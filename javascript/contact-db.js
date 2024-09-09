/**
 * Loads Contact Firebase RealtimeDB
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
            console.log(db)
        }
    } catch (error) {
        console.log('Fehler beim Abrufen der Daten:', error);
    }
}

/**
 * Pushes Input Data into Contact Firebase RealtimeDB
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
 * Deletes Contact in Firebase DB
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
 * Updates Contact in Firebase Realtime DB
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
 * Edits User in Firebase Realtime DB
 */

let userDb;

async function initializeUsers() {
    try {
        userDb = [];
        await getUserData("curent-user");
    } catch (error) {
        console.log('Fehler beim Abrufen der Daten:', error);
    }
} 

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

async function updateAccount() {
    console.log("Aktualisiere Benutzer...");
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
        console.log("Benutzerkonto erfolgreich aktualisiert.");
        return true;
    } catch (error) {
        console.log('Fehler beim Aktualisieren des Benutzerkontos:', error);
        return false;
    }
}
