import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getNavItems } from './nav';
import { permissionTypes } from './permissions';

Vue.use(Vuex);

export default new Vuex.Store({
    //用于保存状态的store
    state: {
        notices: undefined,
        isLogined: false,
        isLoading: 0,
        token: undefined,
        info: {
            username: undefined,
            permission: undefined,
            class: undefined,
            classname: undefined
        },
        lastSeenVol: undefined,
        draweritems: getNavItems(permissionTypes.none)
    },

    //传值操作
    mutations: {
        incLoading: (state) => {
            state.isLoading++;
        },
        decLoading: (state) => {
            state.isLoading--;
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