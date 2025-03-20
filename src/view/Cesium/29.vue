<template>
    <div>
        <div id="map"></div>
    </div>
</template>
<script setup>
import * as Cesium from "cesium";
import { onMounted } from 'vue'
import customCyclinder from '../../../public/Cesium/Core/custom/CylinderGeometry'
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
    //创建entity使用Cesium的圆锥
    viewer.entities.add({
        id: 'cylinder',
        position: new Cesium.Cartesian3.fromDegrees(120, 38, 300),
        cylinder: {
            topRadius: 1000,
            bottomRadius: 0,
            material: new Cesium.ImageMaterialProperty({
                image: '../../../public/Cesium/earthMap.jpg',
                //transparent:true
            }),
            length: 700,
            outline: true,
            outlineColor: Cesium.Color.RED,
            outlineWidth: 11
        }
    })
    viewer.camera.setView({
        destination: new Cesium.Cartesian3.fromDegrees(120, 37.98, 1200),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-15),
            roll: Cesium.Math.toRadians(0),
        }
    })
    //创建primitive使用自定义的圆锥
    const cylinder = new customCyclinder({
        length: 700,
        topRadius: 1000,
        bottomRadius: 0,
        vertexFormat: Cesium.VertexFormat.ALL
    })
    const geometry = customCyclinder.createGeometry(cylinder)
    viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: geometry,
            modelMatrix: Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(120, 38.02)), new Cesium.Cartesian3(0.0, 0.0, 300.0), new Cesium.Matrix4()),
            id: 'custom cylinder',
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.AQUA)
            }
        }),
        appearance: new Cesium.EllipsoidSurfaceAppearance({
            material: Cesium.Material.fromType('Image', {
                image: '../../../public/Cesium/earthMap.jpg'
            }),
            renderState: {
                //关闭背面剔除
                cull: {enabled: false}
            }
        }),
        asynchronous: false,


    }))


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