<template>
    <div class="slide-table">
        <span class="label-width">日期:</span><el-date-picker
            v-model="selectedDate"
            @change = "changeDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
        </el-date-picker>

        <el-table :data="filterTableData" style="width: 100%">
            <el-table-column fixed prop="stadName" label="名称" width="150"></el-table-column>

            <el-table-column prop="name" align="center" :label="item.time_HH" :key="`R${JSON.stringify(item)}_${index}`" v-for="(item, index) in tableTime">
                <el-table-column align="center" label="00" time="item+'_00'" width="60" data-TimeHour="00">
                    <template slot-scope="scope">
                        <div
                            id="`R${scope.row._id}T${item.time_00}`"
                            :class="['custom-height',{forbid:time00}]"
                            @mousedown="addColor(scope.row,scope.column,$event,'R'+scope.row._id+'T'+item.time_00 , item.time_00)"
                            @mouseover="addColor(scope.row,scope.column,$event,'R'+scope.row._id+'T'+item.time_00)" :id="'R'+scope.row._id+'T'+item.time_00"
                            @mouseup="addColor(scope.row,scope.column,$event,'R'+scope.row._id+'T'+item.time_00 , '',item.time_00)"
                            @mouseleave="addColor(scope.row,scope.column,$event,'R'+scope.row._id+'T'+item.time_00 , '',item.time_00)"
                        >
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="15" time="item+'_00'" width="60" data-TimeHour="00">
                    <template slot-scope="scope">
                        <div 
                            id="`R${scope.row._id}T${item.time_15}`"
                            class="custom-height"
                            @mousedown="addColor(scope.row,scope.column,$event,'R'+scope.row._id+'T'+item.time_15 , item.time_15)"
                            @mouseover="addColor(scope.row,scope.column,$event,'R'+scope.row._id+'T'+item.time_15)" :id="'R'+scope.row._id+'T'+item.time_15" 
                            @mouseup="addColor(scope.row,scope.column,$event,'R'+scope.row._id+'T'+item.time_15 , '',item.time_15)"    
                            @mouseleave="addColor(scope.row,scope.column,$event,'R'+scope.row._id+'T'+item.time_15 , '',item.time_15)"    
                        >
                            
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="30" time="item+'_00'" width="60" data-TimeHour="00">
                    <template slot-scope="scope">
                        <div
                            id="`R${scope.row._id}T${item.time_30}`"
                            class="custom-height"
                            @mousedown="addColor(scope.row,scope.column,$event,'R'+scope.row._id+'T'+item.time_30 , item.time_30)"
                            @mouseover="addColor(scope.row,scope.column,$event,'R'+scope.row._id+'T'+item.time_30)" :id="'R'+scope.row._id+'T'+item.time_30" 
                            @mouseup="addColor(scope.row,scope.column,$event,'R'+scope.row._id+'T'+item.time_30 , '',item.time_30)"    
                            @mouseleave="addColor(scope.row,scope.column,$event,'R'+scope.row._id+'T'+item.time_30 , '',item.time_30)"    
                        >
                            
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="45" time="item+'_00'" width="60" data-TimeHour="00">
                    <template slot-scope="scope">
                        <div
                            id="`R${scope.row._id}T${item.time_45}`"
                            class="custom-height"
                            @mousedown="addColor(scope.row,scope.column,$event,'R'+scope.row._id+'T'+item.time_45 , item.time_45)"
                            @mouseover="addColor(scope.row,scope.column,$event,'R'+scope.row._id+'T'+item.time_45)" :id="'R'+scope.row._id+'T'+item.time_45" 
                            @mouseup="addColor(scope.row,scope.column,$event,'R'+scope.row._id+'T'+item.time_45 , '',item.time_45)"    
                            @mouseleave="addColor(scope.row,scope.column,$event,'R'+scope.row._id+'T'+item.time_45 , '',item.time_45)"    
                        >
                        </div>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>

        <div class="detail-box" ref="showMsg">
            <ul>
                <li>体育馆名称：{{showBoxMsg.stadName}}</li>
                <li>预订人：{{showBoxMsg.booker}}</li>
                <li>预定时间：{{showBoxMsg.fullDate}}</li>
                <li>详细地址：{{showBoxMsg.address}}</li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import moment from 'moment';
