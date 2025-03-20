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
    //通过entity添加
    var redBox = viewer.entities.add({
        name: 'Red box',
        position: Cesium.Cartesian3.fromDegrees(-107.0, 40.0, 300000.0),//box位置(经纬度＋高)
        box: {
            //box长宽高
            dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
            material: Cesium.Color.RED.withAlpha(0.5),
            outline: true,
            outlineColor: Cesium.Color.BLACK
        },
        description: `
<img\
  width="50{ac3c4da2cd0600a7fb5dd7ece3d30a0eed29da11cf2830143610191d982c65a1}"
  style="float:left; margin: 0 1em 1em 0;"
  src="../../../public/Cesium/a.jpg"/>
<p>
  Wyoming is a state in the mountain region of the Western 
  United States.
</p>
<p>
  Wyoming is the 10th most extensive, but the least populous 
  and the second least densely populated of the 50 United 
  States. The western two thirds of the state is covered mostly 
  with the mountain ranges and rangelands in the foothills of 
  the eastern Rocky Mountains, while the eastern third of the 
  state is high elevation prairie known as the High Plains. 
  Cheyenne is the capital and the most populous city in Wyoming, 
  with a population estimate of 62,448 in 2013.
</p>
<p>
  Source: 
  <a style="color: WHITE"
    target="_blank"\
    href="http://en.wikipedia.org/wiki/Wyoming">Wikpedia</a>
</p>`
    })
    viewer.zoomTo(redBox)
    viewer.scene.debugShowFramesPerSecond = true //显示fps

    // //通过CZML添加形状
    // var czml = [{
    //     "id": "document",
    //     "name": "box",
    //     "version": "1.0"
    // }, {
    //     "id": "shape2",
    //     "name": "Red box with black outline",
    //     "position": {
    //         "cartographicDegrees": [-107.0, 40.0, 300000.0]
    //     },
    //     "box": {
    //         "dimensions": {
    //             "cartesian": [400000.0, 300000.0, 500000.0]
    //         },
    //         "material": {
    //             "solidColor": {
    //                 "color": {
    //                     "rgba": [255, 0, 0, 128]
    //                 }
    //             }
    //         },
    //         "outline": true,
    //         "outlineColor": {
    //             "rgba": [0, 0, 0, 255]
    //         }
    //     }
    // }];
    // //CzmlDataSource加载一个Czml为entity并存入到一个dataSource中
    // var dataSourcePromise = Cesium.CzmlDataSource.load(czml);
    // viewer.dataSources.add(dataSourcePromise);
    // viewer.zoomTo(dataSourcePromise);


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