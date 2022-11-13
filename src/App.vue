<template style="overflow-y: hidden;" id="win">
  <v-app style="
      background: url(https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fphoto.tuchong.com%2F16667757%2Ff%2F1152125355.jpg&refer=http%3A%2F%2Fphoto.tuchong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1631932457&t=5662d318816fc73507d495f273b42ad5);
      background-size: cover;
      background-attachment: fixed;
      overflow-y: hidden;
    ">
    <v-system-bar app window color="primary" dark style="-webkit-app-region: drag" align-center>
      <!-- <span>{{hitokoto.hitokoto}} - {{hitokoto.from}}·{{hitokoto.from_who}}</span> -->
      <v-spacer></v-spacer>
      <v-icon @click="minwindow" color="white" style="-webkit-app-region: no-drag">mdi-window-minimize</v-icon>
      <v-icon @click="maxwindow" color="white" style="-webkit-app-region: no-drag">mdi-window-maximize</v-icon>
      <v-icon @click="closewindow" color="white" style="-webkit-app-region: no-drag; margin-right: 0">mdi-close</v-icon>
    </v-system-bar>
    <v-navigation-drawer color="primary" expand-on-hover miniVariant app dark permanent
      style="backdrop-filter: blur(10px)">
      <v-list nav dense class="py-0">
        <v-list-item two-line class="px-0">
          <v-list-item-avatar tile>
            <img src="./assets/logo.png" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>义工管理系统</v-list-item-title>
            <v-list-item-subtitle>v1.3.2</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item v-for="item in $store.state.draweritems" :key="item.title" :to="item.to" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-3">
          <v-progress-circular color="white" indeterminate v-show="$store.state.isLoading"></v-progress-circular>
        </div>
        <div class="pa-4">
          <v-icon @click="changeColorTheme" color="white" style="-webkit-app-region: no-drag; margin-right: 0">
            mdi-brightness-6</v-icon>
        </div>
      </template>
    </v-navigation-drawer>
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
::-webkit-scrollbar {
  width: 0px;
  height: 4px;
}

::-webkit-scrollbar-button {
  width: 0px;
  height: 0;
}

#drag {
  padding: 0;
  margin: 0;
}
</style>

<script>
import { fApi, checkToken } from "./apis";
import dialogs from "./utils/dialogs.js";
import { permissionTypes } from "./utils/permissions.js";
import storeSaver from "./utils/storeSaver.js";
import { getIpcRenderer } from "./dev";

let ipcRenderer = getIpcRenderer();

export default {
  name: "App",

  data: () => ({
    activeBtn: 1,
    drawer: true,
    phone: false,
    currentVol: undefined
  }),

  mounted: async function () {
    this.vol = await fApi.fetchAllVolunter();
    this.$store.commit('notices', await fApi.fetchNotices());

    setInterval(this.listen, 60000, this);
  },

  methods: {
    granted: function () {
      return this.$store.state.info.permission < permissionTypes.teacher;
    },

    changeColorTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },

    fetchVol: async function () {
      if (this.granted()) await this.fetchCurrentClassVol();
      else await this.fetchAllVol();
    },

    async fetchCurrentClassVol() {
      this.$store.commit("loading", true);
      let volworks = await fApi.fetchClassVolunter(this.$store.state.info.class);
      volworks
        ? (this.currentVol = volworks)
        : dialogs.toasts.error("获取义工列表失败");

      this.$store.commit("loading", false);
    },

    async fetchAllVol() {
      this.$store.commit("loading", true);
      let volworks = await fApi.fetchAllVolunter();
      volworks
        ? (this.currentVol = volworks)
        : dialogs.toasts.error("获取义工列表失败");

      this.$store.commit("loading", false);
    },

    async listen(t) {
      if (!t.$store.state.isLogined) {
        console.log(t.$store.state);
        console.error("!login");
        ipcRenderer.send('flash');
        return;
      }

      storeSaver.saveState(this);
      await checkToken(t);
      await t.fetchVol();
      t.$store.commit('notices', await fApi.fetchNotices())
      let flag = false;
      let last = t.$store.state.lastSeenVol;
      let vol = t.currentVol;

      if (last != null && last != undefined && vol != null && vol != undefined) {
        if (vol.length != last.length) flag = true;
        else {
          for (var i = 0; i < vol.length; i++)
            if (vol[i]["id"] != last[i]["id"])
              flag = true;
        }
        if (flag) ipcRenderer.send('flash');
      }
    },

    minwindow() {
      ipcRenderer.send('minwindow')
    },

    maxwindow() {
      ipcRenderer.send('maxwindow')
    },

    closewindow() {
      ipcRenderer.send('closewindow')
    },
  },
};
</script>
