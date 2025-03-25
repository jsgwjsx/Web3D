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
    //设置时间
    const beforeStart = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
    const start = Cesium.JulianDate.addSeconds(beforeStart, 1, new Cesium.JulianDate());
    let tmpStart = start.clone();
    const stop = Cesium.JulianDate.addSeconds(start, 120, new Cesium.JulianDate());

    //设置时间
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = beforeStart.clone(); // 当前时间在开始时间之前
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
    viewer.clock.multiplier = 1;
    viewer.clock.shouldAnimate = true;

    // 创建路径的数量,可以设置多条path
    let range = 1;
    //创建线对象
    let lines = {};
    //线的id
    let key = "line";
    //随机id
    function getRandomID() {
        return key + Math.floor((Math.random() * range) + 1);
    }
    //随机位置
    function getRandomLocation() {
        let position = Cesium.Cartesian3.fromDegrees(112 + Math.random(), 26 + Math.random(), 10);
        viewer.entities.add({
            position: position,
            point: {
                pixelSize: 10,
                color: Cesium.Color.YELLOW,
                // disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
        });
        return position;
    }
    //创建我们我们想要数量的线
    for (let i = 1; i <= range; i++) {
        lines[key + i] = new Cesium.SampledPositionProperty();
        viewer.entities.add({
            position: lines[key + i],
            // name: "path",
            path: {
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.1,
                    color: Cesium.Color.YELLOW,
                }),
                leadTime: 0,
                trailTime: 60,
                width: 10,
            },
        });
    }
    let gcount = 1;
    //随着时间改变位置数据实现动态效果
    setInterval(() => {
        tmpStart = Cesium.JulianDate.addSeconds(tmpStart, 1, new Cesium.JulianDate());
        for (let i = 1; i <= range; i++) {
            let id = key + i;
            let position = getRandomLocation();
            lines[id].addSample(tmpStart.clone(), position);
        }
        console.log(lines)
    }, 1000);

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(112.42946289755982, 26.21271461780105, 1000000),
        duration: 0,
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