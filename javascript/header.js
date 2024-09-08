


function loadUserName() {
  fetch(currentUserURL)
  .then((response) => response.json())
  .then((result) => {

    renderUserName(result);})
  .catch((error) => console.log('Fehler beim Abrufen der Daten:', error));
 
}

function renderUserName(result) {
  let name = result.name;
  document.getElementById('header-user-icon').innerHTML = `${name}`;
}       