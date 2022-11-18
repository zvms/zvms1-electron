<template>
  <v-card id="bgcard" class="d-flex mb-6 align-center justify-center" outlined color="rgba(255, 255, 255, 0)"
    :height="winheight">
    <v-card class="mx-auto" width="50%" max-width="500" min-width="250">
      <v-card-title class="headline primary white--text" style="backdrop-filter: blur(2px)">登录</v-card-title>
      <br />
      <v-card-text>
        <v-form ref="form">
          <v-text-field type="username" v-model="form.userid" :rules="rules" label="用户ID" @keyup.native.enter="login" />
          <v-text-field type="password" v-model="form.password" :rules="rules" label="密码" @keyup.native.enter="login" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block :disabled="$store.state.isLoading" @click="login">登录</v-btn>
      </v-card-actions>
    </v-card>
  </v-card>
</template>

<script>
import { fApi, checkToken } from "../dev/mockApis"
import dialogs from "../utils/dialogs.js"; //弹出toast提示用
import { NOTEMPTY } from "../utils/validation.js"; //校验表单完整性
import { applyNavItems } from "../utils/nav";
import storeSaver from "../utils/storeSaver.js";
import { getIpcRenderer } from "../dev";

let ipcRenderer = getIpcRenderer();

var md5 = require('md5-node');
var current_version = "51141167bd8394d8da590fddaeb3d91e";
// 版本号的加盐的MD5，记得改

export default {
  name: "login",
  data: () => ({
    //储存表单数据
    form: {
      userid: undefined,
      password: undefined,
    },
    rules: [NOTEMPTY()], //表单校验规则
    winheight: document.documentElement.clientHeight - 100, //一个比较失败的自动调整大小
  }),
  mounted: async function () {
    await storeSaver.loadState(this, (t) => {
      t.$router.push("/me");
      checkToken(this);
    });
  },
  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        let data = await fApi.login(this.form.userid, md5(this.form.password), current_version);
        if (data.type == "SUCCESS") {
          ipcRenderer.send('endflash');
          dialogs.toasts.success(data.message);
          //将一切保存到$store
          this.$store.commit('notices', await fApi.fetchNotices());
          this.$store.commit("login", true);
          this.$store.commit("info", {
            username: data.username,
            permission: data.permission,
            class: data.class,
            classname: data.classname,
          });
          //设置token
          this.$store.commit("token", data.token);
          
          //更新抽屉导航栏
          applyNavItems(data.permission,this.$store);

          this.$router.push("/me");
        } else if (data.type == "ERROR") {
          dialogs.toasts.error(data.message);
          this.form.password = undefined;
        } else {
          dialogs.toasts.error("未知错误!");
          this.form.password = undefined;
        }

      }
    },
  },
};
</script>
