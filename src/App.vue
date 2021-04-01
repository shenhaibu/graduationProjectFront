<template>
    <div id="app">
        <router-view v-if="isRouterAlive"></router-view>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Ref ,Provide } from "vue-property-decorator";

@Component
export default class LogIn extends Vue {
     @Provide('reload') reload = this.reloaded;

     isRouterAlive = true
     
     reloaded(){
                this.isRouterAlive = false;            //先关闭，
                this.$nextTick(function () {
                    this.isRouterAlive = true;         //再打开
                }) 
            }
}

</script>
<style>
* {
    margin: 0;
    padding: 0;
}
</style>
