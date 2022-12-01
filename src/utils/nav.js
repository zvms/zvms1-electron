import { permissionTypes } from "./permissions"
import store from "./store";

export const navItems = {
    me: {
        title: "我的",
        to: "/me",
        icon: "mdi-account-circle"
    },
    modifyPwd: {
        title: "修改密码",
        to: "/modifyPwd",
        icon: "mdi-lock"
    },
    classList: {
        title: "班级列表",
        to: "/class/list",
        icon: "mdi-view-list",
    },
    stuList: {
        title: "学生列表",
        to: "/class/stulist/" + response.data.class,
        icon: "mdi-format-list-bulleted-square",
    },
    volList: {
        title: "义工列表",
        to: "/volunteer/list",
        icon: "mdi-format-list-text",
    },
    notice: {
        title: "创建通知",
        to: "/notice",
        icon: "mdi-message-draw",
    },
    createVol: {
        title: "创建义工",
        to: "/volunteer/create",
        icon: "mdi-folder-multiple-plus",
    },
    auditVol: {
        title: "审核感想",
        to: "/volunteer/audit",
        icon: "mdi-check-circle",
    },
    holidayVol: {
        title: "义工自提交",
        to: "/volunteer/holiday",
        icon: "mdi-cloud-upload",
    },
    uploadThought: {
        title: "感想提交",
        to: "/volunteer/thought",
        icon: "mdi-upload",
    },
    report: {
        title: "反馈错误",
        to: "/report",
        icon: "mdi-alert",
    },
    about: {
        title: "关于我们",
        to: "/about",
        icon: "mdi-help-circle",
    },
    logout: {
        title: "登出",
        to: "/logout",
        icon: "mdi-exit-to-app",
    }
}
export function getNavItems(permission) {
    let items = [];
    items.push(navItems.me);
    items.push(navItems.modifyPwd);
    if (permission >= permissionTypes.teacher) {
        items.push(navItems.classList);
    }
    if (permission >= permissionTypes.secretary) {
        items.push(navItems.stuList);
    }
    items.push(navItems.volList);
    if (permission >= permissionTypes.teacher) {
        items.push(navItems.notice);
    }
    if (permission >= permissionTypes.teacher) {
        items.push(navItems.createVol);
    }
    if (permission > permissionTypes.teacher) {
        items.push(navItems.auditVol);
    }
    if (permission == permissionTypes.secretary) {
        items.push(navItems.holidayVol, navItems.uploadThought);
    }
    items.push(navItems.report);
    items.push(navItems.about);
    items.push(navItems.logout);
    return items;
}

export function applyNavItems(permission){
    return store.commit("draweritems", getNavItems(permission));
}