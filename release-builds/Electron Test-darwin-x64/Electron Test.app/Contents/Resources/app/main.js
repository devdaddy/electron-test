const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow = null;

app.on('ready', () => {
    createMainWindow();
});

app.on('window-all-closed', () => {
    if ( process.platform !== 'darwin' ) {
        app.quit();
    }
});

function createMainWindow() {
    if (mainWindow === null) {
        mainWindow = new BrowserWindow({});
    }

    // Load html into Window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Build menu from template
    const menu = Menu.buildFromTemplate(template);

    // Insert menu
    Menu.setApplicationMenu(menu);

    menu.items[1].submenu.items[0].enabled = true;

    mainWindow.on('closed', () => {
        menu.items[1].submenu.items[0].enabled = false;
        mainWindow = null;
    });
}

function createNewWindow() {
    if (mainWindow === null) {
        createMainWindow();
    } else {
        createChildWindow();
    }
}

function createChildWindow() {
    let child = new BrowserWindow({
        parent: mainWindow
    });
    
    // Load html into Window
    child.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Garbage Collection
    child.on('closed', () => {
        child = null;
    });
}

function createAddWindow() {
    // Create new window
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Shopping List Item'
    });

    // Load html into Window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Garbage Collection
    addWindow.on('close', () => {
        addWindow = null;
    });
}

// Handle item:add
ipcMain.on('item:add', (event, data) => {
    mainWindow.webContents.send('item:add', data);
    addWindow.close();
});

// Define menu template
const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                accelerator: 'Option+Plus',
                click() {
                    if (mainWindow !== null) {
                        createAddWindow();
                    }
                }
            },
            {
                label: 'Clear Items',
                accelerator: 'Option+-',
                click() {
                    mainWindow.webContents.send('item:clear');
                }
            },
            { type: 'separator' },
            {
                label: 'New Window',
                accelerator: 'Shift+CmdOrCtrl+N',
                click() {
                    createNewWindow();
                }
            },
            { type: 'separator' },
            {
                label: 'Close Window',
                accelerator: 'Shift+CmdOrCtrl+W',
                click() {
                    mainWindow.close();
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'pasteandmatchstyle' },
            { role: 'delete' },
            { role: 'selectall' }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        role: 'window',
        submenu: [
            { role: 'minimize' },
            { role: 'close' }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click() { 
                    require('electron').shell.openExternal('https://electronjs.org');
                }
            }
        ]
    }
];

if (process.platform === 'darwin') {
    template.unshift({
        label: app.getName(),
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services', submenu: [] },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    });

    // Edit menu
    template[2].submenu.push(
        {type: 'separator'},
        {
            label: 'Speech',
            submenu: [
                {role: 'startspeaking'},
                {role: 'stopspeaking'}
            ]
        }
    );

    // Window menu
    template[4].submenu = [
        {role: 'close'},
        {role: 'minimize'},
        {role: 'zoom'},
        {type: 'separator'},
        {role: 'front'}
    ];
}

// Build menu template
const menu = Menu.buildFromTemplate(template);

// Set menu
Menu.setApplicationMenu(menu);