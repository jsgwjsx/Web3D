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
            maximumLevel: 18
        })
        )
    })
    viewer.scene.debugShowFramesPerSecond = true //显示fps
    //创建一个圆的entity
    function dashcircle(centerlon, centerlat, radius) {
        // 生成圆的顶点坐标（将圆拆分为多段线段）
        const positions = [];
        for (let i = 0; i <= 360; i += 5) { // 每5度一个点
            const angle = Cesium.Math.toRadians(i);
            const position = Cesium.Cartesian3.fromDegrees(
                centerlon + radius / 111320 * Math.cos(angle), // 经度偏移
                centerlat + (radius / 111320) * Math.sin(angle) / Math.cos(Cesium.Math.toRadians(centerlat)), // 纬度偏移
            );
            positions.push(position);
        }
        return positions
    }


    viewer.entities.add({
        id: "circle",
        polyline: {
            positions:dashcircle(121, 36.5, 50000),
            material: new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.RED,
                gapColor: Cesium.Color.WHITE.withAlpha(0),
                dashLength: 20
            })
        }
    })
    viewer.camera.setView({
        destination: new Cesium.Cartesian3.fromDegrees(121, 36, 110000),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-50),
            roll: Cesium.Math.toRadians(0)
        }
    })
    var circle = new Cesium.CircleOutlineGeometry({
        center: Cesium.Cartesian3.fromDegrees(105, 20, 20),
        radius: 10.0
    });
    var geometry = Cesium.CircleOutlineGeometry.createGeometry(circle);



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