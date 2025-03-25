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
    let startPosition = Cesium.Cartesian3.fromDegrees(0, 0, 0);
    viewer.entities.add({
        position: startPosition,
        point: {
            pixelSize: 10,
            color: Cesium.Color.YELLOW,
        },
    });

    let enfPosition = Cesium.Cartesian3.fromDegrees(0, 0.1, 100);
    let itemPt = viewer.entities.add({
        position: enfPosition,
        point: {
            pixelSize: 10,
            color: Cesium.Color.GREEN,
        },
    });

    function GetTargeMM(pointA, pointB) {
        const vecAB = Cesium.Cartesian3.subtract(pointB, pointA, new Cesium.Cartesian3());
        const normalAB = Cesium.Cartesian3.normalize(vecAB, new Cesium.Cartesian3());
        const rotationMatrix3 = Cesium.Transforms.rotationMatrixFromPositionVelocity(pointA, normalAB);
        const modelMatrix4 = Cesium.Matrix4.fromRotationTranslation(rotationMatrix3, pointA);
        return modelMatrix4;
    }
    //获得中间点
    function getMidpoint(startCartesian, endCartesian) {
        const geodesic = new Cesium.EllipsoidGeodesic();
        let startCartographic = Cesium.Cartographic.fromCartesian(startCartesian);
        let endCartographic = Cesium.Cartographic.fromCartesian(endCartesian);
        geodesic.setEndPoints(startCartographic, endCartographic);
        const midpointCartographic = geodesic.interpolateUsingFraction(0.5, new Cesium.Cartographic());
        return {
            midPosition: Cesium.Cartesian3.fromRadians(
                midpointCartographic.longitude,
                midpointCartographic.latitude
            ),
            distance: geodesic.surfaceDistance
        };
    }
    let result = getMidpoint(startPosition, enfPosition);
    let midPosition = result.midPosition;
    let distance = result.distance;

    viewer.entities.add({
        position: midPosition,
        point: {
            pixelSize: 10,
            color: Cesium.Color.RED,
        },
    });

    function addCylinder() {
        //圆锥旋转，默认是朝上的
        var my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(90));
        var rotationY = Cesium.Matrix4.fromRotationTranslation(my);

        let geo = {
            geometry: new Cesium.CylinderGeometry({
                length: distance,
                topRadius: 0.0,
                bottomRadius: 3000.0,
                vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
            }),
            modelMatrix: rotationY,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED.withAlpha(0.5))
            }
        };

        return viewer.scene.primitives.add(new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance(geo),
            appearance: new Cesium.PerInstanceColorAppearance({
                material: new Cesium.Material({
                    fabric: {
                        type: 'Color',
                    }
                })
            }),
        }));
    }

    let item = addCylinder();
    item.modelMatrix = GetTargeMM(midPosition, enfPosition);

    viewer.zoomTo(viewer.entities);

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