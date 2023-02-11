<template>
    <v-container>
        <v-card>
            <v-card-title>激活账户</v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="stuId"
                    :rules="rules"
                    label="学生ID"
                    type="number"
                    prepend-icon="mdi-account-circle"
                />
                <v-text-field
                    v-model="code"
                    :rules="rules"
                    label="激活码"
                    type="text"
                    prepend-icon="mdi-lock"
                />
                <v-btn
                    text
                    color="primary"
                    @click="activateAccount()"
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
import { NOTEMPTY } from "../utils/validation"

export default {
    name: "activateAccount",
    data: () => ({
        rules: [NOTEMPTY],
        stuId: undefined,
        code: undefined
    }),
    methods: {
        activateAccount: function() {
            axios.post(`/student/activate/${this.stuId}`, {
                code: this.code
            })
            .then((response) => {
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
            this.$store.commit("loading", false);
            });
        }
    }
}
</script>