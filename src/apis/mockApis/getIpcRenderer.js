export class FakeIpcRenderer {
    on() { }
    once() { }
    removeAllListeners() { }
    removeListener() { }
    send() { }
    sendSync() { }
    sendTo() { }
    sendToHost() { }
}
const fakeIpcRenderer = new FakeIpcRenderer();
export function getIpcRenderer() {
    return fakeIpcRenderer;
}