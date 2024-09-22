/**
 * @file Task Management Functions - Handles fetching, updating, and deleting task assignments from the Firebase database.
 */

let taskDb = [];
let currentTaskId;

/**
 * Fetches tasks from the Firebase database and populates the `taskDb` array.
 * 
 * @async
 * @function getTasks
 * @param {string} path - The path to the Firebase database endpoint.
 * @returns {Promise<void>} - A promise that resolves when tasks are fetched and added to `taskDb`.
 */
async function getTasks(path) {
    let taskArray = [];

    try {
        let response = await fetch(baseUrl + path + '.json');
        let data = await response.json();
        if (data) {
            taskArray = Object.entries(data).map(([key, value]) => {
                return {
                    firebaseid: key,
                    ...value
                };
            });
            taskDb.push(...taskArray);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

/**
 * Deletes a contact assignment from all tasks where the contact is assigned.
 * 
 * @function deleteAssigned
 * @param {string} contactName 
 */
function deleteAssigned(contactName) {
    const assignedObjects = findAllAssigned(contactName);
    for (let i = 0; i < assignedObjects.length; i++) {
        let assignedtoString = assignedObjects[i].assignedto;
        let array = assignedtoString.includes(",") ? assignedtoString.split(",").map(item => item.trim()) : [assignedtoString.trim()];
        const index = array.indexOf(contactName);
        if (index > -1) {
            array.splice(index, 1); 
        }
        const newAssign = array.join(",");
        deleteAssignCard(assignedObjects[i], newAssign);
    }
}


/**
 * Updates the assigned contact list for a task and sends the updated task data to Firebase.
 * 
 * @function deleteAssignCard
 * @param {Object} currentTaskObject - The task object that needs to be updated.
 * @param {string} newAssign - The updated string of assigned contacts.
 */
function deleteAssignCard(currentTaskObject, newAssign) {
    let taskId = currentTaskObject.firebaseid;
    const updatedData = {
        title: currentTaskObject.title,
        description: currentTaskObject.description,
        assignedto: newAssign, 
        date: currentTaskObject.date,
        prio: currentTaskObject.prio,
        category: currentTaskObject.category,
        subtask: currentTaskObject.subtask,
        status: currentTaskObject.status, 
        id: currentTaskObject.id,
        color: currentTaskObject.color,
        inits: currentTaskObject.inits,
    };
    console.log("Updated Data:", updatedData);
    console.log("Firebase ID:", taskId);

    sendUpdateTaskRequest(taskId, updatedData);
}

/**
 * Finds and returns all tasks that a given contact is assigned to.
 * 
 * @function findAllAssigned
 * @param {string} name - The name of the contact to search for in task assignments.
 * @returns {Object[]} - An array of task objects that contain the specified contact.
 */
function findAllAssigned(name) {
    let results = [];
    for (let i = 0; i < taskDb.length; i++) {
        if (taskDb[i].assignedto.includes(name)) {
            results.push(taskDb[i]);
        }
    }
    console.log("Found Entries:", results);
    return results;
}