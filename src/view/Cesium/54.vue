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
    //绘制线条
    viewer.entities.add({
        id: 'line',
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([120.88, 37, 119, 38, 122, 38.9, 122, 39]),
            material: Cesium.Color.RED
        }
    })
    //垂足点位置
    const lon = 122
    const lat = 38.9
    //顶点位置
    const lon1 = 122
    const lat1 = 39
    //根据顶点位置和垂足点位置计算一个矢量方向
    const pos1 = new Cesium.Cartesian3.fromDegrees(lon, lat, 0)
    const pos2 = new Cesium.Cartesian3.fromDegrees(lon1, lat1, 0)
    const dir1 = new Cesium.Cartesian3()
    Cesium.Cartesian3.subtract(pos2, pos1, dir1)
    //归一化
    Cesium.Cartesian3.normalize(dir1, dir1)
    //垂足点本身的卡笛尔3坐标也是一个矢量方向
    const dir2 = new Cesium.Cartesian3.fromDegrees(lon, lat, 0)
    //归一化
    Cesium.Cartesian3.normalize(dir2, dir2)
    //两个方向矢量叉乘获得,三角形另外两个点的方向
    const dir3 = new Cesium.Cartesian3()
    Cesium.Cartesian3.cross(dir1, dir2, dir3)
    const dir4 = new Cesium.Cartesian3()
    Cesium.Cartesian3.cross(dir2, dir1, dir4)
    //归一化
    Cesium.Cartesian3.normalize(dir3, dir3)
    Cesium.Cartesian3.normalize(dir4, dir4)
    //利用射线找到这两个点
    const ray1 = new Cesium.Ray(pos1, dir3)
    const ray2 = new Cesium.Ray(pos1, dir4)
    const pos3 = new Cesium.Cartesian3()
    const pos4 = new Cesium.Cartesian3()
    Cesium.Ray.getPoint(ray1, 3000, pos3)
    Cesium.Ray.getPoint(ray2, 3000, pos4)
    console.log(pos3);
    //根据三个顶点位置通过polygon绘制三角形
    viewer.entities.add({
        id: "trangle",
        polygon: {
            hierarchy: [pos2, pos3, pos4],
            material: Cesium.Color.BLUE
        }
    })
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(120.88, 37, 500000),
        orientation: {
            heading: Cesium.Math.toRadians(90),
            pitch: Cesium.Math.toRadians(-95),
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