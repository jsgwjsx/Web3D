<template>
    <div>
        <div id="map"></div>
        <!-- <div id="dark" @click="toDark()">黑暗风格</div>
        <div id="light" @click="toLight()">光明风格</div> -->
    </div>
</template>
<script setup>
import * as Cesium from "cesium";
import { onMounted } from 'vue'
var viewer
onMounted(() => {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5OTNhNzM4Zi05OGM1LTQzNzgtOWY3OC1mMjkyMDRjNGQ2NWIiLCJpZCI6MjIwMDczLCJpYXQiOjE3MjQ5ODE0OTN9.xeCfpceKEj1anyoP4fLDosWa-0gNwB1fm-IDE7-uplc'
    viewer = new Cesium.Viewer('map', {
        //搜索控件
        geocoder: false,
        //home控件
        homeButton: false,
        //动画控件
        animation: true,
        //全屏控件
        fullscreenButton: false,
        //场景模式选择器
        sceneModePicker: false,
        //时间轴
        timeline: false,
        //导航帮助按钮
        navigationHelpButton: false,
        //底图选择器
        baseLayerPicker: false,
        //1. 通过baseLayer在viewer内部中添加地图
        baseLayer: new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
            url: ' http://webrd01.is.autonavi.com/appmaptile?&scale=1&lang=zh_cn&style=8&x={x}&y={y}&z={z}',
            minimumLevel: 1,
            maximumLevel: 18
        })
        )
    })
    viewer.scene.debugShowFramesPerSecond = true //显示fps

    toLight()

})
function toLight() {
    document.body.className = 'cesium-lighter';
    viewer.animation.applyThemeChanges();
}
function toDark() {
    document.body.className = '';
    viewer.animation.applyThemeChanges();
}

</script>
<style scoped>
/* @import url('../../../node_modules/cesium/Build/CesiumUnminified/Widgets/Animation/lighter.css'); */

#map {
    width: 100%;
    height: 100%;
}

* {
    margin: 0;
    padding: 0;
}

html,
body {
    width: 100%;
    height: 100%;
}

#dark {
    position: absolute;
    left: 2%;
    top: 2%;
    background-color: red;
}

#dark:hover {
    position: absolute;
    left: 2%;
    top: 2%;
    background-color: aqua;
    cursor: pointer;
}

#light {
    position: absolute;
    left: 2%;
    top: 50px;
    background-color: red;
}

#light:hover {
    position: absolute;
    left: 2%;
    top: 50px;
    background-color: aqua;
    cursor: pointer;
}
</style>