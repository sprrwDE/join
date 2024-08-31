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
      <a href="">Help</a>
      <a href="">Legal Notice</a>
      <a href="">Privacy Policy</a>
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



