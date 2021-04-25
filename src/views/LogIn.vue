<template>
    <div id="login-wrap">
        <div class="logo">
            <img src="login_logo.png" />
        </div>
        <div class="main">
            <div class="login">
                <div class="log-con">
                    <span>登录</span>
                    <el-form :model="loginInfo" :rules="rules" ref="ruleForm">
                        <el-form-item label="" class="formItem" prop="userName">
                            <el-input v-model="loginInfo.userName" type="text" placeholder="请输入用户名"/> 
                        </el-form-item>
                        <el-form-item label="" class="formItem" prop="pwd">
                            <el-input v-model="loginInfo.pwd" type="password" placeholder="请输入密码"/>
                        </el-form-item>
                        <el-form-item label="" class="formItem" prop="tel">
                            <el-input v-model="loginInfo.tel" type="text" placeholder="请输入电话"/>
                        </el-form-item>
                        <el-form-item label="" class="formItem codeFormItem" prop="authCode">
                            <el-input v-model="loginInfo.authCode" type="text" class="code" placeholder="请输入验证码"/>
                            <img id="codeimg" :src="svgImg" alt="点击刷新" @click="changeSvg"/>
                        </el-form-item>
                        <el-form-item class="formItem">
                            <div class="select-identity-wrap">
                                <el-radio class="color-fff" v-model="loginInfo.loginType" label="0">用户0</el-radio>
                                <el-radio class="color-fff" v-model="loginInfo.loginType" label="1">提供者1</el-radio>
                                <el-radio class="color-fff" v-model="loginInfo.loginType" label="3">管理员3</el-radio>
                            </div>
                        </el-form-item>

                        <div class="loginfo-bottom formItem">
                            <el-button @click="loginFun">登录</el-button>
                            <el-button v-if="isShowRegister" @click="registerFun">注册</el-button>
                            <el-button @click="resetFun">重置</el-button>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="copyright">
            <a>版权所有　© 米恩基</a>
        </div>
    </div>
</template>

<script>
import { getCaptchaHttp, validCaptchaHttp, BaseUrl , loginHttp , registerHttp} from "../axios/api"

