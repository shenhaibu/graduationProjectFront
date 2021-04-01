<template>
    <div class="subscribe-detail">
        <el-form :label-position="'left'" label-width="80px" :model="detail">
            <el-form-item label="地区">
                <el-input disabled v-model="detail.region"></el-input>
            </el-form-item>
            <el-form-item label="地址">
                <el-input disabled v-model="detail.address"></el-input>
            </el-form-item>
            <el-form-item label="名称">
                <el-input disabled v-model="detail.stadName"></el-input>
            </el-form-item>
            <el-form-item label="占地费">
                <el-input disabled disabled v-model="detail.landFee"></el-input>
            </el-form-item>
            <el-form-item label="日期">
                <el-input disabled v-model="detail.date"></el-input>
            </el-form-item>
            <el-form-item label="开始时间">
                <el-row>
                    <el-col :span="17">
                        <el-input
                            disabled
                            v-model="detail.beginTime"
                            class="custom-input-time"
                        ></el-input>
                        <span class="resources-number-text">结束</span>
                        <el-input
                            disabled
                            v-model="detail.lastTime"
                            class="custom-input-time"
                        ></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="体育资源">
                <div v-for="(item, index) in detail.stadResources" :key="index">
                    <el-row style="margin-bottom: 22px">
                        <el-col :span="20">
                            <el-input
                                disabled
                                v-model="item.value"
                                class="custom-input"
                            ></el-input>
                            <span class="resources-number-text">数量</span>
                            <el-input
                                type="number"
                                @change="changeResourceNum(item, index)"
                                :max="item.number"
                                :min="1"
                                v-model="item.number"
                                class="custom-input"
                            ></el-input>
                            <span class="resources-number-text">单价</span>
                            <el-input
                                type="number"
                                disabled
                                @change="changeResourceNum(item, index)"
                                :max="item.number"
                                :min="1"
                                v-model="item.perPrice"
                                class="custom-input"
                            ></el-input>
                        </el-col>
                        <el-col :span="4">
                            <el-button @click="removeResources(item, index)"
                                >删除资源</el-button
                            >
                        </el-col>
                    </el-row>
                </div>
            </el-form-item>

            <el-form-item label="总计">
                <el-row style="margin-bottom: 22px">
                    <el-col :span="20">
                        <el-input
                            disabled
                            v-model="allPriceComp"
                            class="custom-input"
                        ></el-input>
                        <span class="resources-number-text">定金</span>
                        <el-input
                            type="number"
                            @change="changePayPrice"
                            :max="allPriceComp"
                            :min="~~(allPriceComp/3)"
                            v-model="TpayPrice"
                            class="custom-input"
                        ></el-input>
                        <span class="resources-number-text">未支付</span>
                        <el-input
                            disabled
                            type="number"
                            :max="allPriceComp - detail.payPrice"
                            :min="0"
                            :value="allPriceComp - detail.payPrice"
                            class="custom-input"
                        ></el-input>
                    </el-col>
                    <el-col :span="4">
                    
                    </el-col>
                </el-row>
            </el-form-item>

            <el-form-item label="支付宝">
                <el-image 
                    style="width: 100px; height: 100px"
                    :src="zfbImg" 
                    :preview-src-list="zfbImgPreview">
                </el-image>
            </el-form-item>
            <el-form-item label="微信">
                <el-image 
                    style="width: 100px; height: 100px"
                    :src="wxImg" 
                    :preview-src-list="wxImgPreview">
                </el-image>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="addSubscribe()"
                    >提交</el-button
                >
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import { Message } from "element-ui";
import { Component, Vue, Watch } from "vue-property-decorator";
import { addSubscribeHttp } from "@/axios/api";

@Component
export default class SubscribeDetail extends Vue {
    TpayPrice = ""
    detail = {
        address: "",
        beginTime: "",
        date: "",
        lasteTime: "",
        providerId: "",
        landFee:"",
        region: "",
        stadName: "",
        stadResources: [],
        payPrice:"",
        unPrice:"",
        allPrice:"",
        booker:this.$store.state.loginInfo.userName
    };

    zfbImg = "http://localhost:3000/images/provider/activity_1617074322351.png"
    zfbImgPreview=[
        "http://localhost:3000/images/provider/activity_1617074322351.png"
    ]
    wxImg = "http://localhost:3000/images/provider/activity_1617074322351.png"
    wxImgPreview = ["http://localhost:3000/images/provider/activity_1617074322351.png"]

    get allPriceComp(){
        let stadPrice=0
        this.detail.stadResources.forEach((item:any)=>{
            stadPrice +=item.number * item.perPrice
        })
        this.detail.allPrice = stadPrice*1 + this.detail.landFee*1
        this.detail.payPrice = ~~((stadPrice*1 + this.detail.landFee*1)/3)
        this.TpayPrice= this.detail.payPrice
        this.detail.unPrice = this.detail.allPrice - this.detail.payPrice
        return this.detail.allPrice
    }

    @Watch("TpayPrice")
    watchTpayPrice(newValue:string){
        this.detail.payPrice = newValue*1
    }

    changePayPrice(value:any){
        this.detail.payPrice = value
        this.detail.unPrice = this.detail.allPrice - this.detail.payPrice
    }

    addSubscribe() {
        addSubscribeHttp(this.detail).then((result:any)=>{
            console.log("result",result)
            this.$router.push({name:"MySubscribe"});
        }).catch((err:any)=>{
            console.log("err",err)
        })
        console.log("this.detail , this.detail", this.detail);
    }

    removeResources(item: any, index: any) {
        this.detail.stadResources = this.detail.stadResources.filter((items: any) => items.id != item.id);
    }

    resetForm() {
       this.init()
    }

    changeResourceNum(item: any, index: any) {
        if (item.number < 0) {
            Message.warning({
                message: "数量不能小于0",
            });
            item.number = 1;
            return;
        }
        if (item.number == 0) {
            Message.warning({
                message: "数量不能等于0,请删除该资源",
            });
            item.number = 1;
            return;
        }
        let routeResources: any = this.$route.params.stadResources;
        if (item.number > routeResources[index].number) {
            Message.warning({
                message: "数量不能超过已有数量",
            });
            item.number = routeResources[index].number;
            return;
        }
    }

    created() {
        console.log("this.$route.params 888",this.$route.params)
        this.init()
        this.allPriceComp
    }
    init(){
        let obj: any = {};
        let {address,beginTime,date,lastTime,loginId,region,stadName,stadResources,_id ,landFee} = this.$route.params;
        obj.address = address;
        obj.beginTime = beginTime.split("_").join(":");
        obj.date = date;
        obj.lastTime = lastTime.split("_").join(":");
        obj.providerId = loginId;
        obj.region = region;
        obj.landFee = landFee;
        obj.stadName = stadName;
        obj.roomId = _id;
        obj.booker=this.$store.state.loginInfo.userName
        obj.stadResources = JSON.parse(JSON.stringify(stadResources));
        this.detail = obj;
    }
}
</script>


<style scoped>
.subscribe-detail .custom-input {
    width: 25%;
}
.subscribe-detail .resources-number-text {
    margin-left: 30px;
    margin-right: 30px;
}
.custom-input-time{
    width: 29.4%;
}
</style>