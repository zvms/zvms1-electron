import storeSaver from "../utils/storeSaver.js";
import { isTimeFinished } from "../utils/calc.js";
import { permissionTypes } from "../utils/permissions.js";
import store from "../utils/store";
import { applyNavItems } from "../utils/nav.js";
import { getIpcRenderer, baseURL } from "../dev";
import Axios from "axios";

let ipcRenderer = getIpcRenderer();

Axios.defaults.baseURL = baseURL;
//Axios携带cookie
Axios.defaults.withCredentials = true;
//post设定，自动序列化表单的json数据
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//如果要把表单数据转化为url格式就去掉注释
// Axios.defaults.transformRequest = [function (data){
//     data = qs.stringify(data);
//     return data;
// }]
Axios.interceptors.request.use(
    config => {
        config.params = {
            ...config.params,
            timestamp: Date.now()
        };
        config.headers.Authorization = store.state.token || '';
        return config
    },
    error => Promise.reject(error)
);


export async function checkToken(/*unknown_arg x1 */) {
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
    applyNavItems(permissionTypes.none);
    ipcRenderer.send('flash');
    store.commit("token", undefined);
    store.commit("login", false);
    store.commit("loading", false);
    store.commit("lastSeenVol", []);
    storeSaver.saveState(store);
    //store.$router.push("/login").catch(() => { });
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
        this.beforeRequest(cid, ...args);
        let res = await func(...args).catch(
            this.onError
        ).finally(
            this.afterRequest(cid, ...args)
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

        for (let stu in res.data.student) {
            stu.finished = isTimeFinished(stu.id, stu.time) ? "是" : "否";
        }
        return res.data.student;
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

    async fetchOneVolunteer(id) {
        let res = await this.get("/volunteer/fetch/" + id)
        return res.data;
    }

    async fetchUnauditedVolunteers() {
        let res = await this.get("/volunteer/unaudited")
        return res.data;
    }

    async fetchSignerList(volid) {
        let res = await this.get("/volunteer/signerList/" + volid,)
        return res.data.result;
    }

    async fetchVolbook(id) {
        let res = await this.get("/student/volbook/" + id)

        //     if (response.data.message != "该学生没有义工记录")
        //       dialogs.toasts.error(response.data.message);
        //   } TODO

        let volworks = res.data.rec.map(v => ({
            inside: this.timeToHint(v.inside),
            outside: this.timeToHint(v.outside),
            large: this.timeToHint(v.large),
        }));
        return volworks;
    }

    async fetchNothoughtList(cls) {
        let res = await this.get("/class/noThought/" + cls)
        return res.data.result;
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

    async sendReport(msg){
msg;
    }
}

export const fApi = new Api(
    () => {
        //dialogs.toasts.error(response.data.message);
    },
    () => {
        store.commit("incLoading");
    },
    () => {
        store.commit("decLoading");
    }
)