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
    // 设置时间
    const start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
    const stop = Cesium.JulianDate.addSeconds(start, 12, new Cesium.JulianDate());
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    viewer.clock.multiplier = 1;
    viewer.clock.shouldAnimate = true;
    //viewer.timeline.zoomTo(start, stop);
    // 创建插值
    function createDynamicPt(lonlat1, lonlat2) {
        const pos1 = Cesium.Cartesian3.fromDegrees(lonlat1[0], lonlat1[1]);
        const pos2 = Cesium.Cartesian3.fromDegrees(lonlat2[0], lonlat2[1]);
        const position = new Cesium.SampledPositionProperty();
        position.addSample(start, pos1);
        position.addSample(stop, pos2);
        console.log(position)
        return position;
    }
    // 创建三角形的三个点
    let ptArr = [];
    //三角形的三个点
    ptArr.push(createDynamicPt([-115.0, 37.0], [-115.0, 40.0]));
    ptArr.push(createDynamicPt([-115.0, 32.0], [-118.0, 32.0]));
    ptArr.push(createDynamicPt([-107.0, 33.0], [-107.0, 30.0]));
    console.log(ptArr)
    // 构建形状
    const redPolygon = viewer.entities.add({
        name: "Red polygon on surface",
        polygon: {
            // hierarchy: Cesium.Cartesian3.fromDegreesArray([
            // -115.0,37.0,
            // -115.0,32.0,
            // -107.0,33.0,
            // ]),
            hierarchy: new Cesium.CallbackProperty(function (time, result) {
                let arr = [];
                for (let i = 0; i < ptArr.length; ++i){
                    arr.push(ptArr[i].getValue(time, new Cesium.Cartesian3()));
                }
                console.log(arr)
                // 重点
                return new Cesium.PolygonHierarchy(arr, []);
            }, false),

            material: Cesium.Color.RED,
        },
    });
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