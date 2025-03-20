<template>
    <div>
        <div id="map"></div>
    </div>
</template>
<script setup>
import * as Cesium from "cesium";
import { onMounted } from 'vue'
let lon = 119;
let lat = 39;
let distance = 0;
function extrude(viewer) {
    viewer.entities.removeById('point1')
    viewer.entities.removeById('point2')
    viewer.entities.removeById('point3')
    viewer.entities.removeById('point4')
    viewer.entities.removeById('secondFace')
    const start = Cesium.Cartesian3.fromDegrees(120, 40.2, 0)
    const end = Cesium.Cartesian3.fromDegrees(lon, lat, 0)
    console.log(start, end);
    const dir = new Cesium.Cartesian3()
    Cesium.Cartesian3.subtract(end.clone(), start.clone(), dir)
    Cesium.Cartesian3.normalize(dir, dir)
    //根据经纬度获得方向创建射线
    const ray = new Cesium.Ray(new Cesium.Cartesian3.fromDegrees(120, 40.2, 0), dir.clone())
    const ray1 = new Cesium.Ray(new Cesium.Cartesian3.fromDegrees(119.9, 40.2, 0), dir.clone())
    const ray2 = new Cesium.Ray(new Cesium.Cartesian3.fromDegrees(120, 40.2, 4000), dir.clone())
    const ray3 = new Cesium.Ray(new Cesium.Cartesian3.fromDegrees(119.9, 40.2, 4000), dir.clone())
    //根据射线获得点
    const res = new Cesium.Cartesian3()
    const res1 = new Cesium.Cartesian3()
    const res2 = new Cesium.Cartesian3()
    const res3 = new Cesium.Cartesian3()
    Cesium.Ray.getPoint(ray, distance * 500, res);
    Cesium.Ray.getPoint(ray1, distance * 500, res1);
    Cesium.Ray.getPoint(ray2, distance * 500, res2);
    Cesium.Ray.getPoint(ray3, distance * 500, res3);
    //创建四个点
    viewer.entities.add({
        id: 'point1',
        position: res,
        point: {
            pixelSize: 20,
            outlineColor: Cesium.Color.RED,
            outlineWidth: 5
        }
    })
    viewer.entities.add({
        id: 'point2',
        position: res1,
        point: {
            pixelSize: 20,
            outlineColor: Cesium.Color.RED,
            outlineWidth: 5
        }
    })
    viewer.entities.add({
        id: 'point3',
        position: res2,
        point: {
            pixelSize: 20,
            outlineColor: Cesium.Color.RED,
            outlineWidth: 5
        }
    })
    viewer.entities.add({
        id: 'point4',
        position: res3,
        point: {
            pixelSize: 20,
            outlineColor: Cesium.Color.RED,
            outlineWidth: 5
        }
    })
    //创建拉伸几何体
    viewer.entities.add({
        id: 'secondFace',
        polygon: {
            hierarchy: [res, res1, Cesium.Cartesian3.fromDegrees(119.9, 40.2, 0), Cesium.Cartesian3.fromDegrees(120, 40.2, 0)],
            material: Cesium.Color.RED.withAlpha(0.2),
            extrudedHeight: 0,
            height: 4000
        }
    })
}
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
    //四个点的坐标
    const pos1 = Cesium.Cartesian3.fromDegrees(120, 40.2, 0)
    const pos2 = Cesium.Cartesian3.fromDegrees(119.9, 40.2, 0)
    const pos3 = Cesium.Cartesian3.fromDegrees(120, 40.2, 4000)
    const pos4 = Cesium.Cartesian3.fromDegrees(119.9, 40.2, 4000)
    //创建四个点
    viewer.entities.add({
        position: pos1,
        point: {
            pixelSize: 20,
            outlineColor: Cesium.Color.RED,
            outlineWidth: 5
        }
    })
    viewer.entities.add({
        position: pos2,
        point: {
            pixelSize: 20,
            outlineColor: Cesium.Color.RED,
            outlineWidth: 5
        }
    })
    viewer.entities.add({
        position: pos3,
        point: {
            pixelSize: 20,
            outlineColor: Cesium.Color.RED,
            outlineWidth: 5
        }
    })
    viewer.entities.add({
        position: pos4,
        point: {
            pixelSize: 20,
            outlineColor: Cesium.Color.RED,
            outlineWidth: 5
        }
    })
    //四个点创建一个面
    viewer.entities.add({
        id: 'firstFace',
        polygon: {
            hierarchy: new Cesium.Cartesian3.fromDegreesArrayHeights([120, 40.2, 0, 119.9, 40.2, 0, 120, 40.2, 4000, 119.9, 40.2, 0, 120, 40.2, 4000, 119.9, 40.2, 4000]),
            material: Cesium.Color.RED.withAlpha(0.2),
            extrudedHeight: 0,
            height: 4000
        }
    })

    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(120, 39.9, 20000),
        orientation: {
            heading: Cesium.Math.toRadians(-0),
            pitch: Cesium.Math.toRadians(-20),
            roll: Cesium.Math.toRadians(0),
        }
    })
    extrude(viewer)

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