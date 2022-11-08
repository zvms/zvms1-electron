import Axios from "axios"
import storeSaver from "./storeSaver.js";
import isTimeFinished from "../utils/calc.js";
import { permissionTypes } from "../utils/permissions.js";

let { ipcRenderer } = window.require('electron');


export async function checkToken() {
    try {
        let res = await Axios.post("/user/info");
        if (res.data.type != "SUCCESS") {
            throw res.data.message;
        }
    } catch {
        await logout();
    }
}

export async function logout() {
    let res = await this.post("/user/logout");
    setDrawers(permissionTypes.none);
    ipcRenderer.send('flash');
    con.$store.commit("token", undefined);
    con.$store.commit("login", false);
    con.$store.commit("loading", false);
    con.$store.commit("lastSeenVol", []);
    storeSaver.saveState(con);
    con.$router.push("/login").catch(() => { });
    return res;
}

export class Api {
    _id = 1;

    constructor(
        onError,
        beforeRequest,
        afterRequest) {
        this.onError = onError;
        this.beforeRequest = beforeRequest;
        this.afterRequest = afterRequest;
    }
    onError;
    beforeRequest;
    afterRequest;

    async doRequest(func, ...args) {
        let cid = this._id++;
        this.beforeRequest(cid, url);
        let res = await func(...args).catch(
            this.onError
        ).finally(
            this.afterRequest(cid)
        );
        if (res.data.type !== "SUCCESS") {
            this.onError(res.data.message);
        }
        return res;
    }

    post(url, data, config) {
        return this.doRequest(Axios.post, url, data, config);
    }

    get(url, config) {
        return this.doRequest(Axios.get, url, config);
    }

    async fetchClassList() {
        let res = await this.get("/class/list");
        return res.data.class;
    }

    async fetchStudentList(classid) {
        let res = await this.get("/class/stulist/" + classid);

        for (stu in res.data.student) {
            stu.finished = isTimeFinished(stu.id, stu.time) ? "是" : "否";
        }
        return stus;
    }

    async fetchClassVolunter(classid) {
        let url = classid ? "/class/volunteer/" + classid : "/volunteer/list/";
        let res = await this.get(url)
        return res.data.volunteer;
    }

    async fetchAllVolunter() {
        let res = await this.get("/volunteer/list")
        return res.data.volunteer
    }

    async openPictures(callback) {
        ipcRenderer.once("open-picture-recv", (_, data) => {
            callback(data)
        })
        ipcRenderer.send("open-picture")
    }

    async openCSV(callback) {
        ipcRenderer.once("open-csv-recv", (_, data) => {
            callback(data)
        })

        ipcRenderer.send("open-csv")
    }

    async fetchNotices() {
        let res = await this.get("/user/notices");
        return res.data;
    }

    async sendNotice(target, title, deadtime, message) {
        let res = await this.post("/user/sendNotice", {
            target,
            title,
            deadtime,
            message
        })
        return res.data
    }

}

export const fApi = new Api(
    () => {

    },
    () => {
        this.$store.commit("incLoading");
    },
    () => {
        this.$store.commit("decLoading");
    }
)