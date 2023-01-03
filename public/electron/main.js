const { app, BrowserWindow, ipcMain} = require("electron");
const isDev = require('electron-is-dev');
const path = require("path");

const loadMainWindow = () => {
  const mainWindow = new BrowserWindow({
    width : 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false // to make ipcRenderer available
    }
  });

  // mainWindow.loadFile(path.join(__dirname, "index.html"));
  const url  = isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../index.html')}`;

  mainWindow.loadURL(url).catch((error) => {
    if (error.code === 'ERR_ABORTED') return;
    console.error(`Error loading URL:${url} ${error}`);

    mainWindow.loadURL(`file://${path.join(__dirname, './error.html')}`);
  });;

}

app.on("ready", loadMainWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    loadMainWindow();
  }
});

ipcMain.on('tally:command:vouchers:add', (event, {targetCompany, vouchers, bank}) => {
  console.log(JSON.stringify(vouchers, null, 2));
});