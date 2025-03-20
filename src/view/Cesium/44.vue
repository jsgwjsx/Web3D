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
    let i = 0
    const handeler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handeler.setInputAction((event) => {
        const pos = new Cesium.Cartesian3()
        i += 1
        viewer.camera.pickEllipsoid(event.position, viewer.scene.ellipsoid, pos)
        let x = 100;
        let y = 100
        let color = 1;
        let angle = 0
        var id = 'ellipse' + i
        if (pos.x) {
            viewer.entities.add({
                id: id,
                position: pos,
                ellipse: {
                    semiMajorAxis: new Cesium.CallbackProperty(function () {
                        x += 100
                        return x
                    }, false),
                    semiMinorAxis: new Cesium.CallbackProperty(function () {
                        y += 100
                        return y
                    }, false),
                    material: new Cesium.ImageMaterialProperty({
                        image: '../../../public/Cesium/taiji.jpg',
                        color: new Cesium.CallbackProperty(function () {
                            if (color >= 0) {
                                color -= 0.01
                            } else {
                                console.log(id)
                                viewer.entities.removeById(id)

                            }
                            return Cesium.Color.WHITE.withAlpha(color)
                        }, false),
                    }),
                    extrudedHeight: 1,
                    stRotation: new Cesium.CallbackProperty(function () {
                        angle += 2
                        return Cesium.Math.toRadians(angle)
                    }, false)
                }
            })
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(120.97, 37, 500),
        orientation: {
            heading: Cesium.Math.toRadians(90),
            pitch: Cesium.Math.toRadians(-10),
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