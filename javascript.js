function init(){
    loadLogIn();
    includeHTML()
}





async function fetchApi() {
    try {
        let response = await fetch('https://join-318-default-rtdb.europe-west1.firebasedatabase.app/.json');
        let responseToJson = response.json();
        console.log(responseToJson);
    } catch (error) {
        console.log('Error Brudi')
    }
}


async function pushData() {
    try {
        let data = {
            name: "John Doe",
            email: "john.doe@example.com",
            age: 30
        };

        let response = await fetch('https://join-318-default-rtdb.europe-west1.firebasedatabase.app/users.json', {
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
    }
}