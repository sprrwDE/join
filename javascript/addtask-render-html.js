function renderAssignedTo(contact,i, firstinits, secondinits) {
    return `
    <div class="contact" id="contact">
                        <div class="flex">
                            <div class="contact-initals" id="contact-initals${i}"style="background-color: ${getRandomColor()};">
                        <span id="inits${i}">${firstinits}${secondinits}</span>
                    </div>
                            <p>${contact[i]}</p>
                        </div>
                        <div class="checkbox-wrapper-19">
                            <input type="checkbox" id="cbtest-19-${i}" onclick="assignedToChecked(${i})"/>
                            <label for="cbtest-19-${i}" class="check-box"></label>
                        </div>
                    </div>
    `
}

function renderContactsImages(inits, i) {
    return `
  <div class="contact-initals d-none" id="contact-initals1${i}" style="background-color: ${getRandomColor()};">
    <span>${inits}</span>
  </div>`;
}