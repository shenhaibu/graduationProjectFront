<template>
    <div>
        <el-row class="t-r">
            <el-col :span="24">
                <el-button type="primary" @click="exportExcel">导出为Excel</el-button>
            </el-col>
        </el-row>
        <el-table show-summary  :summary-method="getSummaries" :data="sourceDate" style="width: 100%" class="my-custom-table">
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
            <el-table-column label="名称" width="150" align="center">
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

            <el-table-column label="总价" width="150" prop="allPrice" align="center">
                <template slot-scope="scope">
                    <el-tag type="success" effect="dark">
                        {{ scope.row.allPrice || 0 }} 
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column label="已付" width="150" prop="payPrice" align="center">
                <template slot-scope="scope">
                    <el-tag type="success" effect="dark" :type="alreadyPay(scope.row.payPrice,scope.row.allPrice)">
                        {{ scope.row.payPrice || 0 }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column label="待付" width="150" prop="unPrice" align="center">
                <template slot-scope="scope">
                    <el-tag effect="dark" :type="unPayTagType(scope.row.allPrice,scope.row.unPrice)">
                        {{scope.row.unPrice || 0}}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column label="评论" width="180" align="center">
                <template slot-scope="scope">
                    <el-rate disabled v-model="scope.row.rate" show-text>
                    </el-rate>
                </template>
            </el-table-column>

            <el-table-column label="备注" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.remark}}</div>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="action(scope.$index,scope.row)">操作</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
            title="提示"
            @open="openDialogFun"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-form :label-position="'left'" label-width="50px" :model="remarkAndNotice">
                <el-form-item label="备注">
                    <el-input type="textarea" maxlength="60" show-word-limit placeholder="请输入内容" v-model="remarkAndNotice.remark"></el-input>
                </el-form-item>
                <el-form-item label="通知">
                    <el-input type="textarea" maxlength="60" show-word-limit placeholder="请输入内容" v-model="remarkAndNotice.notice"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="clickDialogSure">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

import moment from 'moment';
import { Component, Vue, } from "vue-property-decorator";
import { getMyAllUserHttp , updateRemarkAndNoticeHttp} from "@/axios/api"

@Component
export default class MyUser extends Vue {
    sourceDate = []

    dialogVisible = false

    currentRowId = ""
    currentRowIndex = 0

    remarkAndNotice = {
        remark:"",
        notice:""
    }

    getSummaries(param:any) {
        console.log("param",param)

        const { columns, data } = param;
        const sums = [];
        console.log("sum",sums,columns)
        columns.forEach((column, index) => {
        if (index === 0) {
            sums[index] = '总价';
            return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
                return prev + curr;
            } else {
                return prev;
            }
            }, 0);
            sums[index] += ' 元';
        } else {
            sums[index] = 'N/A';
        }
        });

        return sums;
    }

    alreadyPay(pay:any,allprice:any){
        let halfPrice = ~~(allprice/2)
        if(pay>=~~(allprice/3)) return "warning"
        if(pay>=halfPrice) return "danger"
        if(pay<halfPrice) return ""
        if(pay==0) return "success"
        return ""
    }

    action(index:any,row:any){
        console.log(index,row)
        let {_id} = row
        this.currentRowIndex = index
        this.currentRowId = _id
        this.dialogVisible = true
    }

    openDialogFun(){
        let {remark,notice} = this.sourceDate[this.currentRowIndex]
        this.remarkAndNotice={remark,notice}
    }

    clickDialogSure(){
        console.log("remarkAndNotice",this.remarkAndNotice)
        this.dialogVisible = false
        updateRemarkAndNoticeHttp(this.currentRowId,this.remarkAndNotice)
        this.onInit()
    }

    handleClose(done:any) {
        this.$confirm('确认关闭？')
        .then(_ => {
            done();
        })
        .catch(_ => {});
    }

    unPayTagType(allprice:any,unprice:any){
        let halfPrice = ~~(allprice/2)
        if(unprice>=~~(allprice/3)) return "danger"
        if(unprice>=halfPrice) return "warning"
        if(unprice<halfPrice) return ""
        if(unprice==0) return "success"
        return ""
    }

    exportExcel () {
        let dom = document.getElementsByClassName("my-custom-table")
        console.log("dom",dom)
        /* generate workbook object from table */
        //表名
        var wb = XLSX.utils.table_to_book(dom[0])
        /* get binary string as output */
        var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
        try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'order.xlsx')
        } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
        return wbout
    }

    created(){
        this.onInit()
    }
    onInit(){
        getMyAllUserHttp().then((result:any)=>{
            console.log("result 111",result)
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
.t-r{
    text-align: right;
}
</style>
