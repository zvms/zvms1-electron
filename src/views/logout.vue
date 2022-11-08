<template>
  <v-card>
    <v-card-title>正在登出...</v-card-title>
  </v-card>
</template>

<script>
import axios from "axios";
import dialogs from "../utils/dialogs.js";
import { applyNavItems } from "../utils/nav";
import { permissionTypes } from "../utils/permissions";
import storeSaver from "../utils/storeSaver.js";

export default {
  name: "logout",
  mounted: function () {
    this.logout();
  },
  methods: {
    logout() {
      this.$store.commit("loading", true);
      this.$store.commit("login", false);
      this.$store.commit("info", {
        username: undefined,
        permission: undefined,
        class: undefined,
        classname: undefined
      });
      this.$store.commit("token", undefined);
      axios
        .post("/user/logout")
        .then((response) => {
          if (response.data.type == "SUCCESS") {
            dialogs.toasts.success(response.data.message);
          } else if (response.data.type == "ERROR") {
            dialogs.toasts.error(response.data.message);
          }
        })
        .catch((error) => {
          dialogs.toasts.error(error);
        })
        .finally(() => {
          applyNavItems(permissionTypes.none);
          this.$router.push("/login");
          this.$store.commit("loading", false);
          this.$store.commit("login", false);
          this.$store.commit("lastSeenVol", []);
          storeSaver.saveState(this);
        });
        this.$store.commit("loading", false);
    },
  },
};
</script>>