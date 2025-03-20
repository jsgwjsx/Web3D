<template>
    <div>
        <div id="map"></div>
    </div>
</template>
<script setup>
import * as Cesium from "cesium";
import { onMounted, ref } from 'vue'
var model;
onMounted(async() => {
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
    const glass = ref(null)
    const detail = ref(null)
    const body = ref(null)
    //加载GLTF模型
    const position = Cesium.Cartesian3.fromDegrees(
        120,
        39.9,
        0
    );
    const headingPositionRoll = new Cesium.HeadingPitchRoll();
    const fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator(
        "north",
        "west"
    );
    const car = await Cesium.Model.fromGltfAsync({
        url: "../../../public/Cesium/ferrari.glb",
        modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
            position,
            headingPositionRoll,
            Cesium.Ellipsoid.WGS84,
            fixedFrameTransform
        ),
        minimumPixelSize: 128,
    });


    let i = 0
    //让轮子转起来
    viewer.clock.onTick.addEventListener((e) => {
        if (model.ready) {
            //拿到四个轮子对旋转矩阵操作让他转起来
            const wheel1 = model.getNode('wheel_fl')
            const wheel2 = model.getNode('wheel_fr')
            const wheel3 = model.getNode('wheel_rr')
            const wheel4 = model.getNode('wheel_rl')
            //console.log(wheel1);
            //让车轮子转
            i -= 0.0005
            const rotate = new Cesium.Matrix3()
            Cesium.Matrix3.fromRotationX(i, rotate)
            const m = wheel1.matrix
            Cesium.Matrix4.multiplyByMatrix3(m, rotate, m)
            wheel1.matrix = m

            const m1 = wheel2.matrix
            Cesium.Matrix4.multiplyByMatrix3(m1, rotate, m1)
            wheel2.matrix = m1
            const m2 = wheel3.matrix
            Cesium.Matrix4.multiplyByMatrix3(m2, rotate, m2)
            wheel3.matrix = m2

            const m3 = wheel4.matrix
            Cesium.Matrix4.multiplyByMatrix3(m3, rotate, m3)
            wheel4.matrix = m3
        }

    });
    model = viewer.scene.primitives.add(car);


    //改材质
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(120.0002, 39.9, 10),
        orientation: {
            heading: Cesium.Math.toRadians(-90),
            pitch: Cesium.Math.toRadians(-30),
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

#body {
    position: absolute;
    left: 2%;
    top: 100px;
    width: 100px;
    height: 30px;
    color: aliceblue;
}
</style>