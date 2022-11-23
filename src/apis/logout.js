import storeSaver from "../utils/storeSaver.js";
import store from "../utils/store";
import { applyNavItems } from "../utils/nav.js";
import { getIpcRenderer } from "../apis";
import Axios from "axios";
import dialogs from "../utils/dialogs";
import router from "../utils/router.js";


export async function logout() {
    try {
        try {
            let res = await Axios.post("/user/logout");
            if (res?.data?.type !== "SUCCESS") {
                throw new Error(res?.data?.message);
            }
            dialogs.toasts.success(res.data.message);
        } catch (e) {
            dialogs.toasts.error(e.message);
            throw e;
        }

        store.commit("token", undefined);
        store.commit("info", {});
        store.commit("lastSeenVol", []);
        storeSaver.saveState(store);
        applyNavItems(store);
        router.push("/login");
        getIpcRenderer().send('flash');
    } catch {
        return false;
    }
    return true;
}