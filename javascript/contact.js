const detailRef = document.getElementById('detail');
const addContactRef = document.getElementById('add-contact');

function openAddContactDialog() {
    addContactRef.classList.remove('d-none');
}

function closeAddContactDialog() {
    addContactRef.classList.add('d-none');
}

function openDetailDialog() {
    detailRef.classList.remove('d-none');
}

function closeDetailDialog() {
    detailRef.classList.add('d-none'); 
}