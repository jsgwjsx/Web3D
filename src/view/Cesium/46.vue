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
        selectionIndicator:false,//关闭选中样式
        infoBox:false,//关闭选中效果框
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
    const longitude = 120.0
    const latitude = 37.0
    for (let i = 0; i < 10; i++) {
        const lon = longitude + 0.1 * i
        for (let j = 0; j < 10; j++) {
            let id = i + '' + j
            const lat = latitude + 0.1 * j
            //在此创建实体
            viewer.entities.add({
                id: 'box' + id,
                position: new Cesium.Cartesian3.fromDegrees(lon, lat, 20),
                box: {
                    dimensions: new Cesium.Cartesian3(2000, 2000, 30000),
                    material: Cesium.Color.WHITE
                }
            })
        }
    }
    var  handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (movement) {
        //获得点击的屏幕位置
        const pos = movement.position
        //再配合scene的drillPick方法拿到射线拾取的第一个物体
        const intersect = viewer.scene.drillPick(pos)

        if (intersect[0]) {
            intersect[0].id.box.material = Cesium.Color.RED
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(120, 37.5, 200000),
        orientation: {
            heading: Cesium.Math.toRadians(90),
            pitch: Cesium.Math.toRadians(-80),
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