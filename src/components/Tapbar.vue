<script setup >
import router from '../router';


</script>

<template>
    <el-header class="header" height="60px">
        <div style="display: inline-block; cursor: pointer;" v-on:click="()=>{router.push('/page')}">Three学习</div>
        <div class="web3d" v-on:click="()=>{router.push('/examples')}">web3d案例</div>
        <div class="web3d" v-on:click="()=>{router.push('/webgl')}">Webgl案例</div>
        <div class="web3d" v-on:click="()=>{router.push('/Cesium')}">Cesium学习</div>
    </el-header>
</template>
<style>
.common-layout {
    height: 100%;
    width: 100%;
    position: fixed;
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.header {
    background-color: var(--el-color-primary-light-7);
    line-height: 60px;
    color: var(--el-text-color-primary);
    font-size: 18px;
    position: relative;
}

.asider {
    scrollbar-width: none;
}
.web3d{
    display: inline-block;
    margin: 0px 50px;
    font-size: 14px;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;

}
.web3d:hover{
    color: white;
    cursor: pointer;
}
</style>