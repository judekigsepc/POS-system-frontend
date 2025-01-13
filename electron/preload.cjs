const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Example API
  sayHello: () => console.log('Hello from Electron!'),
});
