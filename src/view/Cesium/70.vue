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
    //雷达配置项
    const RadarConfig = {
        minClock: 0.0, //横向
        maxClock: 360.0,
        minCone: 0.0, // 纵向
        maxCone: 90.0,
        radius: 1000.0,
        lon: 118,
        lat: 30,
        height: 100,
        speed: 1, // 旋转速度 ，负值为反方向
    };
    // 最终物体的经纬度
    const baseMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
        Cesium.Cartesian3.fromDegrees(
            RadarConfig.lon,
            RadarConfig.lat,
            RadarConfig.height
        )
    );
    let angle2Radians = Math.PI / 180;
    //拿到起始角度
    function getInitAngle() {
        return RadarConfig.minClock;
    }
    // 旋转速度
    let step = 1;
    function getCurAngle(val) {
        //转到最大值再往回转
        //   let min = RadarConfig.minClock;
        //   let max = RadarConfig.maxClock;
        //   if (val <= min) step =RadarConfig.speed;
        //   else if (val >= max) step = -RadarConfig.speed;
        //一个方向转
        step = RadarConfig.speed;
        return val + step;
    }
    let angle = getInitAngle();
    let positionArr = calcPoints(
        RadarConfig.lon,
        RadarConfig.lat,
        RadarConfig.height,
        RadarConfig.radius,
        angle
    );
    //计算旋转矩阵
    function calcHorizontal(value) {
        let rotate = Cesium.Matrix3.fromRotationZ(value);
        return Cesium.Matrix4.fromRotationTranslation(rotate);
    }
    //计算旋转矩阵
    function caclVertical(value) {
        let rotate = Cesium.Matrix3.fromRotationY(value);
        return Cesium.Matrix4.fromRotationTranslation(rotate);
    }

    function car32carto(car3) {
        let c = Cesium.Cartographic.fromCartesian(car3);
        return {
            lon: Cesium.Math.toDegrees(c.longitude),
            lat: Cesium.Math.toDegrees(c.latitude),
            height: c.height,
        };
    }
    //计算点位置
    function calcPoints(x1, y1, h1, radius, angle) {
        let positionArr1 = [];
        let org = Cesium.Cartesian3.fromDegrees(x1, y1, h1);

        positionArr1.push(org);
        // 水平方向扫描
        let m2 = calcHorizontal(angle * angle2Radians);
        for (let i = RadarConfig.minCone; i <= RadarConfig.maxCone; i += 1) {
            let m1 = caclVertical(Cesium.Math.toRadians(i - 90));
            let result = Cesium.Matrix4.multiplyByPoint(
                m1,
                new Cesium.Cartesian3(radius, 0, 0),
                new Cesium.Cartesian3()
            );
            result = Cesium.Matrix4.multiplyByPoint(
                m2,
                result,
                new Cesium.Cartesian3()
            );
            result = Cesium.Matrix4.multiplyByPoint(
                baseMatrix,
                result,
                new Cesium.Cartesian3()
            );
            positionArr1.push(result);
        }
        return positionArr1;
    }
    //创建雷达,以及扫描的polygon
    viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(
            RadarConfig.lon,
            RadarConfig.lat,
            RadarConfig.height
        ),
        polygon: {
            hierarchy: new Cesium.CallbackProperty(() => {
                angle = getCurAngle(angle);
                positionArr = calcPoints(
                    RadarConfig.lon,
                    RadarConfig.lat,
                    RadarConfig.height,
                    RadarConfig.radius,
                    angle
                );
                return {
                    positions: positionArr,
                };
            }, false),
            perPositionHeight: true,
            material: Cesium.Color.RED.withAlpha(0.8),
            //distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 10.5e6),
        },
        ellipsoid: {
            radii: new Cesium.Cartesian3(
                RadarConfig.radius,
                RadarConfig.radius,
                RadarConfig.radius
            ),
            innerRadii: new Cesium.Cartesian3(1.0, 1.0, 1.0),
            minimumClock: Cesium.Math.toRadians(RadarConfig.minClock),
            maximumClock: Cesium.Math.toRadians(RadarConfig.maxClock),
            minimumCone: Cesium.Math.toRadians(RadarConfig.minCone),
            maximumCone: Cesium.Math.toRadians(RadarConfig.maxCone),
            material: Cesium.Color.RED.withAlpha(0.1),
            outline: true,
        },
    });
    viewer.scene.debugShowFramesPerSecond = true;
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