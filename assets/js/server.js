const { ipcRenderer } = require('electron');

const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(event) {
    // Prevent default actions
    event.preventDefault();

    // Retrieve item from input
    const item = document.querySelector('#item').value;

    // Send to main.js
    ipcRenderer.send('item:add', item);

}