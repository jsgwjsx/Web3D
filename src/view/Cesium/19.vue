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
    let count = 0;
    let p1 = {
        longitude:114.38,  
        latitude:36.90,
        height:354.68,
        heading:0.0,
        pitch:-20.0,
        roll:0.0,
        duration:10.0
    }
    let p2 = {
        longitude:120.38,  
        latitude:36.90,
        height:354.68,
        heading:0.0,
        pitch:-20.0,
        roll:0.0,
        duration:10.0
    }
    let p3 = {
        longitude:150.38,  
        latitude:36.90,
        height:354.68,
        heading:0.0,
        pitch:-20.0,
        roll:0.0,
        duration:10.0
    }
    let positionList = [p1,p2,p3]
    function fly(){
        if(count>=positionList.length){
            return
        }
        var position = positionList[count]
        viewer.camera.flyTo({
            destination:Cesium.Cartesian3.fromDegrees(position.longitude,position.latitude,position.height),
            duration:parseFloat(position.duration),
            orientation:{
                heading:Cesium.Math.toRadians(position.heading),
                pitch:Cesium.Math.toRadians(position.pitch),
                roll:Cesium.Math.toRadians(position.roll)
            },
            complete:function(){
                fly()
            }
        });
        count++
    }
    fly()

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