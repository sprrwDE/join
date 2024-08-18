const detailRef = document.getElementById('detail');
const addContactRef = document.getElementById('add-contact');
const contactListRef = document.getElementById('contact-list')

function openAddContactDialog() {
    addContactRef.classList.remove('d-none');
}

function closeAddContactDialog() {
    addContactRef.classList.add('d-none');
    contactListRef.classList.remove('d-none');
}

function openDetailDialog() {
    detailRef.classList.remove('d-none');
    contactListRef.classList.add('d-none');
}

function closeDetailDialog() {
    detailRef.classList.add('d-none'); 
    contactListRef.classList.remove('d-none');
}