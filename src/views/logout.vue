<template>
  <v-card>
    <v-card-title>正在登出...</v-card-title>
  </v-card>
</template>

<script>
import { fApi } from "../apis";

export default {
  name: "logout",
  mounted: function () {
    this.logout();
  },
  methods: {
    async logout() {
      await fApi.logout();
    },
  },
};
</script>>