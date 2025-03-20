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
    var line =  viewer.entities.add({
        id: '贴地线',
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([
            -20,30,170,34
            ]),
            width: 5,
            material: new Cesium.PolylineOutlineMaterialProperty({
                material: Cesium.Color.WHITE,//填充
                outline:true,//轮廓
                outlineColor:Cesium.Color.BLUE,
            }),
            arcType:Cesium.ArcType.RHUMB
            
        },
    })
    viewer.entities.add({
        id: '正常直线',
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([
            -20,30,170,34
            ]),
            width: 5,
            material: new Cesium.PolylineOutlineMaterialProperty({
                material: Cesium.Color.WHITE,//填充
                outline:true,//轮廓
                outlineColor:Cesium.Color.BLUE,
            }),
            arcType:Cesium.ArcType.NONE
            
        },
    })
    viewer.entities.add({
        id: '沿着墨卡托的路线',
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([
            -20,20,170,34
            ]),
            width: 5,
            material: new Cesium.PolylineOutlineMaterialProperty({
                material: Cesium.Color.WHITE,//填充
                outline:true,//轮廓
                outlineColor:Cesium.Color.BLUE,
            }),
            arcType:Cesium.ArcType.RHUMB
            
        },
    })
    viewer.zoomTo(line)
    

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