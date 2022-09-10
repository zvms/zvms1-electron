import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
    //用于保存状态的store
    state: {
        notices: undefined,
        isLogined: false,
        isLoading: false,
        token: undefined,
        info: {
            username: undefined,
            permission: undefined,
            class: undefined,
            classname: undefined
        },
        lastSeenVol: undefined,
        draweritems: [
            { title: '登录', to: '/login', icon: 'mdi-account-circle' },
            { title: "反馈错误", to: "/report", icon: "mdi-alert" }
            // {
            //     "title": "我的",
            //     "to": "/me",
            //     "icon": "mdi-account-circle"
            // },
            // {
            //     "title": "修改密码",
            //     "to": "/modifyPwd",
            //     "icon": "mdi-account-circle"
            // },
            // {
            //     "title": "学生列表",
            //     "to": "/class/stulist/202007",
            //     "icon": "mdi-view-list"
            // },
            // {
            //     "title": "义工列表",
            //     "to": "/volunteer/list",
            //     "icon": "mdi-view-list"
            // },
            // {
            //     "title": "假期义工",
            //     "to": "/volunteer/holiday",
            //     "icon": "mdi-view-list"
            // },
            // {
            //     "title": "感想提交",
            //     "to": "/volunteer/thought",
            //     "icon": "mdi-view-list"
            // },
            // {
            //     "title": "登出",
            //     "to": "/logout",
            //     "icon": "mdi-exit-to-app"
            // },
            // {
            //     "title": "反馈错误",
            //     "to": "/report",
            //     "icon": "mdi-alert"
            // }
        ]
    },

    //传值操作
    mutations: {
        loading: (state, payload) => {
            state.isLoading = payload
        },
        info: (state, payload) => {
            state.info = payload
        },
        login: (state, payload) => {
            state.isLogined = payload
        },
        draweritems: (state, payload) => {
            state.draweritems = payload
        },
        token: (state, payload) => {
            state.token = payload
        },
        lastSeenVol: (state, payload) => {
            state.lastSeenVol = payload
        },
        notices: (state, payload) => {
            state.notices = payload
        }
    },
    plugins: [createPersistedState()]
});