


function loadUserName() {
  fetch(currentUserURL)
  .then((response) => response.json())
  .then((result) => {
    renderUserName(result);})
  .catch((error) => console.log('Fehler beim Abrufen der Daten:', error));
 
}

function renderUserName(result) {
  let name = result.nameIn;
  let firstLetter = name[0];
  if (result) {
    document.getElementById('header-user-icon').innerHTML = `${firstLetter}`;  
  }
}       