import { Message } from 'element-ui';
import { Component, Vue ,Prop ,Watch ,Inject,Ref} from "vue-property-decorator";
import { getAllStadiumHttp, findAllSubscribeHttp} from "@/axios/api"

@Component({
    computed:{
        time00(){
            // console.log("this.selectedDate aaaa",this.selectedDate)
            // if(moment(new Date).diff(localStorage.date)>0){
            //     return true
            // }
            return false
        }
    }
})
export default class SlideTab extends Vue {
    @Inject() readonly reload!: any;
    @Ref("showMsg") readonly showDetail!: HTMLDivElement

    isforbid = true
    now = moment(new Date())

    tableData = [];
    filterTableData:Array<any> = []

    irrealizable = []
    selectedDate = localStorage.date || moment(new Date()).format("YYYY-MM-DD")
    gray:any = []
    grayArrayId = []
    showBoxMsg = []

    STime:Array<string> = []
    ETime:Array<string> = []
    acrossCellId:Array<string> = []
    acrossRow = ""
    
    tableTime: Array<string> = [];

    changeDate(value:string){
        this.selectedDate = value
        localStorage.date = value
        this.addGray()
        this.onInit(localStorage.region|| "-1",localStorage.stadName || '')
        if(this.gray.length == 0){
            return
        }
        this.reload()
    }

    @Prop(String) stadiumName !: "";
    @Prop(String) selectedBtn !: "";

    @Watch("stadiumName")
    changeStadName(newVal: string, oldVal: string){
        localStorage.stadName=this.stadiumName
        this.onInit(localStorage.region || "-1",localStorage.stadName || '')
    }

    @Watch("selectedBtn")
    selectedRegion(){
        this.onInit(localStorage.region || "-1",localStorage.stadName || '')
        this.addGray()
        if(this.gray.length == 0){  // 不用画 禁选时间段 则不用刷新界面
            return
        }
        this.reload()
    }

    subDetailInfo(){
        console.log("显示 detail")
    }

    addColor(row:any, column:any, event:any,id:any,startTime?:any,endTime?:any){
        if(event.type == "mouseover"){
            this.showBoxMsg=this.gray.filter((item:any)=>item.grayId == id)
            if(this.showBoxMsg.length == 0){
                this.showDetail.style.display="none"
            }else{
                let obj:any = this.showBoxMsg[0]
                let temp:any = {}
                temp.address = obj.address
                temp.fullDate = `${obj.date} ${obj.beginTime} 至 ${obj.date} ${obj.lastTime}`
                temp.booker = obj.booker
                temp.stadName = obj.stadName
                this.showBoxMsg = temp
                this.showDetail.style.display="block"
                this.showDetail.style.top=event.y+30+"px"
                this.showDetail.style.left=event.x-100+"px"
            }
        }
        if(event.type =="mouseleave"){
            this.showDetail.style.display="none"
            return
        }

        if(event.type =="mousedown" || event.type =="mouseup"){
            if(this.grayArrayId.includes(id)){
                this.acrossCellId.push(id)
                Message.warning({
                    message:"不能选择已有时间",
                    duration:0.1,
                })
                return
            }
        }
        
        
        if(event.type === "mousedown"){
            this.acrossRow = row._id
        }
        if(this.acrossRow !== row._id){
            return
        }
        if(startTime){
            this.STime.push(startTime)
        }

        if(moment(this.selectedDate+' '+this.STime[0].split("_").join(":")).diff(new Date,"days")<1){
            Message.warning({
                message:"请提前一天预订"
            })
            this.reload()
            return
        }
        
        if(this.STime.length !== 1){
            return
        }
        if(endTime && event.type =="mouseup"){
            this.ETime.push(endTime)
        }
        console.log("acrossCellId",this.acrossCellId)
        let dom = document.getElementById(id) as any
        dom.parentNode.style.background="green"
        if(this.acrossCellId.includes(id) && (event.type !== "mouseup")){
            let temp = document.getElementById(this.acrossCellId[this.acrossCellId.length - 1]) as any
            temp.parentNode.style.background=""
        }
        if(this.acrossCellId[0] === id){
            Message.warning({
                message:"结束时间必须大于开始时间"
            })
            this.reload()
        }

        
        for(let i = 0;i<this.acrossCellId.length;i++){
            if(this.grayArrayId.includes(this.acrossCellId[i])){
                console.log("占有时间")
                Message.warning({
                    message:"不能划入已占有时间"
                })
                this.reload()
                return
            }
        }

        if(this.STime.length === 1 && this.ETime.length === 1&&this.STime[0] !==this.ETime[0] && (event.type == "mouseup")){
            this.$router.push({name:"SubscribeDetail",
            params:{date:this.selectedDate,beginTime:this.STime[0],lastTime:this.ETime[0],...row}})
        }
       
        
        this.acrossCellId.push(id)
        dom.parentNode.parentNode.style.borderRight="0px"
    }

