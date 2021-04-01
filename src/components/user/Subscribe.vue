<template>
    <div class="Subscribe">
        <div>
            <span class="label-width">地区:</span>
            <el-button
                :class="{ bg_color: active + '' == -1 }"
                @click="selectedRegion('', -1)"
                >全部</el-button
            >
            <el-button
                :class="{ bg_color: active + '' == index }"
                v-for="(item, index) in sourceTableData"
                @click="selectedRegion(item, index)"
                >{{ item.region }}</el-button
            >
        </div>
        <span class="label-width">体育馆名称:</span>
        <el-input
            :style="{ width: '220px' }"
            placeholder="请输入体育馆名称"
            v-model="stadiumName"
            clearable
        >
        </el-input>

        <SlideTab
            :stadiumName="stadiumName"
            :selectedBtn="selectedBtn"
        ></SlideTab>
    </div>
</template>

<script lang="ts">
import SlideTab from "./SlideTab";

import { Component, Vue, Watch } from "vue-property-decorator";

import { fetchAllStadiumHttp ,getAllStadiumHttp} from "@/axios/api";

@Component({
    components: {
        SlideTab,
    },
})
export default class Subscribe extends Vue {
    sourceTableData = [];
    selectedBtn = localStorage.region || "-1";
    stadiumName = localStorage.stadName || "";
    active = localStorage.regionIndex || -1;

    selectedRegion(item: any, index: any) {
        this.active = index;
        localStorage.regionIndex = index;
        if (item) {
            this.selectedBtn = item.region;
            localStorage.region = item.region;
        } else {
            this.selectedBtn = "-1";
            localStorage.region = "-1";
        }
    }

    created() {
        this.init();
    }
    init() {
        fetchAllStadiumHttp().then((res: any) => {
            this.sourceTableData = res.data;
        });
    }
}
</script>

<style>
.bg_color {
    background-color: #f4f4f5;
    color: black;
}
.el-button:focus,
.el-button:hover {
    color: black;
    background-color: #f4f4f5;
    border-color: #f4f4f5;
}
</style>