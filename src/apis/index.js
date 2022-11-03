import Axios from "axios"
import storeSaver from "./storeSaver.js";
import isTimeFinished from "../utils/calc.js";

let { ipcRenderer } = window.require('electron');

export async function checkToken(con) {
    let res = Axios.post("/user/info")
    if (res.data.type != "SUCCESS") {
        await logout();
    }
}

export async function logout() {
    let res = await Axios.post("/user/logout");
    con.$store.commit("draweritems", [
        { title: '登录', to: '/login', icon: 'mdi-account-circle' },
        { title: "反馈错误", to: "/report", icon: "mdi-alert" },
        { title: "关于我们", to: "/about", icon: "mdi-help-circle" },
    ]);
    ipcRenderer.send('flash');
    con.$store.commit("token", undefined);
    con.$store.commit("login", false);
    con.$store.commit("loading", false);
    con.$store.commit("lastSeenVol", []);
    storeSaver.saveState(con);
    con.$router.push("/login").catch(() => { });
    return res;
}

export async function fetchClassList(callback) {
    let res = await Axios.get("/class/list");
    return res.data.class;
}

export async function fetchStudentList(classid, callback) {
    let res = await Axios.get("/class/stulist/" + classid);

    for (stu in res.data.student) {
        stu.finished = isTimeFinished(stu.id, stu.time) ? "是" : "否";
    }
    callback(stus)
}

export async function fetchClassVolunter(classid, callback) {
    let url = classid ? "/class/volunteer/" + classid : "/volunteer/list/";
    let res = await Axios.get(url)
    callback(res.data.volunteer);
}

export async function fetchAllVolunter(callback) {
    let res = await Axios.get("/volunteer/list")
    callback(res.data.volunteer);
}

export async function openPictures(callback) {
    ipcRenderer.once("open-picture-recv", (_, data) => {
        callback(data)
    })
    ipcRenderer.send("open-picture")
}

export async function openCSV(callback) {
    ipcRenderer.once("open-csv-recv", (_, data) => {
        callback(data)
    })

    ipcRenderer.send("open-csv")
}

export async function fetchNotices(callback) {
    callback((await Axios.get("/user/notices").catch((err) => { console.error(err) })).data);
}

export async function sendNotice(target, title, deadtime, message, callback) => {
    let res = await Axios.post("/user/sendNotice", {
        target,
        title,
        deadtime,
        message
    })
    callback(res.data);
}

