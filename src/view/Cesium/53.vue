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
    //自定义材质
    function OverlayMaterialProperty(options) {
        options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
        this._definitionChanged = new Cesium.Event();
    }
    var defaultColor = Cesium.Color.WHITE;

    Object.defineProperties(OverlayMaterialProperty.prototype, {
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
    OverlayMaterialProperty.prototype.getType = function (time) {
        return 'PolygonOverlay';
    }
    OverlayMaterialProperty.prototype.getValue = function (time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }
        return result;
    }
    OverlayMaterialProperty.prototype.equals = function (other) {
        return this === other || (other instanceof OverlayMaterialProperty);
    }
    Cesium.Material._materialCache.addMaterial('PolygonOverlay', {
        fabric: {
            type: 'textureOverlay',
            uniforms: {
                image1: '../../../public/Cesium/rada.png',
                image2: '../../../public/Cesium/rada1.png',
            },
            source: `
uniform sampler2D image1;
uniform sampler2D image2;
czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);
    mat2 Matrix=mat2(cos(czm_frameNumber*0.01),sin(czm_frameNumber*0.01),-sin(czm_frameNumber*0.01),cos(czm_frameNumber*0.01));
    vec2 st = materialInput.st;
    vec4 map1=texture(image2,st);
    vec2 st1=st-0.5;
    vec2 st2=Matrix*st1;
    vec2 newst=st2+0.5;
    vec4 map2=texture(image1,newst);
    material.diffuse = mix(vec3(map1.rgb),vec3(map2.rgb),0.5);
    float dis=distance(vec2(0.5,0.5),st);
    if(dis>0.5){
    material.alpha=0.0;
    }
    else{
        material.alpha =mix(map2.a,map1.a,0.5);
    }

    return material;
}`,
        },
        translucent: true,
    });

    viewer.entities.add({
        id: 'plane',
        position: Cesium.Cartesian3.fromDegrees(120, 39.9, 0),
        orientation: new Cesium.Quaternion(1.0, 1.0, 1.0, 0),
        plane: {
            plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_X, 0.0),
            dimensions: new Cesium.Cartesian2(100, 100),
            material: new OverlayMaterialProperty()
        }
    })
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(120, 39.9, 2000),
        orientation: {
            heading: Cesium.Math.toRadians(-30),
            pitch: Cesium.Math.toRadians(-100),
            roll: Cesium.Math.toRadians(0),
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