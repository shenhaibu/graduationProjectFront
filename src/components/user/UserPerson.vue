<template>
    <div class="user-person">
        <el-form label-position="left" label-width="70px" :model="modifyPerson">
            <el-form-item label="用户名">
                <el-input v-model="modifyPerson.userName"></el-input>
            </el-form-item>
            <el-form-item label="原密码">
                <el-input type="password" v-model="modifyPerson.pwd"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
                <el-input type="password" placeholder="请输入新密码，长度至少为六位" v-model="modifyPerson.newPwd"></el-input>
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="modifyPerson.tel"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitPerson()">提交</el-button>
                <el-button @click="resetPerson()">重置</el-button>
                <el-button @click="logout()">退出登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">

import moment from 'moment';
import { Component, Vue ,Prop ,Watch ,Inject,Ref} from "vue-property-decorator";
import { getPersonDetailHttp ,modifyPersonalInfoHttp} from "@/axios/api";
import { Message } from 'element-ui';

@Component
export default class UserPerson extends Vue {
    detailPerson:any=[]

    modifyPerson = {
        userName:"",
        pwd:"",
        newPwd:"",
        tel:"",
    }

    submitPerson(){
        console.log("提交 修改个人信息")
        if(this.modifyPerson.pwd !== this.detailPerson.pwd){
            Message.error({
                message:"原密码不正确，请输入原密码"
            })
            return
        }
        if(this.modifyPerson.newPwd.trim().length<6){
            Message.error({
                message:"密码至少6位"
            })
            return
        }
        this.modifyPerson.pwd = this.modifyPerson.newPwd
        modifyPersonalInfoHttp(this.modifyPerson)
        this.onInit()
        this.resetPerson()
    }

    resetPerson(){
        this.modifyPerson = {
            userName:"",
            pwd:"",
            newPwd:"",
            tel:"",
        }
    }

    logout(){
        localStorage.clear()
        this.$router.push({name:"LogIn"})
    }

    created(){
        this.onInit()
    }

    onInit(){
        getPersonDetailHttp().then((result:any)=>{
            this.detailPerson = result.data[0]
            console.log("this.detailPerson",result,this.detailPerson)
        })
    }
    
}
</script>
