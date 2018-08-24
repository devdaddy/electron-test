const { ipcRenderer } = require('electron');
const ul = document.querySelector('ul');

// Add item to list
ipcRenderer.on('item:add', (event, data) => {
    // Create list item
    const li = document.createElement('li');
    const itemText = document.createTextNode(data);
    li.appendChild(itemText);

    // Set list/list item classes
    li.className = 'collection-item';
    ul.className = 'collection';

    // Add item to list
    ul.appendChild(li);
});

// Clear all items from list
ipcRenderer.on('item:clear', () => {
    ul.innerHTML = '';
    ul.className = '';
});

// Remove item
ul.addEventListener('dblclick', (event) => {
    removeItem(event);
});

function removeItem(event) {
    // Remove li element
    event.target.remove();

    // If no children in list, remove class from list
    if (ul.children.length == 0) {
        ul.className = '';
    }
}