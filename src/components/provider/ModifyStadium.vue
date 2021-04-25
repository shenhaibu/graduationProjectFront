<template>
    <div class="ModifyStadium">
        <el-table
            :data="
                sourceData.filter(
                    (data) => !search || data.stadName.includes(search)
                )
            "
            style="width: 100%"
        >
            <el-table-column label="地区" prop="region"> </el-table-column>
            <el-table-column label="详细地址" prop="address"> </el-table-column>
            <el-table-column label="名称" prop="stadName"> </el-table-column>
            <el-table-column align="right">
                <template slot="header" slot-scope="scope">
                    <el-input
                        v-model="search"
                        size="mini"
                        placeholder="输入关键字搜索"
                    />
                </template>
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        @click="detailInfoBtn(scope.$index, scope.row)"
                        >详细信息</el-button
                    >
                    <el-button
                        size="mini"
                        type="danger"
                        @click="deleteStadBtn(scope.$index, scope.row)"
                        >Delete</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="详细信息" :visible.sync="outerVisible">
            <el-dialog
                width="50%"
                title="内层 Dialog"
                :visible.sync="innerVisible"
                append-to-body
            >
            </el-dialog>
            <AddStadium :changeOuterVisible="changeOuterVisible" :detail="sendDetail"></AddStadium>
            <div slot="footer" class="dialog-footer">
                <el-button @click="outerVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lange="ts">
import { Component, Vue, } from "vue-property-decorator";
import { getStadiumHttp, deleteStadiumHttp } from "@/axios/api"
import AddStadium from "./AddStadium"


@Component({
    components: {
        AddStadium
    }
})
export default class ModifyStadium extends Vue {
    sourceData = []

    sendDetail = {}

    outerVisible = false
    innerVisible = false

    search = ''

    detailInfoBtn(index, row) {
        this.outerVisible = true
        console.log("row",row)
        this.sendDetail = JSON.stringify(row)
    }

    changeOuterVisible(flag){
        this.outerVisible = flag
        this.initData()
    }

    deleteStadBtn(index, row) {
        let { _id } = row
        deleteStadiumHttp(_id).then((result) => {
            this.initData()
        }).catch(err => {
            throw new console.error("删除体育馆失败");
        })
        console.log(index, row);
    }

    created() {
        this.initData()
    }

    initData() {
        getStadiumHttp().then(res => {
            this.sourceData = res.data
            console.log("this.sourceDate",this.sourceData)
        })
    }
}
</script>

<style>
.ModifyStadium .el-dialog {
    width: 45% !important;
}
</style>