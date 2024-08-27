let BASE_URL = "https://join-318-default-rtdb.europe-west1.firebasedatabase.app/accounts.json" 

let iconBox = ''; 
let currentPasswordInput = '';

function logIn(event){
  event.preventDefault();
  accounts = [];
  loadAccounts();
  
}

function loadAccounts() {
  fetch(BASE_URL)
    .then((response) => response.json())
    .then((result) => {
      const accounts = Object.values(result);
      checkUserData(accounts);})
    .catch((error) => console.log('Fehler beim Abrufen der Daten:', error));
    
}

function checkUserData(accounts){
  let userEmail = document.getElementById('user-email').value;
  let userPassword = document.getElementById('user-password').value;
  let user = accounts.find(a => a.email == userEmail && a.password == userPassword)
  if(user){
    window.location.href='./documents/summary.html';
  }
}

function changePasswordIcon(inputID,spanID){
  let currentInputID = document.getElementById(`${inputID}`);
  currentPasswordInput = currentInputID;
  currentInputID.classList.remove('password-input');
  let currentSpanID = document.getElementById(`${spanID}`);
  iconBox = currentSpanID
  iconBox.classList.remove('d-none');
  iconBox.innerHTML = `
  <img onclick="changeInputType('${inputID}', '${spanID}')" src="./assets/img/visibility.svg" alt="open-eye">
  `;

}

function changeInputType(inputID,spanID){
  let currentInputID = document.getElementById(`${inputID}`);
  currentPasswordInput = currentInputID;
  let currentSpanID = document.getElementById(`${spanID}`);
  iconBox = currentSpanID
  if (currentPasswordInput.type === 'password') {
    currentPasswordInput.type = 'text';
    iconBox.innerHTML = `
    <img onclick="changeInputType('${inputID}', '${spanID}')" src="./assets/img/visibility_off.svg" alt="close-eye">
    `; 
  } else {
    currentPasswordInput.type = 'password';
    iconBox.innerHTML = `
    <img onclick="changeInputType('${inputID}', '${spanID}')" src="./assets/img/visibility.svg" alt="open-eye">
    `;
  }
  
}

function logInAsGuest(){
  window.location.href='./documents/summary.html';
}

function loadSignUp(){
  document.getElementById('log-in').classList.add('d-none');
  document.getElementById('sign-up').classList.remove('d-none');
  renderSignUpHTML();

}

function BackToLogIn(){
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
}

function comparePasswords(newName, newEmail, newPassword, checkNewPassword){
  if (newPassword == checkNewPassword) {
    postNewAccount(newName, newEmail, newPassword);
       
  }else{
    alert('Passwörter stimmen nicht überein')/**ändern in text unter confirm  password */
  }

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

function renderSignUpHTML(){
  return document.getElementById('sign-up').innerHTML = `
  <img class="log-in-join-logo" src="./assets/img/join-icon.svg" alt="">
  <div class="log-in-container">
    <div class="sign-in-title-container">
      <img onclick="BackToLogIn()" class="sign-up-arrow" src="./assets/img/arrow-left-line.svg" alt="">
      <h2>Sign up</h2>
    </div>
    <div class="border-bottom-log-in"></div>
    <form onsubmit="addNewUser(event)">
      <input id="new-name" class="input-field name-input" type="text" required placeholder="Name">
      <input id="new-email" class="input-field email-input" type="email" required placeholder="Email">
      <div class="input-container">
      <input id="new-password" class="input-field password-input" type="password" required placeholder="Password" onkeyup="changePasswordIcon('new-password','span-password-icon')">
      <span id="span-password-icon" class="password-eye-open d-none"></span>
      </div>
      <div class="input-container">
      <input id="check-new-password" class="input-field password-input" type="password" required placeholder="Confirm Password" onkeyup="changePasswordIcon('check-new-password','span-check-password-icon')">
      <span id="span-check-password-icon" class="password-eye-open d-none"></span>
      </div>
      <div class="check-box-container">
        <input type="checkbox" required id="accept-box">
        <label for="checkbox">I accept the</label><a href="">Privacy policy</a>
      </div>
      <button class="button log-in-button">Sign up</button>
  </div>
  </form>
  <div class="log-in-link-container">
    <a href="">Privacy Policy</a>
    <a href="">Legal notice</a>
  </div>
  <div id="successfully" class="d-none"></div>`;
}