var SEPARATION = 100, AMOUNTX = 60, AMOUNTY = 40;
var container;
var camera, scene, renderer;
var particles, particle, count = 0;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
//浏览器大小改变时重新渲染
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
//将相机和场景渲染到页面上
function render() {
    var i = 0;
    //更新粒子的位置和大小
    for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
            particle = particles[i++];
            //更新粒子位置
            particle.position.y = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50);
            //更新粒子大小
            particle.scale.x = particle.scale.y = particle.scale.z = ((Math.sin((ix + count) * 0.3) + 1) * 4 + (Math.sin((iy + count) * 0.5) + 1) * 4) * 50;	//正常情况下再放大100倍*1200
        }
    }
    renderer.render(scene, camera);
    count += 0.1;
}
export default {
    data() {
        return {
            isShowRegister:true,
            svgImg: "",
            BaseUrl: BaseUrl,
            loginInfo: {
                userName: "",
                pwd: "",
                tel:"",
                loginType: "",
                authCode: "",
            },
            rules:{
                userName: [
                    { required: true, message: "请输入用户名", trigger: "blur" },
                ],
                pwd: [{ required: true, message: "请输入密码", trigger: "blur" },
                    {
                        min: 6,
                        message: "密码至少六位",
                        trigger: "blur",
                    },],
                tel:[
                    { required: true, message: "请输入电话", trigger: "blur" },
                ],
                loginType: [
                    { type: "string",required: true,message: "请至少选择一种身份",trigger: "change",},
                ],
                authCode:[
                    { type: "string",required: true,message: "请输入验证码",trigger: "blur"}
                ]
            }
        }
    },
    watch:{
        "loginInfo.loginType"(newVal,oldVal){
            // 如果是管理员身份则不显示 注册 按钮
            this.isShowRegister = newVal==3 ? false : true
        }
    },
    methods: {
        loginFun() {
            this.$refs.ruleForm.validate((valid)=>{
                // 先验证验证码是否正确
                let { authCode } = this.loginInfo
                validCaptchaHttp(authCode).then((res)=>{
                    console.log("验证验证码",res)
                    if(res.success===1){
                        loginHttp(this.loginInfo)
                        .then((res) => {
                            localStorage.loginId = res.data.loginId;
                            localStorage.loginType = this.loginInfo.loginType;
                            console.log("登录成功 res", res);
                            if (res.success !== 0 &&this.loginInfo.loginType == "1"){
                                this.$router.push({name: 'AddStadium'});
                            }

                            if (res.success !== 0 &&this.loginInfo.loginType == "0") {
                                this.$router.push({name: 'Subscribe'});
                            }
                        })
                    }else{
                        return
                    }
                })
            })
        },
        registerFun() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let { authCode } = this.loginInfo
                    validCaptchaHttp(authCode).then((res)=>{
                        if(res.success===1){
                            registerHttp(this.loginInfo).then((res) => {
                                if (res.success !== 0 &&this.loginInfo.loginType == "1") {
                                    localStorage.loginId = res.data.loginId 
                                    this.$router.push("/provider");
                                }
                                if (res.success !== 0 &&this.loginInfo.loginType == "0") {
                                    localStorage.loginId = res.data.loginId 
                                    this.$router.push("/user");
                                }
                            })
                        }
                    })
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        resetFun(){
            this.loginInfo={
                userName: "",
                pwd: "",
                tel:"",
                loginType: "",
                authCode: "",
            }
        },
        changeSvg() {
            this.svgImg = this.BaseUrl + "provider/captcha?" + 'mt=' + Math.random()
        },
        init() {
            container = document.createElement('div');	//创建容器
            console.log(document.getElementById("login-wrap"))
            document.getElementById("login-wrap").appendChild(container);
            // document.body.appendChild(container);			//将容器添加到页面上
            camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 1, 1500);		//创建透视相机设置相机角度大小等
            camera.position.set(0, 450, 2000);		//设置相机位置

            scene = new THREE.Scene();			//创建场景
            particles = new Array();

            var PI2 = Math.PI * 2;
            //设置粒子的大小，颜色位置等
            var material = new THREE.ParticleCanvasMaterial({
                color: 0x0f96ff,
                vertexColors: true,
                size: 4,
                program: function (context) {
                    context.beginPath();
                    context.arc(0, 0, 0.01, 0, PI2, true);	//画一个圆形。此处可修改大小。
                    context.fill();
                }
            });
            //设置长条粒子的大小颜色长度等
            var materialY = new THREE.ParticleCanvasMaterial({
                color: 0xffffff,
                vertexColors: true,
                size: 1,
                program: function (context) {

                    context.beginPath();
                    //绘制渐变色的矩形
                    var lGrd = context.createLinearGradient(-0.008, 0.25, 0.016, -0.25);
                    lGrd.addColorStop(0, '#16eff7');
                    lGrd.addColorStop(1, '#0090ff');
                    context.fillStyle = lGrd;
                    context.fillRect(-0.008, 0.25, 0.016, -0.25);  //注意此处的坐标大小
                    //绘制底部和顶部圆圈
                    context.fillStyle = "#0090ff";
                    context.arc(0, 0, 0.008, 0, PI2, true);    //绘制底部圆圈
                    context.fillStyle = "#16eff7";
                    context.arc(0, 0.25, 0.008, 0, PI2, true);    //绘制顶部圆圈
                    context.fill();
                    context.closePath();
                    //绘制顶部渐变色光圈
                    var rGrd = context.createRadialGradient(0, 0.25, 0, 0, 0.25, 0.025);
                    rGrd.addColorStop(0, 'transparent');
                    rGrd.addColorStop(1, '#16eff7');
                    context.fillStyle = rGrd;
                    context.arc(0, 0.25, 0.025, 0, PI2, true);    //绘制一个圆圈
                    context.fill();
                }
            });
            //循环判断创建随机数选择创建粒子或者粒子条
            var i = 0;
            for (var ix = 0; ix < AMOUNTX; ix++) {
                for (var iy = 0; iy < AMOUNTY; iy++) {
                    var num = Math.random() - 0.1;
                    if (num > 0) {
                        particle = particles[i++] = new THREE.Particle(material);
                    }
                    else {
                        particle = particles[i++] = new THREE.Particle(materialY);
                    }
                    //particle = particles[ i ++ ] = new THREE.Particle( material );
                    particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
                    particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
                    scene.add(particle);
                }
            }
            renderer = new THREE.CanvasRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            container.appendChild(renderer.domElement);
            window.addEventListener('resize', onWindowResize, false);
        },
        animate() {
            requestAnimationFrame(this.animate);
            render();
        },
    },

    mounted(){
        this.changeSvg() // 验证码
        this.init();		//初始化
        this.animate();	//动画效果
        
    }
}
</script>

