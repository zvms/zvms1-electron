import storeSaver from "../../utils/storeSaver.js";
import { permissionTypes } from "../../utils/permissions.js";
import store from "../../utils/store";
import { applyNavItems } from "../../utils/nav.js";
import { getIpcRenderer } from "../../dev";
import Axios from "axios";

let ipcRenderer = getIpcRenderer();

export async function logout() {
    let res = await Axios.post("/user/logout");
    applyNavItems(permissionTypes.none, store);
    ipcRenderer.send('flash');
    store.commit("token", undefined);
    store.commit("login", false);
    store.commit("loading", false);
    store.commit("lastSeenVol", []);
    storeSaver.saveState(store);
    //store.$router.push("/login").catch(() => { });
    return res;
}
