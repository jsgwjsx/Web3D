<template>
    <div>
        <div id="map"></div>
        <video ref="vide" autoplay loop crossorigin controls>
            <source src="../../../public/Cesium/vedio.mp4" type="video/mp4">
        </video>
    </div>
</template>
<script setup>
import * as Cesium from "cesium";
import { onMounted, ref } from 'vue'
const vide = ref(null)
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
    var scene = viewer.scene;

    var dimensions = new Cesium.Cartesian3(400000.0, 400000.0, 1.0);
    var positionOnEllipsoid = Cesium.Cartesian3.fromDegrees(116.3912, 39.920);
    var translateMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid);
    var rotationXMatrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(90.0)));
    var rotationYMatrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(90.0)));
    var scaleMatrix = Cesium.Matrix4.fromScale(dimensions);

    var planeZModelMatrix = new Cesium.Matrix4();
    Cesium.Matrix4.multiply(translateMatrix, scaleMatrix, planeZModelMatrix);

    var planeXModelMatrix = new Cesium.Matrix4();
    Cesium.Matrix4.multiply(translateMatrix, rotationXMatrix, planeXModelMatrix);
    Cesium.Matrix4.multiply(planeXModelMatrix, scaleMatrix, planeXModelMatrix);

    var planeYModelMatrix = new Cesium.Matrix4();
    Cesium.Matrix4.multiply(translateMatrix, rotationYMatrix, planeYModelMatrix);
    Cesium.Matrix4.multiply(planeYModelMatrix, scaleMatrix, planeYModelMatrix);

    // createPlane(planeZModelMatrix, new Cesium.Color(0.0, 0.0, 1.0, 1.0));
    createPlane(planeXModelMatrix, new Cesium.Color(1.0, 0.0, 0.0, 1.0));
    //createPlane(planeYModelMatrix, new Cesium.Color(0.0, 1.0, 0.0, 1.0));

    function createPlane(planeModelMatrix) {
        // 创建平面
        var planeGeometry = new Cesium.PlaneGeometry({
            vertexFormat: Cesium.MaterialAppearance.VERTEX_FORMAT,
        });

        var planeGeometryInstance = new Cesium.GeometryInstance({
            geometry: planeGeometry,
            modelMatrix: planeModelMatrix
        });

        var material = Cesium.Material.fromType('Image');
        material.uniforms.image = vide.value;

        material.shaderSource = `
    uniform vec4 color_2;
    uniform vec2 repeat_1;
    uniform sampler2D image_0;
    czm_material czm_getMaterial(czm_materialInput materialInput)
    {
        czm_material material = czm_getDefaultMaterial(materialInput);
        vec2 st = materialInput.st;
        if(st.s<0.2 || st.s>0.8||st.t<0.2 || st.t>0.8){
            material.diffuse = vec3(1.0,1.0,1.0);
        }else{
            material.diffuse = czm_gammaCorrect(texture(image_0, fract(repeat_1 * materialInput.st)).rgb * color_2.rgb); 
        }
        material.alpha = texture(image_0, fract(repeat_1 * materialInput.st)).a * color_2.a; 
        return material;
    }`


        scene.primitives.add(new Cesium.Primitive({
            geometryInstances: planeGeometryInstance,
            appearance: new Cesium.MaterialAppearance({
                closed: false,
                // translucent: false,
                material: material
            })
        }));
    }

    viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(positionOnEllipsoid, 300000));

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