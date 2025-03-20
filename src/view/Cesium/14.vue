<template>
    <div>
        <div id="map"></div>
        <div id="eye"></div>
    </div>
</template>
<script setup>
import * as Cesium from "cesium";
import { vi } from "element-plus/es/locales.mjs";
import { onMounted } from 'vue'
onMounted(() => {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5OTNhNzM4Zi05OGM1LTQzNzgtOWY3OC1mMjkyMDRjNGQ2NWIiLCJpZCI6MjIwMDczLCJpYXQiOjE3MjQ5ODE0OTN9.xeCfpceKEj1anyoP4fLDosWa-0gNwB1fm-IDE7-uplc'
    var viewer = new Cesium.Viewer('map', {
        //搜索控件
        geocoder: false,
        //home控件
        homeButton: false,
        //动画控件
        animation: false,
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

    })
    var viewer1 = new Cesium.Viewer('eye', {
        //搜索控件
        geocoder: false,
        //home控件
        homeButton: false,
        //动画控件
        animation: false,
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
    })
    //设置鹰眼中球的属性
    viewer.scene.debugShowFramesPerSecond = true //显示fps
    let control = viewer1.scene.screenSpaceCameraController;
    control.enableRotate=false
    control.enableTranslate = false;
    control.enableZoom = false
    control.enableTilt = false
    control.enableLook = false
    //接下来实现两个viewer视角同步的大概思路就是viewer中的相机运动时，viewer1的相机同步viewer中的相机状态
    //有两种方案
    //1.通过flyto设置第二种相机，然后通过preRender进行监听，这种也是比较常规的方法
    let syncViewer = function(){
        viewer1.camera.flyTo({
            destination:viewer.camera.position,
            orientation:{
                heading:viewer.camera.heading,
                pitch:viewer.camera.pitch,
                roll:viewer.camera.roll
            },
            duration:0.0
        })
    }
    //对viewer.scene,preRender添加事件监听
    //viewer.scene每一次重新进行渲染就会触发事件
    //viewer.scene.preRender.addEventListener(syncViewer)
    //2.通过设置给一个entity的label对象，一个CallbackProperty来触发监听事件实现flyto同步地球,，这种效果最好
    viewer.entities.add({
        position:Cesium.Cartesian3.fromDegrees(0,0),
        label:{
            text:new Cesium.CallbackProperty(function(){    
                syncViewer();
                return ''
            },true)
        }

    })

    //隐藏Cesiumlogo
    viewer._cesiumWidget._creditContainer.style.display = "none";
    viewer1._cesiumWidget._creditContainer.style.display = "none";

})
</script>
<style scoped>
#eye {
    position: absolute;
    width: 20%;
    height: 20%;
    bottom: 20%;
    right: 2%;
    z-index: 999;
    background-color: red;
    border: solid blue 1px;
}

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
</style>