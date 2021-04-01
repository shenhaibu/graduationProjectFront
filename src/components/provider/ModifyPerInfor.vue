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
            <el-form-item label="支付宝收款码">
                <el-upload
                    :disabled="ZFBdisabled"
                    :on-remove="removezhifubao"
                    :limit="1"
                    class="avatar-uploader"
                    :action="BaseUrl+'provider/activityUpload'"
                    :on-success="handleZFBSuccess"
                    :before-upload="beforeZFBUpload">
                    <img v-if="zhifubaoImage" @click="changeZFBdisabled" :src="zhifubaoImage" class="avatar">
                    <i @click="changeZFBdisabled" v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="微信收款码">
                <el-upload
                    :on-remove="removeWx"
                    :limit="1"
                    :disabled="WXdisabled"
                    class="avatar-uploader"
                    :action="BaseUrl+'provider/activityUpload'"
                    :on-success="handleWXSuccess"
                    :before-upload="beforeWXUpload">
                    <img v-if="wxImage" @click="changeWXdisabled" :src="wxImage" class="avatar">
                    <i v-else @click="changeWXdisabled" class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
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
import { getPersonDetailHttp ,modifyPersonalInfoHttp , BaseUrl} from "@/axios/api";
import { Message } from 'element-ui';

@Component
export default class UserPerson extends Vue {
    detailPerson:any=[]
    BaseUrl=BaseUrl
    zhifubaoImage=""
    wxImage = ""
    ZFBdisabled = true
    WXdisabled = true

    modifyPerson = {
        userName:"",
        pwd:"",
        newPwd:"",
        tel:"",
        zhifubaoImage:"",
        wxImage:""
    }

    changeZFBdisabled(){
        if(this.detailPerson.pwd ==this.modifyPerson.pwd){
            this.ZFBdisabled = false
        }else{
            Message.error({
                message:"请正确输入原密码"
            })
        }
    }

    changeWXdisabled(){
        if(this.detailPerson.pwd ==this.modifyPerson.pwd){
            this.WXdisabled = false
        }else{
            Message.error({
                message:"请正确输入原密码"
            })
        }
    }

    handleZFBSuccess(res:any, file:any) {
        this.zhifubaoImage = URL.createObjectURL(file.raw)
        console.log("res  res 上传成功", res)
        this.modifyPerson.zhifubaoImage= res.data
    }

    handleWXSuccess(res:any, file:any) {
        this.wxImage = URL.createObjectURL(file.raw);
        this.modifyPerson.wxImage= res.data
    }

    removezhifubao(){
        this.zhifubaoImage=""
    }

    removeWx(){
        this.wxImage=""
    }

    beforeZFBUpload(){
    }
    beforeWXUpload(){
    }

    submitPerson(){
        if(this.modifyPerson.pwd !== this.detailPerson.pwd){
            Message.error({
                message:"原密码不正确，请输入原密码"
            })
            return
        }
        if(this.modifyPerson.newPwd.trim().length<6){
            Message.error({
                message:"新密码至少6位"
            })
            return
        }
        this.modifyPerson.pwd = this.modifyPerson.newPwd
        modifyPersonalInfoHttp(this.modifyPerson)
        this.onInit()
        this.resetPerson()
    }

    logout(){
        localStorage.clear()
        this.$router.push({name:"LogIn"})
    }

    resetPerson(){
        this.onInit()
    }

    created(){
        this.onInit()
    }
    onInit(){
        getPersonDetailHttp().then((result:any)=>{
            this.detailPerson = result.data[0]
            console.log("this.detailPerson",result,this.detailPerson)
            this.modifyPerson.userName= this.detailPerson.userName
            this.modifyPerson.tel= this.detailPerson.tel
            console.log("`${this.BaseUrl}`+this.detailPerson.wxImage",`${this.BaseUrl}`+this.detailPerson.wxImage)
            let wx = this.detailPerson.wxImage
            if(wx){
                this.wxImage = `${this.BaseUrl}`+wx
            }else{
                this.wxImage = ""
            }
            let zfb = this.detailPerson.zhifubaoImage
            if(zfb){
                this.zhifubaoImage = `${this.BaseUrl}`+zfb
            }else{
                this.zhifubaoImage = ""
            }
            this.modifyPerson.wxImage= `${this.BaseUrl}`+this.detailPerson.wxImage
            this.modifyPerson.zhifubaoImage= this.detailPerson.zhifubaoImage
        })
    }
    
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>