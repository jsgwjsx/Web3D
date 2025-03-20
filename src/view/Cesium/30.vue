<template>
    <div>
        <div id="map"></div>
    </div>
</template>
<script setup>
import * as Cesium from "cesium";
import { onMounted } from 'vue'
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

//实例化一个gui对象
let gui = new GUI()
onMounted(async () => {
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
        // baseLayer: new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
        //     url: ' http://webrd01.is.autonavi.com/appmaptile?&scale=1&lang=zh_cn&style=8&x={x}&y={y}&z={z}',
        //     minimumLevel: 1,
        //     maximumLevel: 18
        // })
        // )
        shouldAnimate: true
    })
    viewer.scene.debugShowFramesPerSecond = true //显示fps
    //用entity创建模型
    viewer.entities.add({
        id: 'model',
        orientation: Cesium.Quaternion.fromHeadingPitchRoll(new Cesium.HeadingPitchRoll(0, 0, 0)),
        position: Cesium.Cartesian3.fromDegrees(120, 39.9, 3),
        model: {
            uri: '../../../public/Cesium/轿车.glb',
            scale: 0.1,
            nodeTransformations: {
                '后备箱': new Cesium.NodeTransformationProperty({
                  //  translation: new Cesium.Cartesian3(100, 2, 0)
                })
            }
        }
    })

    //使用primitive创建模型
    const position = Cesium.Cartesian3.fromDegrees(
        120, 39.8996, 3
    );
    const headingPositionRoll = new Cesium.HeadingPitchRoll();
    const fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator(
        "north",
        "west"
    );
    let animations;
    var model = await Cesium.Model.fromGltfAsync({
        url: "../../../public/Cesium/无人机居中.glb",
        modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
            position,
            headingPositionRoll,
            Cesium.Ellipsoid.WGS84,
            fixedFrameTransform,
        ),
        gltfCallback: (gltf) => {
            animations = gltf.animations
        },
        //minimumPixelSize: 128,
        //clampAnimations:false
    });
    model.readyEvent.addEventListener(() => {
        model.activeAnimations.add({
            index: animations.length - 1,
            loop: Cesium.ModelAnimationLoop.REPEAT,
            multiplier: 0.5,
        });
    })
    viewer.scene.primitives.add(model);
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(120, 39.9, 200),
        orientation: {
            heading: Cesium.Math.toRadians(-30),
            pitch: Cesium.Math.toRadians(-100),
            roll: Cesium.Math.toRadians(0),
        }
    })

    //改变交互界面style属性
    gui.domElement.style.top = '80px'
    gui.domElement.style.right = '20px';
    gui.domElement.style.width = '300px';

    var matrix = {
        modelRotateX: 0,
        modelRotateY: 0,
        modelRotateZ: 0,
        primitesRotateX: 0,
        primitesRotateY: 0,
        primitesRotateZ: 0,
        EntityS: 0
    }
    const Rotate = gui.addFolder('旋转')
    Rotate.add(matrix, 'modelRotateX', 0, 360).onChange((value) => {
        const model = viewer.entities.getById('model')
        model.orientation  = Cesium.Quaternion.fromHeadingPitchRoll(new Cesium.HeadingPitchRoll(value,matrix.modelRotateY,matrix.modelRotateZ))
    })
    Rotate.add(matrix, 'modelRotateY', 0, 360).onChange((value) => {
        const model = viewer.entities.getById('model')
        model.orientation  = Cesium.Quaternion.fromHeadingPitchRoll(new Cesium.HeadingPitchRoll(matrix.modelRotateX,value,matrix.modelRotateZ))
    })
    Rotate.add(matrix, 'modelRotateZ', 0, 360).onChange((value) => {
        const model = viewer.entities.getById('model')
        model.orientation  = Cesium.Quaternion.fromHeadingPitchRoll(new Cesium.HeadingPitchRoll(matrix.modelRotateX,matrix.modelRotateY,value))
    })
    Rotate.add(matrix, 'EntityS', 0, 360).onChange((value) => {
        const model = viewer.entities.getById('model')
        const s = '_' + model._model.nodeTransformations._propertyNames[0]
        model._model.nodeTransformations[s] = new Cesium.NodeTransformationProperty({
          //  translation: new Cesium.Cartesian3(100, 2, 0),
            rotation: Cesium.Quaternion.fromHeadingPitchRoll(new Cesium.HeadingPitchRoll(value,matrix.modelRotateY,matrix.modelRotateZ))
        })
    })
    let modelMatrix = model.modelMatrix
    Rotate.add(matrix, 'primitesRotateX', 0, 360).onChange((value) => {

        let Matrix = Cesium.Matrix3.fromRotationX(value)
        //把旋转矩阵乘到模型矩阵上
        model.modelMatrix = Cesium.Matrix4.multiplyByMatrix3(modelMatrix, Matrix, modelMatrix)
    })
    Rotate.add(matrix, 'primitesRotateY', 0, 360).onChange((value) => {
        //获得三维旋转矩阵
        let Matrix = Cesium.Matrix3.fromRotationY(value)
        //把旋转矩阵乘到模型矩阵上
        model.modelMatrix = Cesium.Matrix4.multiplyByMatrix3(modelMatrix, Matrix, modelMatrix)
    })
    Rotate.add(matrix, 'primitesRotateZ', 0, 360).onChange((value) => {

        //获得三维旋转矩阵
        let Matrix = Cesium.Matrix3.fromRotationZ(value)
        //把旋转矩阵乘到模型矩阵上
        model.modelMatrix = Cesium.Matrix4.multiplyByMatrix3(modelMatrix, Matrix, modelMatrix)
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