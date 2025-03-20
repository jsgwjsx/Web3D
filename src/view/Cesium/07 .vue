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

    //Cesium中没有直接提供扇形这个Entity类，如果要绘制扇形，思路也比较简单
    //1.以当前点为圆心，每隔一度计算一个圆弧上的点，如果要精确，也可以细一些
    //2.将所有点放到集合中，使用polygon来构建图形
    function computeCirclularFlight(lon, lat, radius,degree) {
        let Ea = 6378137;      //   赤道半径
        let Eb = 6356725;      // 极半径 
        let positionArr = [];
        positionArr.push(lon);
        positionArr.push(lat);
        //需求正北是0° cesium正东是0°
        for (let i = 0; i <= degree; i++) {
            let dx = radius * Math.sin(i * Math.PI / 180.0);
            let dy = radius * Math.cos(i * Math.PI / 180.0);

            let ec = Eb + (Ea - Eb) * (90.0 - lat) / 90.0;
            let ed = ec * Math.cos(lat * Math.PI / 180);

            let BJD = lon + (dx / ed) * 180.0 / Math.PI;
            let BWD = lat + (dy / ec) * 180.0 / Math.PI;

            positionArr.push(BJD);
            positionArr.push(BWD);
        }
        return positionArr;
    }
    //参数,lon,lat,r,degree
    let positionArr = computeCirclularFlight(-112.210693, 36.0994841, 3000,90)
    var entities =  viewer.entities.add({
        polygon: {
            hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(
                positionArr
            )),
            height: 0.0,
            extrudedHeight: 1000.0,
            outline: true,
            outlineColor: Cesium.Color.WHITE.withAlpha(0.0),
            outlineWidth: 1,
            material: Cesium.Color.WHITE.withAlpha(0.5)
        }
    });
    viewer.zoomTo(entities)
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