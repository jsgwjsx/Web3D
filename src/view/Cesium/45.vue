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

    //自定义水面材质,根据原来的Water水材质绘制
    function WaterMaterialEntity(options) {
        options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
        this._definitionChanged = new Cesium.Event();
    }
    Object.defineProperties(WaterMaterialEntity.prototype, {
        isConstant: {
            get: function () {
                return false
            }
        },
        definitionChanged: {
            get: function () {
                return this._definitionChanged
            }
        }
    })
    WaterMaterialEntity.prototype.getType = function (time) {
        return 'PolygonWater';
    }
    WaterMaterialEntity.prototype.getValue = function (time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }
        return result;
    }
    WaterMaterialEntity.prototype.equals = function (other) {
        return this === other || (other instanceof WaterMaterialProperty);
    }
    let m = Cesium.Material._materialCache.getMaterial("Water");//获取水的材质
    m.fabric.uniforms.normalMap = Cesium.buildModuleUrl('../../../public/Cesium/water.jpg');
    //使用自定义参数
    m.fabric.uniforms.animationSpeed = 0.01;
    m.fabric.uniforms.amplitude = 100.0;
    m.fabric.uniforms.frequency = 1000;
    Cesium.Material._materialCache.addMaterial('PolygonWater', m);
    const promise = Cesium.GeoJsonDataSource.load('../../../public/Cesium/polygon.json', {
        stroke: Cesium.Color.HOTPINK,
        fill: Cesium.Color.PINK,
        strokeWidth: 3,
        markerSymbol: '?'
    });
    promise.then((data) => {
        const entity = data._entityCollection._entities._array[0]
        console.log(entity._polygon.material);
        entity._polygon.material = new WaterMaterialEntity()
        viewer.entities.add(entity)
    })
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(90.9, 37, 7000000),
        orientation: {
            heading: Cesium.Math.toRadians(90),
            pitch: Cesium.Math.toRadians(-90),
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