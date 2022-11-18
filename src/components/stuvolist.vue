<template>
  <v-card flat>
    <v-card-title>
      <div class="headline">{{ title }} 义工列表</div>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="mdi-magnify" label="搜索" single-line hide-details></v-text-field>
    </v-card-title>
    <v-card-text>
      <v-data-table fixed-header :headers="headers" :items="volworks" :search="search" :loading="$store.state.isLoading"
        @click:row="rowClick" loading-text="加载中..." no-data-text="没有数据哦" no-results-text="没有结果">
      </v-data-table>
    </v-card-text>
    <v-dialog v-model="dialog" max-width="80%">
      <v-card>
        <volcert :volid="volid" :stuid="stuid" :stuname="stuname" />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialog = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { fApi } from "../dev/mockApis";
import volcert from "./volcert.vue";

export default {
  name: "stuvolist",
  props: ["userid", "title"],
  components: {
    volcert
  },
  data: () => ({
    volworks: undefined,
    dialog: false,
    search: "",
    volid: undefined,
    stuid: undefined,
    stuname: undefined,
    headers: [
      { text: "义工ID", value: "volId", align: "start", sortable: true },
      { text: "义工名称", value: "name" },
      { text: "校内时长（单位：分钟）", value: "inside" },
      { text: "校外时长（单位：分钟）", value: "outside" },
      { text: "大型时长（单位：分钟）", value: "large" },
      { text: "完成状态", value: "status" },
    ],
  }),
  created: function () {
    this.init();
  },
  methods: {
    timeToHint: function (a) {
      let hr = parseInt(a / 60);
      let mi = parseInt(a % 60);
      if (hr != 0)
        if (mi != 0)
          return hr + " 小时 " + mi + " 分钟";
        else
          return hr + " 小时 ";
      else
        return mi + "分钟";
    },
    init: async function () {
      this.volworks = undefined;
      this.stuid = this.userid;
      if (this.userid != 0 && this.userid != undefined) {

        this.volworks = fApi.fetchVolbook(this.userid);
      }
    },
    rowClick: function (item) {
      this.volid = item.volId;
      this.stuid = this.userid;
      this.stuname = this.title;
      this.dialog = true;
    },
  },
  watch: {
    userid: function () {
      this.init();
    },
  },
};
</script>
