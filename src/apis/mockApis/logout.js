import storeSaver from "../../utils/storeSaver.js";
import store from "../../utils/store";
import { applyNavItems } from "../../utils/nav.js";
import { getIpcRenderer } from "../../apis";
import dialogs from "../../utils/dialogs";
import router from "../../utils/router.js";

export async function logout() {
    getIpcRenderer().send('flash');
    let res = {
        data: {
            "type": "SUCCESS",
            "message": "登出成功"
        }
    }
    dialogs.toasts.success(res.data.message);
    store.commit("token", undefined);
    store.commit("info", {});
    store.commit("lastSeenVol", []);
    storeSaver.saveState(store);

    router.push("/login");

    applyNavItems(store);
    getIpcRenderer().send('endflash');
    return res;
}
