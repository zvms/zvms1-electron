import storeSaver from "../../utils/storeSaver.js";
import { permissionTypes } from "../../utils/permissions.js";
import store from "../../utils/store";
import { applyNavItems } from "../../utils/nav.js";
import { getIpcRenderer } from "../../apis";
import Axios from "axios";


export async function logout() {
    let res = await Axios.post("/user/logout");
    applyNavItems(permissionTypes.none, store);
    getIpcRenderer().send('flash');
    store.commit("token", undefined);
    store.commit("login", false);
    store.commit("loading", false);
    store.commit("lastSeenVol", []);
    storeSaver.saveState(store);
    //store.$router.push("/login").catch(() => { });
    return res;
}
