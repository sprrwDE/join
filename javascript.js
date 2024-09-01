let togglePopUp = false


function init(){
    includeHTML();
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


