export const isElectron = false;
export const fakeBackend  = true;

export const baseURL = (!fakeBackend)?"http://172.31.2.3:5000":"http://10.49.25.25:5000"

const fakeIpcRenderer = {
    on() { },
    once() { },
    removeAllListeners() { },
    removeListener() { },
    send() { },
    sendSync() { },
    sendTo() { },
    sendToHost() { },
}

export function getIpcRenderer() {
    if (isElectron) {
        return window.require('electron').ipcRenderer
    } else {
        return fakeIpcRenderer;
    }
}
