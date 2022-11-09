<template>
  <v-card>
    <v-card-title>
      <!-- 别问我为什么520而不是500px，问就是防止用户看到完整的item就以为不能滚动 -->
      <v-menu :disabled="menudisabled" rounded max-height="520px">
        <template v-slot:activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn depressed v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                <div class="headline">{{ nowclassname }}</div>
              </v-btn>
              <div class="headline">学生列表</div>
            </template>
            <span>{{ tipText }}</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in classes" :key="index" v-on:click="changeclass(item)">
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="mdi-magnify" label="搜索" single-line hide-details></v-text-field>
    </v-card-title>
    <v-card-text>
      <v-data-table fixed-header :headers="headers" :items="students" :search="search" :loading="$store.state.isLoading"
        @click:row="rowClick" loading-text="加载中..." no-data-text="没有数据哦" no-results-text="没有结果"></v-data-table>
      <v-dialog v-model="dialog" max-width="80%">
        <v-card>
          <stuvolist :userid="rowUserId" :title="rowUserName" />
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialog = false">关闭</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script>
import { permissionTypes } from "../../utils/permissions.js";
import stuvolist from "../../components/stuvolist";
import { fApi, checkToken } from "../../apis";

export default {
  data: () => ({
    students: undefined,
    search: "",
    classes: undefined,
    nowclass: undefined,
    nowclassname: undefined,
    menudisabled: true,
    dialog: false,
    rowUserId: 0,
    rowUserName: undefined,
    tipText: "班级",
    headers: [
      { text: "学号", value: "id", align: "start" },
      { text: "姓名", value: "name" },
      { text: "校内", value: "inside", sortable: false },
      { text: "校外", value: "outside", sortable: false },
      { text: "大型", value: "large", sortable: false },
      { text: "完成", value: "finished" },
    ],
  }),
  components: {
    stuvolist,
  },
  mounted: function () {
    this.pageload();
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
    async pageload() {
      this.$store.commit("loading", true);
      await checkToken(this);
      this.classes = await fApi.fetchClassList();
      this.nowclass = this.$store.state.info.class;
      this.nowclassname = this.$store.state.info.classname;

      if (this.$store.state.info.permission > permissionTypes.secretary) {
        this.menudisabled = false;
        this.tipText = "点击选择班级";
        if (this.$route.params != undefined) {
          this.nowclass = this.$route.params.classid;
          this.nowclassname = this.classid2name(this.nowclass);
        }
      }
      if (
        this.$store.state.info.permission > permissionTypes.secretary &&
        this.$route.params.classid <= 200000
      )
        this.nowclassname = "点击选择班级";
      else this.fetchstulist();

    },

    fetchstulist: async function () {
      this.students = undefined;
      let stus = await fApi.fetchStudentList(this.nowclass)
      stus ? (this.students = stus) : (this.students = undefined);

      for (let i in this.students) {
        this.students[i].inside = this.timeToHint(this.students[i].inside);
        this.students[i].outside = this.timeToHint(this.students[i].outside);
        this.students[i].large = this.timeToHint(this.students[i].large);
      }
    },

    classid2name: function (classid) {
      for (var i = 0; i < this.classes.length; i++)
        if (this.classes[i]["id"] == classid) return this.classes[i]["name"];
    },

    rowClick: function (item) {
      this.dialog = true;
      this.rowUserId = item.id;
      this.rowUserName = item.name;
    },

    changeclass: function (item) {
      this.nowclass = item.id;
      this.nowclassname = item.name;
      this.fetchstulist();
    },
  },
};
</script>

<style>

</style>