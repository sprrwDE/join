let BASE_URL = "https://join-318-default-rtdb.europe-west1.firebasedatabase.app/accounts.json" 
let contacsFatch = 'https://join-318-default-rtdb.europe-west1.firebasedatabase.app/';
let currentUserURL = "https://join-318-default-rtdb.europe-west1.firebasedatabase.app/curent-user.json"


function start(){
  startLogInAnimation();
  
}

function startLogInAnimation() {
  const overlay = document.querySelector('.overlay');
  const logo = document.querySelector('.log-in-join-logo');

  // Setzt das Bild auf sichtbar und startet die Animation

  setTimeout(() => {
    overlay.classList.add('hidden'); // Overlay ausblenden
  }, 300); // Verzögerung nach Bedarf 

}

function logIn(event){
  event.preventDefault();
  accounts = [];
  loadAccounts();
  
}

async function postCurrentUser(userName, userEmail) {
  try {
    const response = await fetch(currentUserURL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: `${userName}`, email: `${userEmail}`}),
    });
    if (!response.ok) {
      throw new Error('Fehler beim Posten der Daten');
    }
  } catch (error) {
    console.error('Fehler beim Posten des aktuellen Benutzers:', error);
  }
}

function loadAccounts() {
  fetch(BASE_URL)
    .then((response) => response.json())
    .then((result) => {
      const accounts = Object.values(result);
      checkUserData(accounts);})
    .catch((error) => console.log('Fehler beim Abrufen der Daten:', error));
    
}

async function checkUserData(accounts){
  let userEmail = document.getElementById('user-email').value;
  let userPassword = document.getElementById('user-password').value;

  let user = accounts.find(a => a.email == userEmail && a.password == userPassword);
  if(user){
    let currentAccountName = user.name;
    let currentEmail = user.email
    await postCurrentUser(currentAccountName, currentEmail);
    window.location.href=`./documents/summary.html?name=${encodeURIComponent(currentAccountName)}`;
    
  }else{
    document.getElementById('user-email').classList.add('border-color-red');  
    document.getElementById('user-password').classList.add('border-color-red');  
    renderWrongLogIn(); 
  }
}

function renderWrongLogIn(){
  document.getElementById('wrong-log-in').innerHTML = `
  Check your email and password. Please try again.`;
}

function changePasswordIcon(inputID,spanID){
  let currentInputID = document.getElementById(`${inputID}`);
  let valueLength = currentInputID.value.length
  let iconBox = document.getElementById(`${spanID}`);
  iconBox.classList.remove('d-none');
  if (valueLength > 0) {
    currentInputID.classList.remove('password-input');
  }else{
    currentInputID.classList.add('password-input');
    iconBox.classList.add('d-none');}
    iconBox.innerHTML = `
    <img onclick="changeInputType('${inputID}', '${spanID}')" src="./assets/img/visibility_off.svg" alt="open-eye">`;
}

function changeInputType(inputID,spanID){
  let currentPasswordInput = document.getElementById(`${inputID}`);
  let iconBox = document.getElementById(`${spanID}`);
  if (currentPasswordInput.type === 'password') {
    currentPasswordInput.type = 'text';
    iconBox.innerHTML = `
    <img onclick="changeInputType('${inputID}', '${spanID}')" src="./assets/img/visibility.svg" alt="close-eye">`; 
  } else {
    currentPasswordInput.type = 'password';
    iconBox.innerHTML = `
    <img onclick="changeInputType('${inputID}', '${spanID}')" src="./assets/img/visibility_off.svg" alt="open-eye">`;} 
}

function logInAsGuest(){
  window.location.href='./documents/summary.html';
}

function loadSignUp(){
  document.getElementById('log-in').classList.add('d-none');
  document.getElementById('sign-up').classList.remove('d-none');
  renderSignUpHTML();
}



function checkFormValidity() {
  let name = document.getElementById('new-name').value;
  let email = document.getElementById('new-email').value;
  let password = document.getElementById('new-password').value;
  let confirmPassword = document.getElementById('check-new-password').value;
  let checkbox = document.getElementById('accept-box').checked;
  let button = document.getElementById('sign-up-button');

  if (name && email && password && confirmPassword && checkbox) {
      button.disabled = false;
  } else {
      button.disabled = true;
  }
}

function BackToLogIn(){
  document.getElementById('join-image-id').classList.remove('log-in-join-logo');
  document.getElementById('join-image-id').classList.add('static-logo');
  document.getElementById('sign-up').classList.add('d-none');
  document.getElementById('log-in').classList.remove('d-none'); 
}

