<template>
    <div class="AddStadium">
        <el-form label-position="right" label-width="90px" :model="addStadium">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="地区">
                        <el-input v-model="addStadium.region"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="详细地址">
                        <el-input v-model="addStadium.address"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="体育馆命名">
                        <el-input v-model="addStadium.stadName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="场地费">
                        <el-input v-model="addStadium.landFee"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            
            <el-form-item label="体育馆资源">
                <div
                    v-for="(item, index) in addStadium.stadResources"
                    :key="index"
                >
                    <el-row style="margin-bottom: 22px">
                        <el-col :span="16">
                            <el-input
                                v-model="item.value"
                                class="custom-input"
                            ></el-input>
                            <span class="resources-number-text">数量</span>
                            <el-input
                                v-model="item.number"
                                class="custom-input"
                            ></el-input>

                            <span class="resources-number-text">单价</span>
                            <el-input
                                v-model="item.perPrice"
                                class="custom-input"
                            ></el-input>

                        </el-col>
                        <el-col :span="8">
                            <el-button @click="addResources(index)"
                                >新增资源</el-button
                            >
                            <el-button @click="removeResources(item.id)"
                                >删除资源</el-button
                            >
                        </el-col>
                    </el-row>
                </div>
            </el-form-item>

            

            <el-form-item>
                <el-button type="primary" @click="submitStadium('ruleForm')"
                    >提交</el-button
                >
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Ref ,Watch , Prop} from "vue-property-decorator";
import { addStadiumHttp, alterStadiumHttp } from "@/axios/api";

interface stadiumInter {
    region: string;
    address: string;
    stadName: string;
    landFee:string
    stadResources: Array<{ id: string; value: string; number: string ,perPrice:string}>;
}

@Component({
    // props: ["detail","changeOuterVisible"],
})
export default class AddStadium extends Vue {
    @Prop() detail!: string;
    @Prop() changeOuterVisible!: (f:boolean)=>{}

    addStadium: stadiumInter = {
        region: "",
        address: "",
        stadName: "",
        landFee:"",
        stadResources: [{ id: "0", value: "", number: "1" ,perPrice:"1"}],
    };

    created() {
        this.onInit()
    }

    @Watch('detail', {immediate: true, deep: true})
    onChangeValue(newVal: string, oldVal: string){
        if(this.detail){
            this.onInit()
            this.addStadium = JSON.parse(this.detail)
        }
    }
    

    onInit(){
        if (this.detail) {
            this.addStadium = JSON.parse(this.detail);
        }
    }

    submitStadium() {
        if (!this.detail) {
            // 添加 体育馆信息
            addStadiumHttp(this.addStadium).then((result: any) => {
                console.log("result", result);
            });
        }
        if (this.detail) {
            // 修改 体育馆信息
            alterStadiumHttp(this.addStadium);
            this.changeOuterVisible(false)
        }
    }

    resetForm() {
        if (this.detail) {
            this.addStadium = JSON.parse(this.detail);
            return;
        }
        this.addStadium = {
            region: "",
            address: "",
            stadName: "",
            landFee:"",
            stadResources: [{ id: "0", value: "", number: "1" , perPrice:"1" }],
        };
    }

    addResources(index: number) {
        let len: number = this.addStadium.stadResources.length;
        console.log("添加资源", index);
        this.addStadium.stadResources.splice(index + 1, 0, {
            id: len + "",
            value: "",
            number: "1",
            perPrice:"1"
        });
    }

    removeResources(index: string) {
        console.log("删除资源", index);
        this.addStadium.stadResources = this.addStadium.stadResources.filter(
            (item, ind) => {
                if (item.id !== index) {
                    return true;
                }
            }
        );
    }
}
</script>

<style scoped>
.AddStadium .custom-input {
    width: 20%;
}
.AddStadium .resources-number-text {
    margin-left: 30px;
    margin-right: 30px;
}
</style>