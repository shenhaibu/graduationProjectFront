<template>
    <div class="menu">
        <!-- 用户 -->
        <el-row
            class="tac"
            v-if="this.$store.state.loginInfo.loginType === '0'"
        >
            <el-col :span="3">
                <el-menu
                    :router="true"
                    default-active="2"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                >
                    <el-menu-item>
                        <i class="el-icon-setting"></i>
                        <span slot="title">用户端</span>
                    </el-menu-item>
                    <el-menu-item index="/user/subscribe">
                        <i class="el-icon-menu"></i>
                        <span slot="title">场地预约</span>
                    </el-menu-item>
                    <el-menu-item index="/user/mySubscribe">
                        <i class="el-icon-document"></i>
                        <span slot="title">我的预约</span>
                    </el-menu-item>
                    <el-menu-item index="/user/userPerson">
                        <i class="el-icon-document"></i>
                        <span slot="title">用户信息</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="21">
                <div class="custom-panel t-c" v-if="noticeArr.length!==0">
                    <el-carousel height="20px" indicator-position="none" direction="vertical" :autoplay="true">
                        <el-carousel-item v-for="(item,index) in noticeArr" :key="item._id">
                            <p>{{item.notice}} </p>
                        </el-carousel-item>
                    </el-carousel>
                </div>
                <router-view class="pad"></router-view>
            </el-col>
        </el-row>

        <!-- 提供者 -->
        <el-row
            class="tac"
            v-if="this.$store.state.loginInfo.loginType === '1'"
        >
            <el-col :span="3">
                <el-menu
                    :router="true"
                    default-active="2"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                >
                    <el-menu-item>
                        <i class="el-icon-setting"></i>
                        <span slot="title">服务商端</span>
                    </el-menu-item>
                    <el-menu-item index="/provider/addStadium">
                        <i class="el-icon-menu"></i>
                        <span slot="title">体育馆场地添加</span>
                    </el-menu-item>
                    <el-menu-item index="/provider/modifyStadium">
                        <i class="el-icon-document"></i>
                        <span slot="title">体育馆场地资源修改</span>
                    </el-menu-item>
                    <el-menu-item index="/provider/myUser">
                        <i class="el-icon-document"></i>
                        <span slot="title">我的用户</span>
                    </el-menu-item>
                    <el-menu-item index="/provider/statistical">
                        <i class="el-icon-document"></i>
                        <span slot="title">统计</span>
                    </el-menu-item>
                    <el-menu-item index="/provider/modifyPerInfor">
                        <i class="el-icon-setting"></i>
                        <span slot="title">个人信息</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="21">
                <router-view class="pad"></router-view>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
import { getNoticeHttp } from "@/axios/api";
import { Component, Vue, Ref } from "vue-property-decorator";

@Component
export default class MenuLeft extends Vue {

    noticeArr = [
        {notice:"上海 体育馆 有折扣",_id:"00"},
        {notice:"南阳 体育馆 场地 有折扣哟",_id:"11"},
        {notice:"北京 体育馆 体育馆 资源  降价了!!!  降价了!!!!  降价了!!!",_id:"11"},
    ]


    handleOpen(key: string, keyPath: string) {
        console.log(key, keyPath);
    }
    handleClose(key: string, keyPath: string) {
        console.log(key, keyPath);
    }
    created(){
        // getNoticeHttp().then((result:any)=>{
        //     console.log("result",result)
        //     this.noticeArr = result.data.filter((item:any)=>item.notice)
        // })
    }
}
</script>

<style>
.el-menu{
    height: 100vh;
}
.pad{
    padding: 20px;
}

 .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .t-c{
      text-align: center;
  }
</style>