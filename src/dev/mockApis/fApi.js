import { isTimeFinished } from "../../utils/calc.js";
import dialogs from "../../utils/dialogs";
import store from "../../utils/store";
import { getIpcRenderer } from "../../dev";
import Axios from "axios";

let ipcRenderer = getIpcRenderer();

export class ForegroundApi {
    _id = 1;

    constructor(
        requestError,
        notSuccess,
        beforeRequest,
        afterRequest) {
        this.requestError = requestError;
        this.notSuccess = notSuccess;
        this.beforeRequest = beforeRequest;
        this.afterRequest = afterRequest;
    }
    requestError;
    notSuccess;
    beforeRequest;
    afterRequest;

    async doRequest(func, ...args) {
        let cid = this._id++;
        this.beforeRequest(cid, ...args);
        let res = await func(...args).catch(
            (e) => this.requestError(e, func, ...args)
        ).finally(
            this.afterRequest(cid, ...args)
        );
        if (res.data.type !== "SUCCESS") {
            this.notSuccess(res);
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
        //let res = await this.get("/class/list");
        return [{ "id": 202001, "name": "高一1班" },
        { "id": 202011, "name": "蛟一1班" },
        { "id": 202002, "name": "高一2班" },
        { "id": 201901, "name": "高二1班" },
        { "id": 201801, "name": "高三1班" }];
    }

    async fetchStudentList() {
        let student = [
            { "id": 20200101, "name": "王可", "inside": 1.5, "outside": 2, "large": 8 },
            { "id": 20200102, "name": "王不可", "inside": 2.5, "outside": 2, "large": 8 },
            { "id": 20200103, "name": "王可以", "inside": 5, "outside": 8, "large": 0 },
            { "id": 20200104, "name": "王不行", "inside": 1, "outside": 4, "large": 16 },
            { "id": 20200105, "name": "王彳亍", "inside": 5, "outside": 0, "large": 8 }
        ]

        for (let stu in student) {
            stu.finished = isTimeFinished(stu.id, stu.time) ? "是" : "否";
        }

        return student;
    }

    async fetchClassVolunter(classid) {
        let volunteer = classid ? [
            {"id": 1, "name": "义工活动1", "date": "2020.10.1", "time": "13:00", "description": "...", "status": 1, "stuMax": 20},
            {"id": 2, "name": "义工活动2", "date": "2020.10.2", "time": "13:00", "description": "...", "status": 1, "stuMax": 2},
            {"id": 3, "name": "义工活动3", "date": "2020.10.3", "time": "13:00", "description": "...", "status": 0, "stuMax": 5},
            {"id": 4, "name": "义工活动4", "date": "2020.10.4", "time": "13:00", "description": "...", "status": 2, "stuMax": 10}
        ]: [
            {"id": 1, "name": "义工活动1", "description": "...", "date": "2020.10.1", "time": "13:00", "status": 1, "stuMax": 20},
            {"id": 2, "name": "义工活动2", "description": "...", "date": "2020.10.2", "time": "13:00", "status": 1, "stuMax": 2},
            {"id": 3, "name": "义工活动3", "description": "...", "date": "2020.10.3", "time": "13:00", "status": 0, "stuMax": 5},
            {"id": 4, "name": "义工活动4", "description": "...", "date": "2020.10.4", "time": "13:00", "status": 2, "stuMax": 10}
        ];

        return volunteer;
    }

    async fetchAllVolunter() {
        //let res = await this.get("/volunteer/list")
        return [
            { "id": 1, "name": "义工活动1", "description": "...", "date": "2020.10.1", "time": "13:00", "status": 1, "stuMax": 20 },
            { "id": 2, "name": "义工活动2", "description": "...", "date": "2020.10.2", "time": "13:00", "status": 1, "stuMax": 2 },
            { "id": 3, "name": "义工活动3", "description": "...", "date": "2020.10.3", "time": "13:00", "status": 0, "stuMax": 5 },
            { "id": 4, "name": "义工活动4", "description": "...", "date": "2020.10.4", "time": "13:00", "status": 2, "stuMax": 10 }
        ]
    }

    async fetchOneVolunteer() {
        //let res = await this.get("/volunteer/fetch/" + id)
        return {
            "type": "SUCCESS",
            "message": "获取成功",
            "name": "义工活动1",
            "date": "2020.10.1",
            "time": "13:00",
            "stuMax": 20,
            "stuNow": 18,
            "description": "...",
            "status": 1,
            "inside": 0,
            "outside": 3,
            "large": 0
        };
    }

    async fetchUnauditedVolunteers() {
        return [
            { "volId": 1, "stuId": 20200101, "thought": "xxxx" },
            { "volId": 3, "stuId": 20200102, "thought": "xxxx" }
        ];
    }

    async fetchSignerList() {
        //let res = await this.get("/volunteer/signerList/" + volid,)
        return [
            { "stuId": 20200101, "stuName": "王彳亍" },
            { "stuId": 20200102, "stuName": "王不可" },
            { "stuId": 20200103, "stuName": "王可" }
        ];
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
        //let res = await this.get("/user/notices");
        return [];
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

    async sendReport(msg) {
        let res = await this.post("/report", {
            report: msg
        })
        return res.data;
    }

    async volcert(volid, stuid) {
        let res = await this.post("/student/volcert/", {
            volId: volid,
            stuId: stuid
        });
        return res.data
    }

    async login() {
        // let res = await this.post("/user/login", {
        //     "userid": userid,
        //     "password": passwdMD5,
        //     "version": version
        // })
        return {
            "type": "SUCCESS",
            "message": "登陆成功",
            "username": "Admin",
            "class": 202001,
            "permission": 10,
            "token": "xxxx"
        };
    }

    async modifyPwd(oldMD5, newMD5) {
        let res = await this.post("/user/modPwd", {
            "oldPwd": oldMD5,
            "newPwd": newMD5
        });
        return res.data;
    }

    async audit(volid, stuid, status, inside, outside, large) {
        let res = await this.post("/volunteer/audit/" + volid, {
            "thought": [{
                "stuId": stuid,
                "status": status,
                "inside": inside,
                "outside": outside,
                "large": large
            }]
        })
        return res.data;
    }

    async createVol(
        name,
        date,
        time,
        stuMax,
        description,
        inside,
        outside,
        large, classSelected) {
        let res = await this.post("/volunteer/create", {
            name,
            date,
            time,
            stuMax: parseInt(stuMax),
            description,
            inside: parseInt(inside),
            outside: parseInt(outside),
            large: parseInt(large),
            class: classSelected,
        })
        return res.data;
    }
}

export const fApi = new ForegroundApi(
    (e, _func, ...args) => {
        dialogs.toasts.error(`"${e}" (URL: "${args[0]}")`);
        // console.error(
        //     `Error on request. Args ${args.join(",")}`, e
        // )
        throw new Error(e)
    },
    (res) => {
        dialogs.toasts.error(res.data.message);
    },
    () => {
        store.commit("incLoading");
    },
    () => {
        store.commit("decLoading");
    }
)