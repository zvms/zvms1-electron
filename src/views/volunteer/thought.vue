<template>
  <v-container>
    <v-card>
      <v-card-title>
        未提交感想列表
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="搜索"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-card-text>
        <v-data-table
          fixed-header
          :headers="headers"
          :items="thoughts"
          :search="search"
          :loading="$store.state.isLoading"
          @click:row="rowClick"
          loading-text="加载中..."
          no-data-text="没有数据哦"
          no-results-text="没有结果"
        >
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog1" max-width="80%">
      <v-card>
        <v-card-title>详细信息</v-card-title>
        <v-simple-table style="margin:20px;">
          <tbody>
            <tr>
              <td>义工编号</td>
              <td>{{volid}}</td>
            </tr>
            <tr>
              <td>义工日期</td>
              <td>{{volDate}}</td>
            </tr>
            <tr>
              <td>义工时间</td>
              <td>{{volTime}}</td>
            </tr>
            <tr>
              <td>义工详细信息</td>
              <td>{{volDesc}}</td>
            </tr>
            <tr>
              <td>校内时长</td>
              <td>{{timeToHint(volTI)}}</td>
            </tr>
            <tr>
              <td>校外时长</td>
              <td>{{timeToHint(volTO)}}</td>
            </tr>
            <tr>
              <td>大型时长</td>
              <td>{{timeToHint(volTL)}}</td>
            </tr>
            <tr>
              <td>学号</td>
              <td>{{stuid}}</td>
            </tr>
            <tr>
              <td>感想</td>
              <td>
                <v-textarea
                  v-model="thought"
                  placeholder=""
                ></v-textarea>
              </td>
            </tr>
            <tr>
              <td>图片</td>
              <td><button @click="uploadPicture">上传图片</button></td>
            </tr>
            <tr v-if="pictures.length != 0">
              <td>已选择图片</td>
              <ul v-for="img in pictures" :key="img.id">
                <td>
                  <li>
                    <img :src="'data:image/png;base64,' + img.src" class="pic">
                  </li>
                </td>
                <td>
                  <v-icon
                    @click="deletePicture(img.id)"
                    color="grey"
                    style="
                      -webkit-app-region: no-drag;
                      margin-right: 0;
                      cursor: pointer;
                      top: -55px;
                      left: 30px;
                    "
                    >mdi-close</v-icon
                  >
                </td>
              </ul>
            </tr>
          </tbody>
        </v-simple-table>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            block
            :disabled="$store.state.isLoading"
            @click="submit"
          >提交
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import dialogs from "../../utils/dialogs.js";
import permissions from "../../utils/permissions";
import axios from "axios";
import zutils from "../../utils/zutils";

export default {
  data: () => ({
    search: "",
    headers: [
      { text: "义工编号", value: "volId", align: "start", sortable: true },
      { text: "学号", value: "stuId" },
    ],
    thoughts: undefined,
    dialog1: false,
    stuid: undefined,
    volid: undefined,
    thought: undefined,
    volTime: undefined,
    volDate: undefined,
    volDesc: undefined,
    volTI: undefined,
    volTO: undefined,
    volTL: undefined,

    pictures: [],
    count: 0,
    opening: false
  }),

  mounted: function () {
    this.pageload();
  },
  
  methods: {
    timeToHint: function (a){
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
      // console.log("111122313")
      this.$store.commit("loading", true);
      await zutils.checkToken(this);

      await axios
        .get("/class/noThought/"+this.$store.state.info.class,{

        })
        .then((response) => {
          // console.log(response.data);
          if (response.data.type == "SUCCESS") {
            dialogs.toasts.success(response.data.message);
            this.thoughts = response.data.result;
          } else {
            dialogs.toasts.error(response.data.message);
          }
        })
        .catch((err) => {
          dialogs.toasts.error(err);
        })
        .finally(() => {
          this.$store.commit("loading", false);
        });
      this.$store.commit("loading", false);
    },

    granted: function () {
      return this.$store.state.info.permission < permissions.teacher;
    },

    rowClick: function (item) {
      this.dialog1 = true;
      this.volid = item.volId;
      this.stuid = item.stuId;
      this.thought = item.thought;
      
      this.$store.commit("loading", true);
      axios
        .get("/volunteer/fetch/"+this.volid,{
      
        })
        .then((response) => {
          // console.log(response.data);
          if (response.data.type == "SUCCESS") {
            dialogs.toasts.success(response.data.message);
            this.volDate = response.data.date;
            this.volTime = response.data.time;
            this.volDesc = response.data.description;
            this.volTI = response.data.inside;
            this.volTO = response.data.outside;
            this.volTL = response.data.large;

            this.pictures = []
          } else {
            dialogs.toasts.error(response.data.message);
          }
        })
        .catch((err) => {
          dialogs.toasts.error(err);
        })
        .finally(() => {
          this.$store.commit("loading", false);
        });
      this.$store.commit("loading", false);
    },

    submit: function () {
      this.dialog1 = false;
      this.$store.commit("loading", true);
      axios
        .post("/volunteer/thought/"+this.volid,{
          "thought": [{
            "stuId": this.stuid,
            "content": this.thought,
            "pictures": this.pictures.map(o => o.src)
          }],
        })
        .then((response) => {
          // console.log(response.data);
          if (response.data.type == "SUCCESS") {
            dialogs.toasts.success(response.data.message);
            location.reload();
          } else {
            dialogs.toasts.error(response.data.message);
          }
        })
        .catch((err) => {
          dialogs.toasts.error(err);
        })
        .finally(() => {
          this.$store.commit("loading", false);
        });
      this.$store.commit("loading", false);
    },

    uploadPicture() {
      if (!this.opening) {
        this.opening = true;
	
	zutils.openPictures((data) => {
          if (data) {
            this.pictures.push({
              id: this.count,
              src: data
            });
            this.count++;
          }

          this.opening = false;
	})
      }
    },

    deletePicture(id) {
      this.pictures = this.pictures.filter(img => img.id != id);
    }}
};
</script>

<style scoped>
.v-card {
  margin: 0.3rem;
}

.pic {
  width: auto;
  height: 120px;
}

</style>
