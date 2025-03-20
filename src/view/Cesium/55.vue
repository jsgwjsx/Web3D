<template>
    <div>
        <div id="map"></div>
    </div>
</template>
<script setup>
import * as Cesium from "cesium";
import { onMounted } from 'vue'
import * as turf from '@turf/turf'

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
    //创建第一个点(圆心)
    viewer.entities.add({
        id: 'point1',
        position: new Cesium.Cartesian3.fromDegrees(120, 34, 0),
        point: {
            pixelSize: 30
        }
    })
    //创建起点
    viewer.entities.add({
        id: 'point2',
        position: new Cesium.Cartesian3.fromDegrees(120, 39, 0),
        point: {
            pixelSize: 30,
            color: Cesium.Color.RED
        }
    })
    //圆心和起点创建线
    viewer.entities.add({
        id: 'line1',
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([120, 34, 120, 39]),

        }
    })
    const point = turf.point([120, 34]);
    const bearing = 30;
    const options = { units: 'kilometers' };
    const destination = turf.destination(point, 555.0, bearing, options);
    //根据turf找到第三个点
    viewer.entities.add({
        id: 'point3',
        position: new Cesium.Cartesian3.fromDegrees(destination.geometry.coordinates[0], destination.geometry.coordinates[1], 0),
        point: {
            pixelSize: 30,
            color: Cesium.Color.BLUE
        }
    })
    //第三点和起点创建线
    viewer.entities.add({
        id: 'line2',
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([120, 34, destination.geometry.coordinates[0], destination.geometry.coordinates[1]]),

        }
    })
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(120, 39.9, 2000000),
        orientation: {
            heading: Cesium.Math.toRadians(-30),
            pitch: Cesium.Math.toRadians(-100),
            roll: Cesium.Math.toRadians(0),
        }
    })

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