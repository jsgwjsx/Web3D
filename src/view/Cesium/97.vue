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
        ),
        shouldAnimate:true
    })
    viewer.scene.debugShowFramesPerSecond = true //显示fps
    const viewModel = {
        emissionRate: 200.0,
        gravity: -1200.0,
        minimumParticleLife: 12,
        maximumParticleLife: 12,
        minimumSpeed: 200.0,
        maximumSpeed: 400.0,
        startScale: 1.0,
        endScale: 3.0,
        particleSize: 5.0,
    };
    const emitterModelMatrix = new Cesium.Matrix4();
    const translation = new Cesium.Cartesian3();
    const rotation = new Cesium.Quaternion();
    let hpr = new Cesium.HeadingPitchRoll();
    const trs = new Cesium.TranslationRotationScale();

    function computeEmitterModelMatrix() {
        hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, hpr);
        trs.translation = Cesium.Cartesian3.fromElements(-4.0, 0.0, 1.4, translation);
        trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);

        return Cesium.Matrix4.fromTranslationRotationScale(trs, emitterModelMatrix);
    }
    const gravityScratch = new Cesium.Cartesian3.fromDegrees(114, 30, 400);

    function applyGravity(p, dt) {
        // We need to compute a local up vector for each particle in geocentric space.
        const position = p.position;
        Cesium.Cartesian3.normalize(position, gravityScratch);
        Cesium.Cartesian3.multiplyByScalar(
            gravityScratch,
            viewModel.gravity * dt,
            gravityScratch,
        );
        p.velocity = Cesium.Cartesian3.add(p.velocity, gravityScratch, p.velocity);
    }
    //粒子系统
    viewer.scene.primitives.add(
        new Cesium.ParticleSystem({
            image: "../../../public/Cesium/雪花.png",
            startColor: Cesium.Color.WHITE.withAlpha(1.0),
            endColor: Cesium.Color.WHITE.withAlpha(1.0),

            startScale: viewModel.startScale,
            endScale: viewModel.endScale,

            minimumParticleLife: viewModel.minimumParticleLife,
            maximumParticleLife: viewModel.maximumParticleLife,
            modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(117.16, 32.71, 4000)),
            minimumSpeed: viewModel.minimumSpeed,
            maximumSpeed: viewModel.maximumSpeed,

            imageSize: new Cesium.Cartesian2(
                viewModel.particleSize,
                viewModel.particleSize,
            ),

            emissionRate: viewModel.emissionRate,

            bursts: [
                // these burst will occasionally sync to create a multicolored effect
                new Cesium.ParticleBurst({
                    time: 5.0,
                    minimum: 10,
                    maximum: 100,
                }),
                new Cesium.ParticleBurst({
                    time: 10.0,
                    minimum: 50,
                    maximum: 100,
                }),
                new Cesium.ParticleBurst({
                    time: 15.0,
                    minimum: 200,
                    maximum: 300,
                }),
            ],

            //lifetime: 16000.0,

            emitter: new Cesium.CircleEmitter(40000.0),

            emitterModelMatrix: computeEmitterModelMatrix(),

            updateCallback: applyGravity,
        }),
    );
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(117.16, 32.71, 1000),
        orientation: {
            heading: Cesium.Math.toRadians(20),
            pitch: Cesium.Math.toRadians(-10),
            rool: Cesium.Math.toRadians(0),
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