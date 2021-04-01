<template>
    <div class="my-subscribe">
        <el-tabs v-model="activeName" @tab-click="clickTabs">
            <el-tab-pane label="我创建的" name="created">
                <el-table :data="sourceDate" style="width: 100%">
                    <el-table-column label="开始日期" width="200" align="center">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.fullStartDate }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="结束日期" width="200" align="center">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.fullEndDate }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="名称" width="200" align="center">
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.stadName }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="地区" width="100" align="center">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="top">
                                <p>地区: {{ scope.row.region }}</p>
                                <p>详细地址: {{ scope.row.address }}</p>
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="medium">{{ scope.row.region }}</el-tag>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>

                    <el-table-column label="总价" width="150" align="center">
                        <template slot-scope="scope">
                            <el-tag type="success" effect="dark">
                                {{ scope.row.allPrice }}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="已付" width="150" align="center">
                        <template slot-scope="scope">
                            <el-tag type="success" effect="dark" :type="alreadyPay(scope.row.payPrice,scope.row.allPrice)">
                                {{ scope.row.payPrice }}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="待付" width="150" align="center">
                        <template slot-scope="scope">
                            <el-tag effect="dark" :type="unPayTagType(scope.row.allPrice,scope.row.unPrice)">
                                {{scope.row.unPrice}}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="评论" width="200" align="center">
                        <template slot-scope="scope">
                            <el-rate @change="changeRate(scope.$index,$event)" v-model="scope.row.rate" show-text>
                            </el-rate>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-popover
                            :disabled="scope.row.isEdit"
                            placement="top-start"
                            trigger="hover"
                            content="修改预约至少需要提前一天">
                            <el-button slot="reference">
                                <el-button size="mini" :disabled="!scope.row.isEdit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            </el-button>
                        </el-popover>

                        <el-popover
                            :disabled="scope.row.isEdit"
                            placement="top-start"
                            trigger="hover"
                            content="删除预约至少需要提前一天">
                            <el-button slot="reference">
                                <el-button size="mini" :disabled="!scope.row.isEdit" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </el-button>
                        </el-popover>

                        <el-popover
                            placement="top-start"
                            trigger="hover"
                            content="此保存只会更新评分">
                            <el-button slot="reference">
                                <el-button size="mini" type="danger" @click="saveRate(scope.$index, scope.row)">保存</el-button>
                            </el-button>
                        </el-popover>

                    </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="待参加的" name="noAttend">
                <el-table :data="noAttendData" style="width: 100%">
                    <el-table-column label="开始日期" width="200">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.fullStartDate }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="结束日期" width="200">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.fullEndDate }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="名称" width="200">
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.stadName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="地区" width="100">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="top">
                                <p>地区: {{ scope.row.region }}</p>
                                <p>详细地址: {{ scope.row.address }}</p>
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="medium">{{ scope.row.region }}</el-tag>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="已参加的" name="already">
                <el-table :data="alreadyAttendData" style="width: 100%">
                    <el-table-column label="开始日期" width="200">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.fullStartDate }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="结束日期" width="200">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.fullEndDate }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="名称" width="200">
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.stadName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="地区" width="100">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="top">
                                <p>地区: {{ scope.row.region }}</p>
                                <p>详细地址: {{ scope.row.address }}</p>
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="medium">{{ scope.row.region }}</el-tag>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>

        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            开始时间：<el-date-picker @change="changeValue3" v-model="value3" type="datetime" placeholder="选择日期时间" default-time="12:00:00">
            </el-date-picker><br>
            结束时间：<el-date-picker @change="changeValue4" v-model="value4" type="datetime" placeholder="选择日期时间" default-time="12:00:00">
            </el-date-picker>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifyTime">确 定</el-button>
            </span>

        </el-dialog>
    </div>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Vue ,Prop ,Watch ,Inject,Ref} from "vue-property-decorator";
import { findSubscribeByUserHttp ,delSubscribeHttp ,updateRateHttp, findSubscribeByRoomIdHttp , ModifySubDateTimeHttp} from "@/axios/api";
import { Message } from 'element-ui';

@Component({
    computed:{
        fun(){
            // let temp = moment(new Date()).add(1,"hours").format("YYYY-MM-DD HH:mm")
            // moment("2021-03-28 02:00").diff(temp)


            // let temp = moment(value3).subtract(1,"hours").format("YYYY-MM-DD HH:mm")
            // moment(new Date).diff(temp)<=0
        }
    }
})
export default class MySubscribe extends Vue {
    rate = 1
    activeName = 'created'
    sourceDate = []  // 我创建的
    noAttendData = []  // 待参加的
    alreadyAttendData = []
    currRoomSubscribeList = []
    currRoomUseTime = []
    currRecordId = ""
    dialogVisible = false
    value3 = ''
    value4 = ''

