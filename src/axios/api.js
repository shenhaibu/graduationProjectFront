import { Message } from 'element-ui';
let BaseUrl = 'http://localhost:4000/'
let axios = require("axios")
let instance = axios.create({
    baseURL: BaseUrl,
})
instance.interceptors.request.use((config) => {
    config.data = config.data || {}
    if (localStorage.loginId) {
        config.data.loginId = localStorage.loginId
    }
    return config
}, (error) => {
    return Promise.reject(error);
})

instance.interceptors.response.use((response) => {
    if (response.data.success === 1 && response.data.msg) {
        Message({
            type: "success",
            message: response.data.msg,
            duration: 3000
        })
    }
    if (response.data.success === 0 && response.data.msg) {
        Message({
            type: "error",
            message: response.data.msg,
            duration: 3000
        })
    }
    return response.data;
}, (error) => {
    return Promise.reject(error);
});

let registerHttp = (obj) => {
    return instance.post("/provider/register", obj)
}

let loginHttp = (obj) => {
    return instance.post("/provider/login", obj)
}

let getLogInfoHttp = (str) => {
    return instance.post(`provider/logInfo?loginId=${str}`)
}

let addStadiumHttp = (obj) => {
    return instance.post(`provider/addStadium`, obj)
}

let getStadiumHttp = (loginId) => {
    return instance.get(`provider/getStadium?loginId=${loginId}`)
}

let alterStadiumHttp = (obj) => {
    return instance.post(`provider/alterStadium`, obj)
}

let deleteStadiumHttp = (_id) => {
    return instance.delete(`provider/deleteStadium?_id=${_id}`)
}

// 获得 统计 数据
let findSubByProviderHttp = (obj) => {
    return instance.post(`provider/findSubByProvider`, obj)
}


// ==================================================================== users 端
let getAllStadiumHttp = (region, stadName) => {
    return instance.get(`users/getAllStadium?region=${region}&stadName=${stadName}`)
}

let fetchAllStadiumHttp = () => {
    return instance.get(`users/fetchAllStadium`)
}

let addSubscribeHttp = (obj) => {
    return instance.post(`users/addSubscribe`, obj)
}

let findAllSubscribeHttp = () => {
    return instance.post(`users/findSubscribe`)
}

let findSubscribeByUserHttp = (loginId) => {
    return instance.get(`users/findSubscribeByUser?subscriber=${loginId}`)
}

let delSubscribeHttp = (_id) => {
    return instance.post(`users/delSubscribe`, { _id })
}

let findSubscribeByRoomIdHttp = (roomId) => {
    return instance.get(`users/findSubscribeByRoomId?roomId=${roomId}`)
}

let ModifySubDateTimeHttp = (_id, date, beginTime, lastTime) => {
    return instance.post(`users/modifySubscribeByRoomId`, { _id, date, beginTime, lastTime })
}

let getPersonDetailHttp = () => {
    return instance.post(`users/getPersonDetail`)
}

let modifyPersonalInfoHttp = (obj) => {
    return instance.post(`users/modifyPersonalInfo`, obj)
}

let updateRateHttp = (_id, rate) => {
    return instance.post(`users/updateRate`, { _id, rate })
}

let getMyAllUserHttp = () => {
    return instance.post(`users/getMyAllUser`)
}

let updateRemarkAndNoticeHttp = (_id, { remark, notice }) => {
    return instance.post(`users/updateRemarkAndNotice`, { _id, remark, notice })
}

let getNoticeHttp = () => {
    return instance.post(`users/getNotice`)
}



export {
    registerHttp, loginHttp, getLogInfoHttp, addStadiumHttp, getStadiumHttp, alterStadiumHttp, deleteStadiumHttp,
    getAllStadiumHttp, addSubscribeHttp, findAllSubscribeHttp, fetchAllStadiumHttp, findSubscribeByUserHttp,
    delSubscribeHttp, findSubscribeByRoomIdHttp, ModifySubDateTimeHttp, getPersonDetailHttp, modifyPersonalInfoHttp,
    findSubByProviderHttp, BaseUrl, updateRateHttp, getMyAllUserHttp, updateRemarkAndNoticeHttp,
    getNoticeHttp

}