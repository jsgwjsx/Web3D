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
        // baseLayer: new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
        //     url: ' http://webrd01.is.autonavi.com/appmaptile?&scale=1&lang=zh_cn&style=8&x={x}&y={y}&z={z}',
        //     minimumLevel: 1,
        //     maximumLevel: 18
        // })
        // )
        imageryProvider: false,
        terrainProvider: new Cesium.EllipsoidTerrainProvider() // 使用简单的椭球体地形
    })

    viewer.scene.debugShowFramesPerSecond = true //显示fps
    //加载天地图底图
    var key = 'cac511afc3d7fef35e3f3b40f3712ebd'
    var url = `http://t0.tianditu.gov.cn/vec_w/wmts?tk=${key}`
    let layerProvider = new Cesium.WebMapTileServiceImageryProvider({
        url: url,
        layer: 'img',
        style: 'default',
        maximumLevel: 18,
        tileMatrixSetID: 'w'
    })
    viewer.imageryLayers.addImageryProvider(layerProvider)
        var urls = `http://t{s}.tianditu.gov.cn/cva_w/wmts?tk=${key}`
    let layerProviders = new Cesium.WebMapTileServiceImageryProvider({
        url: urls,
         layer: 'cva',
            style: 'default',
            format: 'tiles',
            tileMatrixSetID: 'w',
            subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
            maximumLevel: 18,
    })
    viewer.imageryLayers.addImageryProvider(layerProviders)
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