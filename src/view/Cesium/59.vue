<template>
    <div>
        <div id="map"></div>
        <canvas ref="text" id="canvas" width="280px" height="50px"></canvas>
    </div>
</template>
<script setup>
import * as Cesium from "cesium";
import { onMounted, ref } from 'vue'
//给canvas画布设置字体并且转为url
const text = ref(null)
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

    //创建canvas画布
    const ctx = text.value.getContext('2d')
    ctx.font = 'bold 16px'
    ctx.fillText('abcd', 20, 40)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    let img = new Image()
    img.src = text.value.toDataURL()
    //自定义材质

    function TextMaterialProperty(options) {
        options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
        this._definitionChanged = new Cesium.Event();
    }
    var defaultColor = Cesium.Color.WHITE;
    Object.defineProperties(TextMaterialProperty.prototype, {
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
    TextMaterialProperty.prototype.getType = function (time) {
        return 'Text';
    }
    TextMaterialProperty.prototype.getValue = function (time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }
        return result;
    }
    TextMaterialProperty.prototype.equals = function (other) {
        return this === other || (other instanceof TextMaterialProperty);
    }
    Cesium.Material._materialCache.addMaterial('Text', {
        fabric: {
            type: 'Text',
            uniforms: {
                image: img.src
            },
            source: `
           uniform sampler2D image;
           czm_material czm_getMaterial(czm_materialInput materialInput)
            {  
                czm_material material = czm_getDefaultMaterial(materialInput);
                float s=sin(czm_frameNumber*0.01);
                vec2 st=materialInput.st;
                //根据距离中心的距离实现一个渐变
                float dis=distance(vec2(.5,.5),st);
                vec4 map=texture(image,st);
                material.diffuse = vec3(sin(dis*20.0)*sin(czm_frameNumber*0.2),sin(dis*40.0)*sin(czm_frameNumber*0.2),sin(dis*20.0)*sin(czm_frameNumber*0.1));
                //根据图片透明度扣出来字体
                material.alpha = map.a;
                return material;
            }
        `
        },
        translucent: true,
    })
    viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(120.5, 39.9, 5000),
        plane: {
            plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_X, 0.0),
            dimensions: new Cesium.Cartesian2(40000, 16000),
            material: new TextMaterialProperty()
        }

    })
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(121, 39.9, 20000),
        orientation: {
            heading: Cesium.Math.toRadians(-90),
            pitch: Cesium.Math.toRadians(-20),
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