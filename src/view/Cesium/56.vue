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
        terrain:Cesium.Terrain.fromWorldTerrain(),//开启地形
        //1. 通过baseLayer在viewer内部中添加地图
        // baseLayer: new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
        //     url: ' http://webrd01.is.autonavi.com/appmaptile?&scale=1&lang=zh_cn&style=8&x={x}&y={y}&z={z}',
        //     minimumLevel: 1,
        //     maximumLevel: 18
        // })
        // )
        
    })
    viewer.scene.globe.depthTestAgainstTerrain = true
    viewer.scene.debugShowFramesPerSecond = true //显示fps
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(function (movement) {
        const feature = viewer.scene.pickPosition(movement.position);
        console.log(feature);
        if (feature) {
            viewer.entities.add({
                position: feature,
                point: {
                    pixelSize: 30,
                    color: Cesium.Color.RED,
                    outlineColor: Cesium.Color.AZURE,
                    outlineWidth: 3
                }
            })
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    viewer.entities.add({
        id: 'box',
        position: Cesium.Cartesian3.fromDegrees(120.88, 37, 500),
        box: {
            dimensions: new Cesium.Cartesian3(1000, 1000, 1000),
            material: Cesium.Color.GOLD.withAlpha(0.3)
        }
    })

    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(120.84, 37, 2000),
        orientation: {
            heading: Cesium.Math.toRadians(90),
            pitch: Cesium.Math.toRadians(-25),
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