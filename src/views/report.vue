<template>
  <v-container>
    <v-card>
      <v-card-title>反馈错误</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="report"
          :rules="rules"
          label="问题的描述"
          type="text"
          prepend-icon="mdi-alert"
        />
        <v-btn
          text
          color="primary"
          @click="submitReport()"
        >
          提交
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import dialogs from "../utils/dialogs";
import axios from "axios";
import { NOTEMPTY } from "../utils/validation";

export default {
  name: "report",
  data: () => ({
    report: undefined,
    rules: [NOTEMPTY]
  }),
  mounted: function () {
    this.pageload();
  },
  methods: {
    pageload: function(){
    },
    submitReport: function(){
      this.$store.commit("incLoading");
      console.log(this.report)
      axios
        .post("/report",{
          "report": this.report
        })
        .then((response) => {
          console.log(response.data);
          if (response.data.type == "SUCCESS") {
            dialogs.toasts.success(response.data.message);
          } else if (response.data.type == "ERROR") {
            dialogs.toasts.error(response.data.message);
          } else {
            dialogs.toasts.error("未知错误");
          }
        })
        .catch((err) => {
          dialogs.toasts.error(err);
        })
        .finally(() => {
          this.$store.commit("decLoading");
        });
    }
  },
};
</script>