function addNewUser(event) {
  event.preventDefault();
  let newName = document.getElementById('new-name').value;
  let newEmail = document.getElementById('new-email').value;
  let newPassword = document.getElementById('new-password').value;
  let checkNewPassword = document.getElementById('check-new-password').value;  
  comparePasswords(newName, newEmail, newPassword, checkNewPassword);
  getInputValues( newName, newEmail,newPassword);
}
/*übergibt daten für an contacts */
function getInputValues(contactName, contactEmail, newPassword) {
  inputData = {
      nameIn: contactName,
      emailIn: contactEmail,
      phoneIn: '',
      isUser: true,
      password: newPassword,
      color: getRandomColor()
  };
  pushData(inputData);
}

async function pushData(inputData) {
  try {
      let response = await fetch(contacsFatch + 'contacts.json', {
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
      initialize();
  } catch (error) {
      console.log('Fehler beim Pushen der Daten', error);
  }
}

function getRandomColor() {
  let randomNumber = Math.floor(Math.random() * 16777215);
  let randomColor = "#" + randomNumber.toString(16).padStart(6, "0");
  return randomColor;
}
// übergabe fertig
function comparePasswords(newName, newEmail, newPassword, checkNewPassword){
  if (newPassword == checkNewPassword) {
    postNewAccount(newName, newEmail, newPassword);
       
  }else{
    document.getElementById('check-new-password').classList.add('border-color-red');
    renderWrongPassword();
  }

}

function sendToPrivacyPolicy(){
  let noMember = true;
  window.open(`/documents/Privacy.html?userId=${noMember}`, '_blank');
}

function sendTolegalNotice(){
  let noMember = true;
  window.open(`/documents/legal.html?userId=${noMember}`, '_blank');
}

function postNewAccount(newName, newEmail, newPassword) {
  fetch(
    BASE_URL,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({name: `${newName}`, email: `${newEmail}`, password: `${newPassword}`}),
    }
  );
  renderSuccessfully();
  setTimeout(() => {
    window.location.href='./index.html';
}, 2000);
}

function renderSuccessfully(){
  document.getElementById('successfully').classList.remove('d-none');
  document.getElementById('successfully').classList.add('sign-up-overlay');
  return document.getElementById('successfully').innerHTML += `
  <div id="sign-up-overlay" class="success-overlay"></div>
  <div class="success-box">You Signed Up successfully</div>
  `;
}

function renderWrongPassword(){
  document.getElementById('wrong-password').innerHTML = `Your passwords don't match. Please try again.`;
}

function renderSignUpHTML(){
  return document.getElementById('sign-up').innerHTML = `
  <img class="static-logo" src="./assets/img/join-icon.svg" alt="">
  <div class="log-in-container">
    <div class="sign-in-title-container">
      <img onclick="BackToLogIn()" class="sign-up-arrow" src="./assets/img/arrow-left-line.svg" alt="">
      <h2>Sign up</h2>
    </div>
    <div class="border-bottom-log-in"></div>
    <form onsubmit="addNewUser(event)">
      <input id="new-name" class="input-field name-input" type="text" required placeholder="Name" oninput="checkFormValidity()">
      <input id="new-email" class="input-field email-input" type="email" required placeholder="Email" oninput="checkFormValidity()">
      <div class="input-container">
        <input id="new-password" class="input-field password-input" type="password" minlength="6" required placeholder="Password" onkeyup="changePasswordIcon('new-password','span-password-icon')" oninput="checkFormValidity()">
        <span id="span-password-icon" class="password-eye-open d-none"></span>
      </div>
      <div class="input-container">
        <input id="check-new-password" class="input-field password-input" type="password" minlength="6" required placeholder="Confirm Password" onkeyup="changePasswordIcon('check-new-password','span-check-password-icon')" oninput="checkFormValidity()">
        <span id="span-check-password-icon" class="password-eye-open d-none"></span>
      </div>
      <div id="wrong-password" class="font-color-red"></div>
      <div class="check-box-container check-box">
        <input type="checkbox" required id="accept-box" onchange="checkFormValidity()">
        <label for="checkbox">I accept the</label><a href="./documents/Privacy.html">Privacy policy</a>
      </div>
      <button disabled class="button log-in-button" id="sign-up-button">Sign up</button>
    </div>
    </form>
    <div class="log-in-link-container">
      <a id="privacy-link" onclick="sendToPrivacyPolicy()" href="#">Privacy Policy</a>
      <a id="legal-link" onclick="sendTolegalNotice()" href="#">Legal notice</a>
    </div>
    <div id="successfully" class="d-none"></div>`;

}


