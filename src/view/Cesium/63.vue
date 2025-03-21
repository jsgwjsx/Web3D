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
    const scene = viewer.scene;
// 北京市大概范围
let startLon = 115.5;
let startLat = 39.5;
let endLon = 117.5;
let endLat = 41 ;
// 区域范围
const rectangle = viewer.entities.add({
    name: "Red translucent rectangle",
    rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(
            startLon,
            startLat,
            endLon,
            endLat
        ),
        material: Cesium.Color.GREEN.withAlpha(0.15),
    },
});
// 四个角上绘制 1km为半径的球，用来检查网格正确性
function addSphere(lon,lat){
    viewer.entities.add({
        name: "Red sphere with black outline",
        position: Cesium.Cartesian3.fromDegrees(lon,lat),
        ellipsoid: {
            radii: new Cesium.Cartesian3(1000.0, 1000.0, 1000.00),
            material: Cesium.Color.RED.withAlpha(0.5),
            outline: true,
            outlineColor: Cesium.Color.BLACK,
        },
    });
}

addSphere(startLon,startLat);
addSphere(startLon,endLat);
addSphere(endLon,startLat);
addSphere(endLon,endLat);
let radius = viewer.scene.globe.ellipsoid.radii.x;
// dis 米为单位
function GetStep(radius,dis){
    return Cesium.Math.toDegrees(Math.acos(1-dis*dis/(2*radius*radius)));
}
// 纬度差
let stepLat = GetStep(radius,1000);

for(let i = startLat;i<endLat;i+=stepLat){
    viewer.entities.add({
        polyline: {
            positions:  Cesium.Cartesian3.fromDegreesArray([
                startLon,i,
                endLon,i,
            ]),
            width: 1,
            arcType: Cesium.ArcType.RHUMB,
            material: Cesium.Color.RED, 
            granularity:0.001,
            // clampToGround: true,
        },
    });
}

// 经度差
// let stepLon = GetStep(radius*Math.cos(Cesium.Math.toRadians(startLat)),1000);
let stepLonStart = GetStep(radius*Math.cos(Cesium.Math.toRadians(startLat)),1000);
let stepLonEnd = GetStep(radius*Math.cos(Cesium.Math.toRadians(endLat)),1000);

for(let j = startLon,k=startLon;j<endLon,k<endLon;j+= stepLonStart,k+=stepLonEnd){
    viewer.entities.add({
        polyline: {
            positions:  Cesium.Cartesian3.fromDegreesArray([
                j,startLat,
                k,endLat,
            ]),
            width: 1,
            arcType: Cesium.ArcType.RHUMB,
            material: Cesium.Color.RED, 
            granularity:0.001,
            // clampToGround: true,
        },
    });
}
viewer.zoomTo(viewer.entities);

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