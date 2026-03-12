const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Add any IPC calls or APIs you want to expose to the renderer process here
});
