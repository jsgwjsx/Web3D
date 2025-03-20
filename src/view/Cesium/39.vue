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
    var position = [114.0, 30.0, 0.0]
    var point = viewer.entities.add({
        id: 'point',
        position: new Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]),
        point: {
            pixelSize: 5,
            color: Cesium.Color.RED
        }
    })

    //根据turf计算出点的缓冲区范围
    const points = turf.point(position)
    console.log(points)
    const buffer = turf.buffer(points, 40)
    //解析成cesium能用的
    const data = buffer.geometry.coordinates[0]
    const posArr = []
    data.forEach(e => {
        posArr.push(e[0], e[1])
    })
    //画出缓冲区
    viewer.entities.add({
        id: 'pointPolygon',
        polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray(posArr),
            material: Cesium.Color.WHITE
        }
    })
    //根据turf算出这个线的缓冲区范围
    const line = turf.lineString([[113.5, 29.5], [114.5, 29.5], [114.5, 30.5], [113.5, 30.5]], { name: 'line 1' })
    console.log(line);
    const buffer1 = turf.buffer(line, 10)
    //拿到这个区的数据
    const data1 = buffer1.geometry.coordinates[0]
    console.log(buffer1.geometry.coordinates[0]);
    //解析成Cesium能用的
    const lineArr = []
    data1.forEach(e => {
        lineArr.push(e[0], e[1])
    })
    //画出缓冲区
    viewer.entities.add({
        id: 'linePolygon',
        //position:new Cesium.Cartesian3.fromDegrees(100,20,0),
        polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray(lineArr),
            material: Cesium.Color.WHITE
        }
    })

    //先用Cesium画个区域
    viewer.entities.add({
        id: 'polygon',
        //position:new Cesium.Cartesian3.fromDegrees(100,20,0),
        polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray([113, 29, 115, 29, 115, 31, 113, 31]),
            material: Cesium.Color.RED
        }
    })
    //根据turf算出这个线的缓冲区范围
    const polygon = turf.polygon([[[113, 29], [115, 29], [115, 31], [113, 31], [113, 29]]])
    console.log(line);
    const buffer2 = turf.buffer(polygon, 10)
    //拿到这个区的数据
    const data2 = buffer2.geometry.coordinates[0]
    //解析成Cesium能用的
    const polygonArr = []
    data2.forEach(e => {
        polygonArr.push(e[0], e[1])
    })
    //画出缓冲区
    viewer.entities.add({
        id: 'Polygon',
        //position:new Cesium.Cartesian3.fromDegrees(100,20,0),
        polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray(polygonArr),
            material: Cesium.Color.BLACK
        }
    })
    viewer.zoomTo(viewer.entities)
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