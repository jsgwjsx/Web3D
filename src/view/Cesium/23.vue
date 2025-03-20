<template>
    <div>
        <div id="map"></div>
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
        baseLayer: new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
            url: ' http://webrd01.is.autonavi.com/appmaptile?&scale=1&lang=zh_cn&style=8&x={x}&y={y}&z={z}',
            minimumLevel: 1,
            maximumLevel: 18,
        })
        )
    })
    viewer.scene.debugShowFramesPerSecond = true //显示fps
    //限制底图
    //设置地图范围
    var coffeeBectangle = Cesium.Rectangle.fromDegrees(110.0, 23.43687, 114.0, 25.43687)
    //开启限制
    viewer.scene.globe.cartographicLimitRectangle = coffeeBectangle
    viewer.scene.globe.showSkirts = false;
    viewer.scene.globe.backFaceCulling = false;
    viewer.scene.globe.undergroundColor = undefined;
    viewer.scene.skyAtmosphere.show = false;
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(112.0, 24.0, 505000)
    })
    // let imgprov = new Cesium.UrlTemplateImageryProvider({
    //     url: 'GoogleMap_TMS/{z}/{x}/{y}.jpg',
    //     minimumLevel: 3,
    //     maximumLevel: 18,
    //     //使用离线地图，限制项目范围
    //     rectangle:: Cesium.Rectangle.fromDegrees(116, 31, 117, 32)
    // });
    // viewer.imageryLayers.addImageryProvider(imgprov);

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
</style>