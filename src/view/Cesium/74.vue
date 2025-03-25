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
    var startPosition = Cesium.Cartesian3.fromDegrees(-89.3350, 34.65874, 6000);
    viewer.scene.globe.depthTestAgainstTerrain = true;
    var heading = Cesium.Math.toRadians(2); // Convert to radians
    var pitch = Cesium.Math.toRadians(-30);
    var roll = Cesium.Math.toRadians(0);
    var direction = new Cesium.Matrix3();
    Cesium.Matrix3.fromHeadingPitchRoll(new Cesium.HeadingPitchRoll(heading, pitch, roll), direction);

    // Create a ray from the starting position and direction
    let dir = Cesium.Matrix3.getColumn(direction, 2, new Cesium.Cartesian3());

    //The ray points to the sky, so there is no intersection with the ground,use it
    Cesium.Cartesian3.negate(dir, dir);

    // show direct
    let v = Cesium.Cartesian3.multiplyByScalar(dir, 100000, new Cesium.Cartesian3());
    let endPosition = Cesium.Cartesian3.add(startPosition, v, new Cesium.Cartesian3());
    console.log(dir);

    const redLine = viewer.entities.add({
        name: "Red line on terrain",
        polyline: {
            positions: [startPosition, endPosition],
            width: 15,
            arcType: Cesium.ArcType.NONE,
            material: new Cesium.PolylineArrowMaterialProperty(
                Cesium.Color.RED
            ),
        },
    });

    viewer.zoomTo(redLine);
    const ray = new Cesium.Ray(startPosition, dir);

    // test
    //const ray = new Cesium.Ray(startPosition, new Cesium.Cartesian3(0,0,-100));

    // Get the intersection point with the ground
    //const intersection = Cesium.IntersectionTests.grazingAltitudeLocation(ray, Cesium.Ellipsoid.WGS84);
    const intersection = Cesium.IntersectionTests.rayEllipsoid(ray, viewer.scene.globe.ellipsoid);

    // If there is an intersection with the ground
    if (intersection) {
        console.log(intersection);
        const point = Cesium.Ray.getPoint(ray, intersection.start);
        console.log(point);
        //const intersectionPosition = Cesium.Cartographic.toCartesian(intersection,Cesium.Ellipsoid.WGS84,new Cesium.Cartesian3());
        const groundLatLng = Cesium.Cartographic.fromCartesian(point);
        const groundLat = Cesium.Math.toDegrees(groundLatLng.latitude);
        const groundLng = Cesium.Math.toDegrees(groundLatLng.longitude);
        const groundAlt = groundLatLng.height;

        console.log("Ground intersection point:");
        console.log("Latitude: " + groundLat);
        console.log("Longitude: " + groundLng);
        console.log("Altitude: " + groundAlt);
    } else {
        console.log("No intersection with the ground!");
    }

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