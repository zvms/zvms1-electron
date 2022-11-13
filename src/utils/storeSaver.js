// import { applyNavItems } from "./nav";
// import { getIpcRenderer } from "./dev";

// let ipcRenderer = getIpcRenderer();

// const configPath = "./config.json";

export default {
    saveState: async () => {
        // // console.log("SADFdsjfhsdjsdhjfdshjfdshfjhd");
        // ipcRenderer.once('file-write-complete', (event, arg) => {
        //     // console.log(arg);
        //     if (arg.err){
        //         console.error(arg.err);
        //         return undefined;
        //     }
        // })
        // ipcRenderer.send('file-write-req', {
        //     "path": configPath,
        //     "data": JSON.stringify(con.$store.state)
        // });
    },
    
    loadState: async () => {
        // console.log("loadState!!!")
        // ipcRenderer.once('file-read-complete', (event, arg) => {
        //     // console.log(arg);
        //     if (arg.err){
        //         console.error(arg.err);
        //         return undefined;
        //     }
        //     con.$store.commit("token", JSON.parse(arg.data).token);
        //     con.$store.commit("info", JSON.parse(arg.data).info);
        //     con.$store.commit("login", JSON.parse(arg.data).isLogined);
        //     applyNavItems()
        //     con.$store.commit("lastSeenVol", JSON.parse(arg.data).lastSeenVol);
        //     f(con);
        //     // console.log(con.$store);
        //     // console.log(arg.data);
        // })
        // ipcRenderer.send('file-read-req', configPath);
    }
}