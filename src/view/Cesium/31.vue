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

    //创建一个中心，所有的模型最后都指向这个中心
    viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: Cesium.EllipsoidGeometry.createGeometry(new Cesium.EllipsoidGeometry({
                radii: new Cesium.Cartesian3(100.0, 100.0, 100.0),
                vertexFormat: Cesium.VertexFormat.POSITION_AND_NORMAL
            })),
            modelMatrix: Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(
                Cesium.Cartesian3.fromDegrees(120, 39)), new Cesium.Cartesian3(0.0, 0.0, 200.0), new Cesium.Matrix4()),
            id: 'ellipsoid',
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.AQUA)
            }
        }),
        appearance: new Cesium.PerInstanceColorAppearance(),
        asynchronous: false
    }));
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(120, 39, 3000),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: Cesium.Math.toRadians(0),
        }
    })

    //添加点击事件
   var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(async function (movement) {
        const result = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
        const position = result;
        const headingPositionRoll = new Cesium.HeadingPitchRoll();
        const fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator(
            "north",
            "west"
        );
        let animations;
        const model = await Cesium.Model.fromGltfAsync({
            url: "../../../public/Cesium/fly.glb",
            modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
                position,
                headingPositionRoll,
                Cesium.Ellipsoid.WGS84,
                fixedFrameTransform,

            ),
            gltfCallback: (gltf) => {
                animations = gltf.animations
                //console.log(animations);


            },
            minimumPixelSize: 128,
            //clampAnimations:false
        });
        model.readyEvent.addEventListener(() => {
            model.activeAnimations.add({
                index: animations.length - 1,
                loop: Cesium.ModelAnimationLoop.REPEAT,
                multiplier: 0.5,
            });
        })
        //重新计算矩阵
        //中心点的位置
        const center = new Cesium.Cartesian3.fromDegrees(120, 39, 20000.0)
        //模型位置
        const pos = position
        //AB方向为Z轴方向
        const AB = new Cesium.Cartesian3()
        Cesium.Cartesian3.subtract(center, pos, AB)
        const Z = new Cesium.Cartesian3()
        Cesium.Cartesian3.normalize(AB, Z)
        //X轴方向由Z和B位置叉乘得到
        const X = new Cesium.Cartesian3()
        const earthCenter = new Cesium.Cartesian3(0, 0, 0)
        const pos1 = new Cesium.Cartesian3()
        Cesium.Cartesian3.subtract(earthCenter, pos, pos1)
        Cesium.Cartesian3.normalize(pos1, pos1)
        Cesium.Cartesian3.cross(pos1, Z, X)
        Cesium.Cartesian3.normalize(X, X)
        //Y轴方向由X和Z叉乘得到
        const Y = new Cesium.Cartesian3()
        Cesium.Cartesian3.cross(X, Z, Y)
        Cesium.Cartesian3.normalize(Y, Y)
        //计算出矩阵(列主序)
        const matrix = new Cesium.Matrix3.fromArray([
            X.x, Y.x, Z.x,
            X.y, Y.y, Z.y,
            X.z, Y.z, Z.z,
        ])
        const m = model.modelMatrix
        Cesium.Matrix4.multiplyByMatrix3(m, matrix, m)
        model.modelMatrix = m


        viewer.scene.primitives.add(model);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
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