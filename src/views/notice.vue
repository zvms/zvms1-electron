<template>
    <v-card>
        <v-card-title>创建通知</v-card-title>
        <v-card-text>
            <v-form ref="form">
                <v-simple-table>
                    <thead>
                    <td>班级</td>
                    <td></td>
                    </thead>
                    <tbody>
                    <tr
                        v-for="(userId, i) in userSelected"
                        :key = "i"
                    >
                        <td>{{mp[userId]}}</td>
                        <td>
                        <v-btn
                            class="mx-2"
                            fab
                            dark
                            x-small
                            color="primary"
                            @click="delFromList(i)"
                        >
                            <v-icon dark>
                            mdi-minus
                            </v-icon>
                        </v-btn>
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <v-select
                            prepend-icon="mdi-switch"
                            v-model="target_new"
                            label="发送目标"
                            :items="users"
                            item-text="name"
                            item-value="id"
                        >
                        </v-select>
                        </td>
                        <td>
                        <v-btn
                            class="mx-2"
                            fab
                            dark
                            x-small
                            color="primary"
                            @click= "addToList"
                        >
                            <v-icon dark>
                            mdi-plus
                            </v-icon>
                        </v-btn>
                        </td>
                    </tr>
                    </tbody>
                </v-simple-table>
                <v-text-field
                    v-model="form.title"
                    label="标题"
                ></v-text-field>
                <v-textarea
                    v-model="form.message"
                    :auto-grow="true"
                    label="要发送的消息"
                ></v-textarea>
            </v-form>
            <v-card-actions>
                <v-btn
                    color="primary"
                    block
                    :disabled="$store.state.isLoading"
                    @click="send"
                    >发送消息</v-btn
                >
            </v-card-actions>
        </v-card-text>
    </v-card>
</template>

<script>
import dialogs from "../utils/dialogs";
import zutils from "../utils/zutils";
import axios from "axios";

export default {
    data: () => ({
        form: {
            title: "",
            message: ""
        },
        users: undefined,
        target_new: undefined,
        userSelected: [],
        mp: {}
    }),
    mounted: function() {
        this.pageload()
    },
    methods: {
        async pageload() {
            this.$store.commit("loading", true);
            await zutils.checkToken(this);
            await zutils.fetchClassList((users) => {
                users
                ? (this.users = users)
                : dialogs.toasts.error("获取班级列表失败");
            });

            for(const cls of this.users)
                this.mp[cls.id] = cls.name;

            this.$store.commit("loading", false);
        },
        addToList: function () {
            let flg = false;
            if (this.target_new == "") flg = true;
            for (const user of this.userSelected) {
                if (user["id"] == this.target_new){
                    flg = true;
                    break;
                }
            }
            if (!flg)
                this.userSelected.push(this.target_new);
            this.target_new = "";
        },
        delFromList: function(i) {
            this.userSelected.splice(i, 1);
        },
        send: function () {
            axios
                .post("/user/sendNotice", {
                    target: this.userSelected,
                    title: this.form.title,
                    message: this.form.message
                })
                .then((response) => {
                    console.log(response.data);
                    if (response.data.type == "SUCCESS") {
                        dialogs.toasts.success(response.data.message);
                        for(let k in this.form)
                            this.form[k] = undefined
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
        }
    }
}
</script>