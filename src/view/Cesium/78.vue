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

    viewer.scene.postProcessStages.fxaa.enabled = true;

    const scene = viewer.scene;
    scene.globe.depthTestAgainstTerrain = true;

    const position = Cesium.Cartesian3.fromDegrees(123.0744619, 44.0503706, 0);
    const hpr = new Cesium.HeadingPitchRoll(0, 0, 0);
    const fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator("north", "west");

    let url = "../../../public/Cesium/fly.glb";
    const textureUniformShader = new Cesium.CustomShader({
        uniforms: {},
        fragmentShaderText: `
    void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
    {
        vec4 position = czm_inverseModelView * vec4(v_positionEC,1);
        float stc_sd = position.y/0.1;
        material.diffuse = vec3(1.0, 1.0, 0.0)*stc_sd;// 基础颜色
    }
    `
    });
    async function showModel(url, customShader) {
        try {
            const model = viewer.scene.primitives.add(await Cesium.Model.fromGltfAsync({
                url: url,
                customShader: customShader,
                modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(position, hpr, Cesium.Ellipsoid.WGS84, fixedFrameTransform)
            }));
        } catch (error) {
            console.log(`Error loading model: ${error}`);
        }
    }
    showModel(url, textureUniformShader);

    viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(123.0744619, 44.0503706, 100) });

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