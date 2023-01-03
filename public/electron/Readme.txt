mkdir electron-main
cd electron-main
npm init
vi index.html
npm install electron
vi main.js

# Add reference to main.js in package.json file
# Add the start script with contents of "scripts": { "start" : "electron .", ...}
vi package.json

# Now we will add react related changes
npm install electron-is-dev

# Replace following load
  // mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.loadURL(
      isDev
          ? 'http://localhost:3000'
          : `file://${path.join(__dirname, '../index.html')}`
  );


