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

            <el-row>
                <el-form-item label="是否启用">
                    <el-radio-group v-model="addStadium.isStart">
                        <el-radio :label=1>启用</el-radio>
                        <el-radio :label=0>不启用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="主图">
                        <el-upload
                            class="custom-hidden-class"
                            :action="BaseUrl + 'provider/activityUpload'"
                            :on-success="uploadMainImgSuccess"
                            list-type="picture-card"
                            :on-remove="handleRemoveMainImage">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                </el-col>
            </el-row>       

            <el-form-item label="体育馆资源">
                <div v-for="(item, index) in addStadium.stadResources" :key="item.id">
                    <el-row style="margin-bottom: 22px">
                        <el-col :span="18">
                            <el-input
                                v-model="item.value"
                                class="custom-input"
                            ></el-input>
                            <span class="resources-number-text">数量</span>
                            <el-input
                                v-model="item.number"
                                class="custom-number-input"
                            ></el-input>

                            <span class="resources-number-text">单价</span>
                            <el-input
                                v-model="item.perPrice"
                                class="custom-number-input"
                            ></el-input>
                            <span class="resources-number-text">描述</span>
                            <el-input
                                v-model="item.resourcesDec"
                                class="custom-desc-input"
                            ></el-input>
                        </el-col>

                        <el-upload
                            multiple
                            class="upload-demo"
                            :action="BaseUrl + 'provider/activityUpload'"
                            :limit="3"
                            :on-preview="handlePreview"
                            :on-remove="(file, fileList)=>handleRemove(file, fileList,item)"
                            :on-success="(response, file, fileList) =>uploadResourceImgSuccess(response,file,fileList,item)"
                            :file-list="addStadium.resourceImg"
                            list-type="picture"
                        >
                            <el-button type="primary">上传图片</el-button>
                            <el-button @click.stop="addResources(index)">新增资源</el-button
                            >
                            <el-button @click.stop="removeResources(item.id)"
                                >删除资源</el-button
                            >
                        </el-upload>
                    </el-row>
                </div>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitStadium('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import { Message } from 'element-ui';
import { Component, Vue, Ref, Watch, Prop ,} from "vue-property-decorator";
import { addStadiumHttp, alterStadiumHttp, BaseUrl } from "@/axios/api";

interface stadiumInter {
    region: string;
    address: string;
    stadName: string;
    landFee: string;
    isStart:number;
    mainImage:Array<any>;
    stadResources: Array<{
        id: string;
        value: string;
        number: string;
        perPrice: string;
        resourcesDec:string,
        resourceImg: Array<{ name: string; url: string }>;
    }>;
}

@Component({
    // props: ["detail","changeOuterVisible"],
})
export default class AddStadium extends Vue {
    @Prop() detail!: string;
    @Prop() changeOuterVisible!: (f: boolean) => {};

    BaseUrl = BaseUrl;

    fileList = [];

    disabled = false

    addStadium: stadiumInter = {
        region: "",
        address: "",
        stadName: "",
        landFee: "",
        mainImage:[],
        isStart:1,
        stadResources: [
            {
                id: new Date().getTime()+"",
                value: "",
                number: "1",
                perPrice: "1",
                resourcesDec:"",
                resourceImg: [],
            },
        ],
    };

    created() {
        this.onInit();
    }

    uploadMainImgSuccess(response:any, file:any, fileList:any){
        let temp:any = []
        fileList.forEach((it:any) => {
            temp.push(it.response)
        });
        this.addStadium.mainImage = temp
        if(temp.length>=3){
            let dom = document.querySelector(".custom-hidden-class .el-upload") as any
            dom.style.display = "none"
        }else{
            let dom = document.querySelector(".custom-hidden-class .el-upload") as any
            dom.style.display = "inline-block"
        }
    }
    handleRemoveMainImage(file: any, fileList: any){
        let temp:any = []
        fileList.forEach((it:any) => {
            temp.push(it.response)
        });
        this.addStadium.mainImage = temp
    }

    uploadResourceImgSuccess(response:any, file:any, fileList:any, item:any) {
        let imgObj = this.addStadium.stadResources.filter((it,ind)=>it.id == item.id)[0]
        let tempArray:any = []
        fileList.forEach((it:any,ind:any) => {
            tempArray[ind]=it.response
        });
        imgObj.resourceImg = tempArray
    }
    handleRemove(file: any, fileList: any,item:any) {
        let imgObj = this.addStadium.stadResources.filter((it,ind)=>it.id == item.id)[0]
        let tempArray:any = []
        fileList.forEach((it:any,ind:any) => {
            tempArray[ind]=it.response
        });
        imgObj.resourceImg = tempArray
    }
    handlePreview(file: any) {
        console.log(file);
    }

    @Watch("detail", { immediate: true, deep: true })
    onChangeValue(newVal: string, oldVal: string) {
        if (this.detail) {
            this.onInit();
            this.addStadium = JSON.parse(this.detail);
        }
    }

    onInit() {
        if (this.detail) {
            this.addStadium = JSON.parse(this.detail);
        }
    }

    submitStadium() {
        if (!this.detail) {
            // 添加 体育馆信息
            console.log("添加 体育馆信息 this.addStadium", this.addStadium);
            addStadiumHttp(this.addStadium).then((result: any) => {
                console.log("addStadiumHttp result", result);
            });
        }
        // if (this.detail) {
        //     // 修改 体育馆信息
        //     alterStadiumHttp(this.addStadium);
        //     this.changeOuterVisible(false)
        // }
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
            isStart:1,
            mainImage:[],
            landFee: "",
            stadResources: [
                {
                    id: new Date().getTime()+"",
                    value: "",
                    number: "1",
                    resourcesDec:"",
                    perPrice: "1",
                    resourceImg: [],
                },
            ],
        };
        let dom = document.querySelector(".custom-hidden-class .el-upload-list--picture-card") as any
        dom.style.display="none"
    }

    addResources(index: number) {
        console.log("添加资源", index);
        let len: number = this.addStadium.stadResources.length;
        this.addStadium.stadResources.splice(index + 1, 0, {
            id: new Date().getTime()+"",
            value: "",
            number: "1",
            perPrice: "1",
            resourcesDec:"",
            resourceImg: [],
        });
    }

    removeResources(id:string) {
        console.log("删除资源", id);
        this.addStadium.stadResources = this.addStadium.stadResources.filter(
            (item, ind) => item.id !== id
        );
    }
}
</script>

<style>
.AddStadium .custom-input {
    width: 25%;
}
.AddStadium .resources-number-text {
    margin-left: 30px;
    margin-right: 30px;
}
.AddStadium .el-upload-list.el-upload-list--picture {
    margin-top: 22px;
    display: flex;
}
.AddStadium .el-upload-list.el-upload-list--picture li:not(:first-child) {
    color: red;
    margin-left: 20px;
}
.AddStadium .el-upload-list--picture.el-upload-list__item {
    margin-top: 0;
}
.AddStadium .el-upload-list__item:first-child {
    margin-top: 0;
}
.AddStadium .el-upload-list__item {
    margin-top: 0;
}
.AddStadium .upload-btn {
    margin-left: 10px;
}
.AddStadium .custom-number-input{
    width:12%;
}
.AddStadium .custom-desc-input{
    width:25%;
}
</style>