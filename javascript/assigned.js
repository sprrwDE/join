let taskDb = [];
let currentTaskId;

async function getTasks(path) {
    let taskArray = [];

    try {
        let response = await fetch(baseUrl + path + '.json');
        let data = await response.json();

        if (data) {
            taskArray = Object.entries(data).map(([key, value]) => {
                return {
                    id: key,
                    ...value
                };
            });
            taskDb.push(...taskArray);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    } 
}

/*
function setCurrentTaskId() {
    for (let i = 0; i < taskDb.length; i++) {
        currentTaskId = taskDb[i].id;
    }
}
*/

function deleteAssigned(contactName) {
        console.log("task db", taskDb);
        console.log("contact db", db);
        console.log("name", contactName);
        
    // const found = taskDb.find((task) => { Object.values(task.assignedto).includes(contactName); })
    // console.log(found);
}