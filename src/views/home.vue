<template>
  <v-container>
    <v-card>
      <v-card-title>初始化</v-card-title>
      <v-card-text>正在加载...</v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import {checkToken} from "../apis";
export default {
  name: "home",
  mounted: function () {
    this.pageload();
  },
  methods: {
    pageload: async function(){
      await checkToken(this.$store);
      this.$router.push("/me");
    }
  },
};
</script>