    changeRate(index:any , value:any,){
        this.sourceDate[index].rate = value * 1
        this.rate = value

        console.log("changeRate",value,index)
        Message.success({
            message:"请点击保存按钮"
        })
    }

    saveRate(index:any,row:any){
        let {_id} = row
        updateRateHttp(_id,this.rate)
        this.onInit()
    }

    tableData =[{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, 
    ]

    

    unPayTagType(allprice:any,unprice:any){
        let halfPrice = ~~(allprice/2)
        if(unprice>=~~(allprice/3)) return "danger"
        if(unprice>=halfPrice) return "warning"
        if(unprice<halfPrice) return ""
        if(unprice==0) return "success"
        return ""
    }

    alreadyPay(pay:any,allprice:any){
        let halfPrice = ~~(allprice/2)
        if(pay>=~~(allprice/3)) return "warning"
        if(pay>=halfPrice) return "danger"
        if(pay<halfPrice) return ""
        if(pay==0) return "success"
        return ""
    }


    clickTabs(){
        if(this.activeName==="noAttend"){
            this.noAttendData = this.sourceDate.filter((item:any,index)=>{
                return moment(item.fullStartDate).diff(new Date)>0
            })
        }
        if(this.activeName==="already"){
            this.alreadyAttendData= this.sourceDate.filter((item:any,index)=>{
                return moment(item.fullStartDate).diff(new Date)<=0
            })
        }
    }

    changeValue3(value:any){
        this.value3 = value
        if(moment(this.value3).diff(new Date,"days")<1){
            Message.warning({
                message:"请提前一天修改"
            })
        }
    }

    changeValue4(value:any){
        this.value4 = value
        if(moment(this.value4).diff(this.value3)<=0){
            Message.warning({
                message:"结束时间必须大于开始时间"
            })
        }
    }

    modifyTime(){
        if(moment(this.value3).diff(new Date,"days")<1){
            Message.warning({
                message:"请提前一天修改"
            })
            return
        }
        if(moment(this.value4).diff(this.value3)<=0){
            Message.warning({
                message:"结束时间必须大于开始时间"
            })
            return
        }
        for(let i = 0;i<this.currRoomUseTime.length;i++){
            if(moment(this.value3).diff(this.currRoomUseTime[i].fullStartDate)>=0 && 
            moment(this.value4).diff(this.currRoomUseTime[i].fullEndDate)<=0){
                Message.warning({
                    message:"此时间段已被占用"
                })
            return
            }
        }

        // 可预约  发送http请求
        let date = moment(this.value3).format("YYYY-MM-DD")
        let beginTime = moment(this.value3).format("HH:mm")
        let lastTime = moment(this.value4).format("HH:mm")
        ModifySubDateTimeHttp(this.currRecordId,date,beginTime,lastTime).then((result)=>{
            console.log("修改成功")
        })

    }


    handleEdit(index:any, row:any) {
        this.currRecordId = row._id
        this.dialogVisible = true
        console.log(index, row);
        findSubscribeByRoomIdHttp(row.roomId).then((result:any)=>{
            console.log("通过房间ID查询所有预约列表result",result)
            this.currRoomSubscribeList = result.data
            this.currRoomSubscribeList.forEach((item:any,index)=>{
                item.fullStartDate = `${item.date} ${item.beginTime}`
                item.fullEndDate = `${item.date} ${item.lastTime}`
            })
            this.currRoomUseTime = this.currRoomSubscribeList.filter((item:any,index:any)=>{
                return moment(item.fullStartDate).diff(new Date,'days')>=0
            })


        })
    }

    handleDelete(index:any, row:any) {
        delSubscribeHttp(row._id).then(()=>{
            this.onInit()
        })
    }

    handleClose(done:any) {
        this.$confirm('确认关闭？').then(_ => {
            done();
        })
        .catch(_ => {});
    }

    created(){
        this.onInit()
    }
    onInit(){
        let loginId = localStorage.loginId
        findSubscribeByUserHttp(loginId).then((result:any)=>{
            this.sourceDate = result.data
            this.sourceDate.forEach((item:any,index)=>{
                item.fullStartDate = `${item.date} ${item.beginTime}`
                item.fullEndDate = `${item.date} ${item.lastTime}`
                item.isEdit = moment(item.fullStartDate).diff(new Date,'days')>=1
                item.rate = item.rate * 1
            })
            this.sourceDate.sort((a:any,b:any)=>{
                return new Date(b.fullStartDate).getTime() - new Date(a.fullStartDate).getTime()
            })
        })
    }
}
</script>

<style>
.el-popover__reference{
    padding: 0;
}
</style>