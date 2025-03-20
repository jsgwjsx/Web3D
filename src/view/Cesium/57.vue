<template>
    <div>
        <div id="map"></div>
    </div>
</template>
<script setup>
import * as Cesium from "cesium";
import { onMounted } from 'vue'
//自定义材质
function LEDMaterialProperty(options) {
    options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
    this._definitionChanged = new Cesium.Event();
}
var defaultColor = Cesium.Color.WHITE;
Object.defineProperties(LEDMaterialProperty.prototype, {
    isConstant: {
        get: function () {
            return false;
        }
    },
    definitionChanged: {
        get: function () {
            return this._definitionChanged;
        }
    },
});
LEDMaterialProperty.prototype.getType = function (time) {
    return 'LEDLight';
}
LEDMaterialProperty.prototype.getValue = function (time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    return result;
}
LEDMaterialProperty.prototype.equals = function (other) {
    return this === other || (other instanceof LEDMaterialProperty);
}
Cesium.Material._materialCache.addMaterial('LEDLight', {
    fabric: {
        type: 'LEDLight',
        uniforms: {
            image: '../../../public/Cesium/fire.png',
            speed: 0.01
        },
        source: `
    #define PI 3.1415926
    uniform sampler2D image;
    uniform float speed;
    float angle=0.0;
czm_material czm_getMaterial(czm_materialInput materialInput)
{  
    czm_material material = czm_getDefaultMaterial(materialInput);
    float s=sin(czm_frameNumber*0.01);
    //计算旋转矩阵
    mat2 Matrix=mat2(cos(czm_frameNumber*0.01),sin(czm_frameNumber*0.01),-sin(czm_frameNumber*0.01),cos(czm_frameNumber*0.01));
    vec2 st = materialInput.st;
    vec2 newst=vec2(st.s-0.5,st.t-0.5);
    vec2 st1=Matrix*newst;
    vec2 st2=vec2(st1.s+0.5,st1.t+0.5);
    vec4 map=texture(image,st2);
    material.emission = map.rgb;
    material.alpha = 1.0;
    return material;
}`,
    },
    translucent: false,
});
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
    viewer.scene.globe.depthTestAgainstTerrain = true
    viewer.entities.add({
        id: 'LED',
        position: Cesium.Cartesian3.fromDegrees(121, 37.5, 0),
        orientation: Cesium.Quaternion.fromHeadingPitchRoll(Cesium.HeadingPitchRoll.fromDegrees(0, 0, 0)),
        cylinder: {
            length: 100000,
            topRadius: 0,
            bottomRadius: 10000,
            material: Cesium.Color.WHITE.withAlpha(0.15)
        },
    })
    viewer.entities.add({
        id: 'LED1',
        position: Cesium.Cartesian3.fromDegrees(121, 37.49, 0),
        ellipse: {
            semiMajorAxis: 8500,
            semiMinorAxis: 5000,
            rotation: Cesium.Math.toRadians(90),
            outline: true,
            outlineColor: Cesium.Color.RED,
            outlineWidth: 1000,
            material: new LEDMaterialProperty()
        }
    })
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(120, 37.5, 200000),
        orientation: {
            heading: Cesium.Math.toRadians(90),
            pitch: Cesium.Math.toRadians(-60),
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