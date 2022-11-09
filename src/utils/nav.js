import { permissionTypes } from "./permissions"
import store from "./store";

const navItems = {
    get me() {
        return {
            title: "我的",
            to: "/me",
            icon: "mdi-account-circle"
        }
    },
    get modifyPwd() {
        return {
            title: "修改密码",
            to: "/modifyPwd",
            icon: "mdi-lock"
        }
    },
    get classList() {
        return {
            title: "班级列表",
            to: "/class/list",
            icon: "mdi-view-list",
        }
    },
    get stuList() {
        return {
            title: "学生列表",
            to: "/class/stulist/" + store.info.class,
            icon: "mdi-format-list-bulleted-square",
        }
    },
    get volList() {
        return {
            title: "义工列表",
            to: "/volunteer/list",
            icon: "mdi-format-list-text",
        }
    },
    get notice() {
        return {
            title: "创建通知",
            to: "/notice",
            icon: "mdi-message-draw",
        }
    },
    get createVol() {
        return {
            title: "创建义工",
            to: "/volunteer/create",
            icon: "mdi-folder-multiple-plus",
        }
    },
    get auditVol() {
        return {
            title: "审核感想",
            to: "/volunteer/audit",
            icon: "mdi-check-circle",
        }
    },
    get holidayVol() {
        return {
            title: "义工自提交",
            to: "/volunteer/holiday",
            icon: "mdi-cloud-upload",
        }
    },
    get uploadThought() {
        return {
            title: "感想提交",
            to: "/volunteer/thought",
            icon: "mdi-upload",
        }
    },
    get report() {
        return {
            title: "反馈错误",
            to: "/report",
            icon: "mdi-alert",
        }
    },
    get about() {
        return {
            title: "关于我们",
            to: "/about",
            icon: "mdi-help-circle",
        }
    },
    get logout() {
        return {
            title: "登出",
            to: "/logout",
            icon: "mdi-exit-to-app",
        }
    }
};

export { navItems };

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
    if (permission >= permissionTypes.teacher
        && permission != permissionTypes.admin) {
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

export function applyNavItems(permission) {
    return store.commit("draweritems", getNavItems(permission));
}