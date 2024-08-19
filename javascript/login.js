function guestLogIn(){
  document.getElementById('log-in').classList.add('d-none');
  document.getElementById('join-main-section').classList.remove('d-none');
}

function signUp(){
  document.getElementById('log-in').classList.add('d-none');
  document.getElementById('sign-up').classList.remove('d-none');
}

function backToLogIn(){
  document.getElementById('log-in').classList.remove('d-none');
  document.getElementById('sign-up').classList.add('d-none');
}