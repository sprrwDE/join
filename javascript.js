const params = new URLSearchParams(window.location.search);
const currentName = params.get('name');
const icon = params.get('icon');
const notAMember = params.get('userId');
let togglePopUp = false;


function init() {
  includeHTML().then(() => {
      loadAccountName();
      noMemberLink();
      changeNavbarColor(); 
  }).catch((error) => {
      console.error("Error including HTML:", error);
  });
}

function loadAccountName() {
  if (currentName) {
    document.getElementById('greet-name').innerHTML = `${currentName}`;  
  }
}

function noMemberLink() {
  if (notAMember) {
    document.getElementById('navbar-links').classList.add('d-none');
    document.getElementById('help-account-box').classList.add('d-none');
  }
}

function changeNavbarColor(){
  if (icon == 'summary') {
    document.getElementById('summary').classList.add('background-color');
  }
  if (icon == 'board') {
    document.getElementById('board').classList.add('background-color');
  }
  if (icon == 'addtask') {
    document.getElementById('addtask').classList.add('background-color');
  }
  if (icon == 'contacts') {
    document.getElementById('contacts').classList.add('background-color');
  }
}

function renderPopUp() {
  let popUpBox = document.getElementById('headline-pop-up-container');
  togglePopUp = !togglePopUp;

  if (togglePopUp) {
    popUpBox.innerHTML = `
    <div id="headline-pop-up" class="headline-pop-up"> 
      <a class="pop-up-help" href="../documents/help.html">Help</a>
      <a href="../documents/legal.html">Legal Notice</a>
      <a href="../documents/Privacy.html">Privacy Policy</a>
      <a href="../index.html">Log out</a>
    </div>`;
    setTimeout(() => {
      document.getElementById('headline-pop-up').className += ' active'; 
    }, 10); 
    } else  {
    let popUp = document.getElementById('headline-pop-up');
    if (popUp) {
      popUp.className = 'headline-pop-up'; 
      setTimeout(() => popUpBox.innerHTML = '', 500); 
    }
  }
}

function moveToLastPage(){
  history.back();
}

function openHelpPage(){
  window.location.href="../documents/help.html";
}





function sendToPrivacyPolicy(){
  let noMember = true;
  const privacyLink = document.getElementById("privacy-link");
  privacyLink.href = `./documents/Privacy.html?userId=${noMember}`;
}

function sendTolegalNotice(){
  let noMember = true;
  const legalNoticeLink = document.getElementById("legal-link");
  legalNoticeLink.href = `./documents/legal.html?userId=${noMember}`;
}


