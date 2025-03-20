<template>
    <div>
        <div id="map"></div>
        <div id="bubble" style="position: absolute;">气泡窗</div>
    </div>
</template>
<script setup>
import * as Cesium from "cesium";
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
        //1. 通过baseLayer在viewer内部中添加地图
        // baseLayer: new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
        //     url: ' http://webrd01.is.autonavi.com/appmaptile?&scale=1&lang=zh_cn&style=8&x={x}&y={y}&z={z}',
        //     minimumLevel: 1,
        //     maximumLevel: 18
        // })
        //)
    })
    viewer.scene.debugShowFramesPerSecond = true //显示fps
    //实际上实现思路就是和20.vue的思路反过来，20的实现思路是根据屏幕坐标转为真实坐标然后给entity
    //这个思路就是将真实坐标转为屏幕坐标，具体操作与Three中的css2Renderer有些相似
    const bubbleWindow = document.getElementById("bubble");
    const scratch = new Cesium.Cartesian2();
    viewer.scene.preRender.addEventListener(function () {
        const position = Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883);
        //将真实坐标转为屏幕坐标
        const canvasPosition = viewer.scene.cartesianToCanvasCoordinates(
            position,
            scratch,
        );
        if (Cesium.defined(canvasPosition)) {
            bubbleWindow.style.top = `${canvasPosition.y}px`;
            bubbleWindow.style.left = `${canvasPosition.x}px`;
        }
    });


})
</script>
<style scoped>
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

#bubble {
    background-color: red;
    z-index: 100
}
</style>