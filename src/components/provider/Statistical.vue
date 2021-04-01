<template>
    <div class="Statistical">
        <div id="main" style="width: 1500px; height: 400px"></div>
        
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { findSubByProviderHttp } from "@/axios/api";
import moment from "moment";
import * as echarts from "echarts";

let echartsData: Array<any> = [];
@Component
export default class Home extends Vue {
    public $echarts: any;

    option = {
        tooltip: {
            trigger: "axis",
        },
        legend: {
            data: ["总量"],
            left: "right",
        },
        xAxis: {
            type: "category",
            boundaryGap: false,
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
                name: "总量",
                type: "line",
                stack: "总量",
                data: [],
            },
        ],
    };

    created() {
        let arr: any = [];
        findSubByProviderHttp().then((result: any) => {
            for (let i = 0; i < 12; i++) {
                arr.push([]);
            }
            console.log("result  result",result.data)
            result.data.forEach((item: any, index: any) => {
                arr[moment(item.date).format("M") - 1].push(item);
            });
            let temp: any = [];
            arr.forEach((item: any, index: any) => {
                this.option.series[0].data.push(item.length);
            });

            this.$nextTick(() => {
                var chartDom = document.getElementById("main");
                var myChart = this.$echarts.init(chartDom);
                myChart.setOption(this.option);
                console.log("this.echartsData", echartsData);
            });
        });
    }

    mounted() {}
}
</script>
