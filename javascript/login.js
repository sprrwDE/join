function logInAsGuest(){
  window.location.href='../documents/summary.html';
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

function renderSignUpHTML(){
  return document.getElementById('sign-up').innerHTML = `
  <img class="log-in-join-logo" src="/assets/img/join-icon.svg" alt="">
  <div class="log-in-container">
    <div class="sign-in-title-container">
      <img onclick="BackToLogIn()" class="sign-up-arrow" src="/assets/img/arrow-left-line.svg" alt="">
      <h2>Sign up</h2>
    </div>
    <div class="border-bottom-log-in"></div>
    <form onsubmit="">
      <input class="input-field name-input" type="text" required placeholder="Name">
      <input class="input-field email-input" type="email" required placeholder="Email">
      <input class="input-field password-input" type="password" required placeholder="Password">
      <input class="input-field password-input" type="password" required placeholder="Confirm Password">

      <div class="check-box-container">
        <input type="checkbox" id="accept-box">
        <label for="checkbox">I accept the</label><a href="">Privacy policy</a>
      </div>
      <button class="button log-in-button">Sign up</button>
  </div>
  </form>
  <div class="log-in-link-container">
    <a href="">Privacy Policy</a>
    <a href="">Legal notice</a>
  </div>`;
}