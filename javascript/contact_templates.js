/**
 * Templates
 */

function contactTemplateInitial(initial, index) {
    return `
        <h2 class="initial-letter">${initial}</h2>
        <div class="seperator-list"></div>
        <div class="list-content-wrapper" id="list-content-inner-${index}">
        </div>
    `;
}

function getContactsTemplate(name, email, phone, currentI, first, last) {
    return `
        <div class="list-card" onclick="openDetailDialog('${name}', '${email}', '${phone}', '${currentI}', '${first}', '${last}')">
        <div class="card-image">
            <h4>${first}${last}</h4>
        </div>
        <div class="list-content">
            <h4>${name}</h4>
            <a href="mailto:${email}">${email}</a>
            <p>${phone}</p>
        </div>
        </div>
    `;
}

function detailTemplate(name, email, phone, first, last) {
    return `
    <div class="exit-detail" id="exit-detail" onclick="closeDetailDialog()">
        <img src="../assets/img/exit-detail.svg">
    </div>            
    <div class="contact-detail-header">
        <h2>Contacts</h2>
        <h3>Better with a team!</h3>
        <div class="seperator-card"></div>
    </div>
    <div class="contact-info-wrapper">
        <div class="avatar-wrapper">
            <div class="card-image">
                <h4>${first}${last}</h4>
            </div>
            <h4>${name}</h4>
        </div>
        <div class="contact-content">
            <h4>Contact information</h4>
            <p><b>Email</b></p>
            <a href="mailto:${email}">${email}</a>
            <p><b>Phone</b></p>
            <p>${phone}</p>
        </div>
    </div>`
}