<template>
    <div class="login-wrap">
        <el-form
            label-position="left"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="60px"
            class="demo-ruleForm"
        >
            <el-form-item label="账户" prop="userName">
                <el-input v-model="ruleForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input
                    v-model="ruleForm.password"
                    type="password"
                ></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="loginType">
                <el-radio-group v-model="ruleForm.loginType">
                    <el-radio label="线上品牌商赞助"></el-radio>
                    <el-radio label="线下场地免费"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')"
                    >登录/注册</el-button
                >
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import { ElForm } from "node_modules/element-ui/types/form";
import { Component, Vue, Ref } from "vue-property-decorator";

interface loginInterface {
    userName: string;
    password: string;
    loginType: string;
}

@Component
export default class LogIn extends Vue {
    ruleForm: loginInterface = {
        userName: "",
        password: "",
        loginType: "",
    };
    rules = {
        userName: [
            { required: true, message: "请输入用户名", trigger: "blur" },
            {
                min: 2,
                max: 4,
                message: "长度在 2 到 4 个字符",
                trigger: "blur",
            },
        ],
        password: [
            { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        loginType: [
            {
                type: "string",
                required: true,
                message: "请至少选择一种身份",
                trigger: "change",
            },
        ],
    };

    @Ref("ruleForm") readonly FormRef!: ElForm;
    submitForm() {
        this.FormRef.validate((valid: boolean) => {
            if (valid) {
                console.log("this.ruleForm", this.ruleForm);
                this.$router.push("/index");
            } else {
                console.log("error submit!!");
                return false;
            }
        });
    }

    resetForm() {
        this.FormRef.resetFields();
    }
}
</script>

<style scoped>
.login-wrap {
    margin: auto;
    margin-top: 100px;
    width: 30%;
    background-color: red;
}
</style>
