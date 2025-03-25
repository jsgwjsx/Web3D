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
    const scene = viewer.scene;
    scene.globe.depthTestAgainstTerrain = true;
    // 构建视锥体
    // viewer.extend(Cesium.viewerCesiumInspectorMixin);
    const frustum = new Cesium.PerspectiveFrustum({
        fov: Cesium.Math.PI_OVER_THREE,  // 视场角
        // aspectRatio : canvas.clientWidth / canvas.clientHeight,
        aspectRatio: 2,  // 长宽比
        near: 10.0,
        far: 1000.0      // 远平面距离
    });
    let Matrix3 = Cesium.Matrix3;
    let Quaternion = Cesium.Quaternion;
    let Cartesian3 = Cesium.Cartesian3;
    let camera = viewer.scene.camera;

    const position = Cesium.Cartesian3.fromDegrees(-105.0, 45.0, 1200);      // 中心点位
    const direction = new Cartesian3(-0.10668226241650887, 0.8103322335050215, -0.5761775474872814); // 视角前方向
    const up = new Cartesian3(-0.07520626131620274, 0.5712482686952298, 0.8173245584047634);         // 上方向
    let right = new Cartesian3(0.9914448613738105, 0.13052619222005152, 0);
    right = Cartesian3.negate(right, new Cartesian3());
    const rotation = new Matrix3();
    Matrix3.setColumn(rotation, 0, right, rotation);
    Matrix3.setColumn(rotation, 1, up, rotation);
    Matrix3.setColumn(rotation, 2, direction, rotation);
    const orientation = Quaternion.fromRotationMatrix(
        rotation,
        new Quaternion()
    );
    let geo = new Cesium.FrustumOutlineGeometry({
        origin: position,
        orientation: orientation,
        frustum: frustum,
    });
    scene.primitives.add(
        new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: geo,
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                        Cesium.Color.RED.withAlpha(0.5)
                    ),
                }
            }),
            appearance: new Cesium.PerInstanceColorAppearance({
                translucent: true,
                flat: true,
            }),
            asynchronous: false,
        })
    );
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-105.0, 45.0, 5000.0),
        duration: 0.1
    });

    function AddPoint(pos, txt = "") {
        viewer.entities.add({
            position: pos,
            point: {
                pixelSize: 10,
                color: Cesium.Color.YELLOW,
            },
            label: {
                text: txt,
            },
        });
    }

    // 计算各个点位
    AddPoint(position);
    let frontDirect = Cartesian3.multiplyByScalar(direction, frustum.far, new Cesium.Cartesian3());
    let bottomCenter = Cartesian3.add(position, frontDirect, new Cesium.Cartesian3());
    AddPoint(bottomCenter, "bottomCenter");

    let rightLength = frustum.far * Math.tan(frustum.fov / 2);
    let rightDirect = Cartesian3.multiplyByScalar(right, rightLength, new Cesium.Cartesian3());
    let rightCenter = Cartesian3.add(bottomCenter, rightDirect, new Cesium.Cartesian3());
    AddPoint(rightCenter, "rightCenter");

    let upLength = rightLength / frustum.aspectRatio;
    let upDirect = Cartesian3.multiplyByScalar(up, upLength, new Cesium.Cartesian3());
    let upRightPt = Cartesian3.add(rightCenter, upDirect, new Cesium.Cartesian3());
    AddPoint(upRightPt, "upRightPt");

    let downRightPt = Cartesian3.subtract(rightCenter, upDirect, new Cesium.Cartesian3());
    AddPoint(downRightPt, "downRightPt");

    let leftCenter = Cartesian3.subtract(bottomCenter, rightDirect, new Cesium.Cartesian3());
    AddPoint(leftCenter, "leftCenter");

    let upLeftPt = Cartesian3.add(leftCenter, upDirect, new Cesium.Cartesian3());
    AddPoint(upLeftPt, "upLeftPt");

    let downLeftPt = Cartesian3.subtract(leftCenter, upDirect, new Cesium.Cartesian3());
    AddPoint(downLeftPt, "downLeftPt");

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