<style>
#login-wrap {
    margin: 0;
    overflow: hidden;
    background: linear-gradient(to bottom, #19778c, #095f88);
    background-size: 100% 100%;
    animation: dynamics 6s ease infinite;
    -webkit-animation: dynamics 6s ease infinite;
    -moz-animation: dynamics 6s ease infinite;
    font-size: 14px;
    color: #ffffff;
    min-height: 700px;
}
*::-webkit-scrollbar { width: 0 !important }
/*登录样式*/
.main {
    position: fixed;
    text-align: center;
    top: 182px;
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
}
.login {
    width: 470px;
    height: 470px;
    background: linear-gradient(to bottom, #19778c, #095f88);
    animation: dynamics 6s ease infinite;
    -webkit-animation: dynamics 6s ease infinite;
    -moz-animation: dynamics 6s ease infinite;
    opacity: 0.9;
    border: solid 1px #13a1fc;
    background-size: 1400% 300%;
}
@keyframes dynamics {
    0% {
        background-position: 0% 0%;
    }
    50% {
        background-position: 50% 100%;
    }
    100% {
        background-position: 100% 0%;
    }
}
.log-con {
    background: linear-gradient(#13a1fc, #13a1fc) left top,
        linear-gradient(#13a1fc, #13a1fc) left top,
        linear-gradient(#13a1fc, #13a1fc) right top,
        linear-gradient(#13a1fc, #13a1fc) right top,
        linear-gradient(#13a1fc, #13a1fc) left bottom,
        linear-gradient(#13a1fc, #13a1fc) left bottom,
        linear-gradient(#13a1fc, #13a1fc) right bottom,
        linear-gradient(#13a1fc, #13a1fc) right bottom;
    background-repeat: no-repeat;
    background-size: 3px 20px, 20px 3px;
    height: 100%;
    margin: -2px;
    padding: 3px 1px 1px 0;
    border-radius: 3px;
}
.log-con > span {
    font-size: 30px;
    font-weight: bold;
    line-height: 24px;
    letter-spacing: 2px;
    display: block;
    margin: 20px 0 20px 0;
}
.log-con > span::after {
    display: block;
    content: "";
    width: 57px;
    height: 3px;
    background: #fff;
    margin-top: 20px;
    justify-content: center;
    position: relative;
    left: 206px;
}
.log-con .loginfo-bottom {
    width: 330px;
    height: 44px;
    border-radius: 4px;
    display: block;
    margin: 10px 0 0px 70px;
    text-align: center;
    line-height: 44px;
    cursor: pointer;
    opacity: 1;
    display: flex;
    justify-content: space-between;
}
.login .select-identity-wrap{
    width: 330px;
    display: flex;
    height: 44px;
    align-items: center;
    justify-content: space-between;
}

input::-webkit-input-placeholder {
    color: #000000;
    font-size: 16px;
}

.log-con #codeimg {
    width: 94px;
    cursor: pointer;
}
/*logo*/
.logo {
    width: 168px;
    height: 75px;
    position: fixed;
    left: 150px;
    top: 26px;
}
.logo img {
    max-width: 100%;
    max-height: 100%;
}
/*版权样式*/
.copyright {
    position: fixed;
    bottom: 10px;
    font-size: 16px;
    display: block;
    width: 100%;
    text-align: center;
}


.color-fff{
    color: #fff;
}
.formItem{
    width: 330px;
    height: 40px;
    margin: auto;
    vertical-align: middle;
    margin: 10px 0 32px 70px;
    border-radius: 4px;
    opacity: 0.9;
    border: 0;
    font-size: 16px;
    outline: none;
}
.codeFormItem{
    display: flex;
}
.code{
    width: 200px;
    vertical-align: top;
}
</style>

