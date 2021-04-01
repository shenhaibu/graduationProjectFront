<template>
    <div class="Statistical">
        <div id="main" style="width: 1500px; height: 400px"></div>

        <el-upload
          class="avatar-uploader"
          action="http://localhost:3000/provider/activityUpload"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { findSubByProviderHttp } from "@/axios/api";
import moment from "moment";
import * as echarts from "echarts";

let echartsData = [];
@Component
export default class Home extends Vue {
    public $echarts: any;
    imageUrl = ""
    handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      console.log("res, file",res, file)
        // this.imageUrl = URL.createObjectURL(file.raw);
      }

beforeAvatarUpload(){

}
    option = {
        tooltip: {
            trigger: "axis",
        },
        legend: {
            data: ["数量", "联盟广告", "视频广告", "直接访问", "搜索引擎"],
        },
        xAxis: {
            type: "category",
            data: [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月",
            ],
        },
        yAxis: {
            type: "value",
        },
        series: [
            {
                data: [],
                type: "line",
            },
        ],
    };

    created() {
        let arr: any = [];
        findSubByProviderHttp().then((result: any) => {
            for (let i = 0; i < 12; i++) {
                arr.push([]);
            }
            result.data.forEach((item: any, index: any) => {
                arr[moment(item.date).format("M") - 1].push(item);
            });
            let temp: any = [];
            arr.forEach((item, index) => {
                // echartsData[index] = item.length;
                this.option.series[0].data.push(item.length)
            });

            this.$nextTick(() => {
                var chartDom = document.getElementById("main");
                var myChart = this.$echarts.init(chartDom);
                myChart.setOption(this.option);
                // this.option.series[0].data = temp
                console.log("this.echartsData", echartsData);
                // this.option.series[0].data = echartsData;
            });
        });
    }

    mounted() {}
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
