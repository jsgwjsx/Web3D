<template>
    <div>
        <div id="map"></div>
    </div>
</template>
<script setup>
import * as Cesium from "cesium";
import { onMounted } from 'vue'
import data from "../Example/Basic_07_06/js/FlyArc/data";
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

    const dataSource = Cesium.GeoJsonDataSource.load('../../../public/Cesium/province.json', {
        stroke: Cesium.Color.GREEN,
        fill: Cesium.Color.RED,
        strokeWidth: 3,
        markerSymbol: '3'
    });
    const pin50 = new Cesium.PinBuilder().fromText("50+", Cesium.Color.BLACK, 48).toDataURL();
    dataSource.then(data => {
        data.clustering.enabled = true;
        data.clustering.pixelRange = 15;
        data.clustering.minimumClusterSize = 3;
        data.clustering.clusterEvent.addEventListener(function (entities, cluster) {
            cluster.label.show = false;
            cluster.billboard.show = true;
            cluster.billboard.id = cluster.label.id;
            cluster.billboard.image = pin50
            cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
        });
        //dataSource.clustering.enabled = true
        const entities = data._entityCollection._entities._array

        entities.forEach(e => {
            const name = e._name
            e._billboard._image._value = new Cesium.PinBuilder().fromText(e.name, Cesium.Color.RED, 100).toDataURL();

            console.log(e);
        })
        viewer.dataSources.add(data)
        viewer.zoomTo(data)

    })
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