    created() {
        console.log("created")
        let result = [];
        for (let i = 0; i < 24; i++) {
            let time = {} as any;
            let HH = (i + "").padStart(2, "0");
            time.time_HH = HH;
            time.time_00 = `${HH}_00`;
            time.time_15 = `${HH}_15`;
            time.time_30 = `${HH}_30`;
            time.time_45 = `${HH}_45`;
            result.push(time);
        }
        this.tableTime = result;
        this.onInit(localStorage.region || "-1",localStorage.stadName || '')
        this.addGray()
    }

    onInit(region:string,stadName:string){
        getAllStadiumHttp(region,stadName).then((res:any)=>{
            if(!region){
                this.tableData = res.data
            }
            this.filterTableData = res.data
        })
    }

    addGray(){
        // 查找当天已预约的
            findAllSubscribeHttp().then((res:any)=>{
                this.irrealizable = res.data.filter((item:any,index:any)=>{
                    if(localStorage.region != -1){
                        return item.region ==this.selectedBtn && item.date == this.selectedDate
                    }else{
                        return item.date == this.selectedDate
                    }
                })
                console.log("res.data  res.data",res.data)
            }).then(()=>{
                // 先 清空划线的
                this.gray.forEach((item:any,index:number) => {
                    let dom:any = document.getElementById(item.grayId)
                        if(dom){
                            dom.parentNode.style.background="" // gray
                            dom.parentNode.parentNode.style.borderRight="1px"
                            console.log("清空")
                        }
                });
                // 
                let temp:any = []
                this.irrealizable.forEach((item:any)=>{
                    let start = item.beginTime.split("_").join(":")
                    let end = item.lastTime.split("_").join(":")
                    while(moment(`${item.date} ${start}`).diff(`${item.date} ${end}`)!=0){
                        start = moment(`${item.date} ${start}`).format("HH:mm")
                        let aaStart = start.split(":").join("_")
                        let idStart = `R${item.roomId}T${aaStart}`
                        this.grayArrayId.push(idStart)
                        temp.push({grayId:idStart,lastTime:item.lastTime,
                        beginTime:item.beginTime,date:item.date,
                        address:item.address,stadName:item.stadName,booker:item.booker})
                        start=moment(`${item.date} ${start}`).add(15,"minutes").format("HH:mm")
                        let bbEnd = start.split(":").join("_")
                        let idEnd = `R${item.roomId}T${bbEnd}`
                        this.grayArrayId.push(idEnd)
                        temp.push({grayId:idEnd,lastTime:item.lastTime,
                        beginTime:item.beginTime,date:item.date,
                        address:item.address,stadName:item.stadName,booker:item.booker})
                    }
                })
                console.log("temp ,temp",temp)
                this.grayArrayId = [...new Set(this.grayArrayId)]
                console.log("this.grayArrayId",this.grayArrayId)
                this.gray = temp
                this.gray.forEach((item:any,index:number) => {
                    let dom:any = document.getElementById(item.grayId)
                        if(dom){
                            dom.parentNode.style.background="#545c64" // gray
                            dom.parentNode.style.cursor="not-allowed" 
                            dom.parentNode.parentNode.style.borderRight="0px"
                        }
                });
            })
    }
}
</script>

<style>
.time{
    background-color: red !important;
}

.slide-table .custom-height{
    height: 46px;
}
.label-width{
    display: inline-block;
    width: 100px;
    text-align: right;
    margin-right: 20px;
    margin-bottom: 20px;
}
.custom-p-r{
    position: relative;
}
.custom-p-a{
    position: absolute;
}
.detail-box{
    display: none;
    position: fixed;
    width: 500px;
    height: 100px;
    background-color: #f5f7fa;
    color: #909399;
    list-style: none;
}
ul li{
    list-style: none !important;
}
.el-table .cell{
    padding-left: 0;
    padding-right: 0;
}
.forbid{
    background-color: red !important;
}
</style>