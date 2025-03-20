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

    let itemPosition = Cesium.Cartesian3.fromDegrees(114.00, 40.00, 10);
    function CreateFace(relaMatrix, imageurl) {
        return viewer.scene.primitives.add(new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry:  new Cesium.PlaneGeometry(),
                modelMatrix: relaMatrix,
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED.withAlpha(0.5))
                }
            }),
            asynchronous:false,
            appearance: new Cesium.MaterialAppearance({
                material: new Cesium.Material({
                    fabric: {
                        type: 'Image',
                        uniforms: {
                            image: imageurl
                        }
                    }
                })
            }),
        }));
    }

    let step = 5000;
    let r90 = Cesium.Math.toRadians(90)
    let r180 = Cesium.Math.toRadians(180)

    function CreateCube() {
        let itemPositonMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(itemPosition);
        var scaleMatrix = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(10000.0, 10000.0, 10000.0));

        let mleft = Cesium.Matrix3.multiply(Cesium.Matrix3.fromRotationZ(r180), Cesium.Matrix3.fromRotationX(r90), new Cesium.Matrix3());
        mleft = Cesium.Matrix4.fromRotationTranslation(mleft, new Cesium.Cartesian3(0, step, 0));
        mleft = Cesium.Matrix4.multiply(mleft,scaleMatrix,mleft)
        CreateFace(mleft, "../../../public/Cesium/taiji.jpg").modelMatrix = itemPositonMatrix;

        let mright = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationX(r90), new Cesium.Cartesian3(0, -step, 0));
        mright = Cesium.Matrix4.multiply(mright,scaleMatrix,mright)
        CreateFace(mright, "../../../public/Cesium/taiji.jpg").modelMatrix = itemPositonMatrix;

        let mfront = Cesium.Matrix3.multiply(Cesium.Matrix3.fromRotationZ(r90), Cesium.Matrix3.fromRotationX(r90), new Cesium.Matrix3());
        mfront = Cesium.Matrix4.fromRotationTranslation(mfront, new Cesium.Cartesian3(step, 0, 0));
        mfront = Cesium.Matrix4.multiply(mfront,scaleMatrix,mfront)
        CreateFace(mfront,  "../../../public/Cesium/taiji.jpg").modelMatrix = itemPositonMatrix;

        let mback = Cesium.Matrix3.multiply(Cesium.Matrix3.fromRotationZ(-r90), Cesium.Matrix3.fromRotationX(r90), new Cesium.Matrix3());
        mback = Cesium.Matrix4.fromRotationTranslation(mback, new Cesium.Cartesian3(-step, 0, 0));
        mback = Cesium.Matrix4.multiply(mback,scaleMatrix,mback)
        CreateFace(mback,  "../../../public/Cesium/taiji.jpg").modelMatrix = itemPositonMatrix;
        
        let mup = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.IDENTITY, new Cesium.Cartesian3(0, 0, step));
        mup = Cesium.Matrix4.multiply(mup,scaleMatrix,mup)
        CreateFace(mup, "../../../public/Cesium/taiji.jpg").modelMatrix = itemPositonMatrix;
        let mdn = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationY(r180), new Cesium.Cartesian3(0, 0, -step));
        mdn = Cesium.Matrix4.multiply(mdn,scaleMatrix,mdn)
        CreateFace(mdn,  "../../../public/Cesium/fire.png").modelMatrix = itemPositonMatrix;
    }
    CreateCube();

    viewer.camera.setView({
        destination: itemPosition,
        orientation: {
            heading: 0.04088824215003406,
            pitch: -0.7494321935122481,
            roll: 0.00018513205689796308,
        },
    });

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