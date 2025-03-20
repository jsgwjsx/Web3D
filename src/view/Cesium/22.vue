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
    //自己做选中效果
    let svgitem = document.getElementsByClassName('cesium-selection-wrapper')[0]
    console.log(svgitem)
    svgitem.innerHTML = '<svg t="1741774757756" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5011" width="128" height="128"><path d="M725.725 527.476c0 122.054-98.994 221.050-221.050 221.050-122.054 0-220.941-98.994-220.941-221.050 0-122.054 98.887-221.050 220.941-221.050 122.054 0 221.050 98.994 221.050 221.050z" fill="#1296db" p-id="5012"></path><path d="M504.721 121.757c-223.731 0-405.74 182.009-405.74 405.74s182.009 405.74 405.74 405.74c223.731 0 405.74-182.009 405.74-405.74 0-223.731-182.009-405.74-405.74-405.74M504.721 993.296c-98.243 0-189.516-30.567-264.807-82.8-85.909-59.525-150.903-147.259-181.579-249.793-12.656-42.257-19.412-86.981-19.412-133.206 0-78.403 19.412-152.3 53.733-217.187 34.428-64.887 83.658-120.767 143.184-163.025 75.935-53.948 168.816-85.589 268.884-85.589 83.013 0 161.095 21.772 228.665 60.062 85.482 48.37 154.337 123.019 195.309 212.897 26.919 58.775 41.828 124.094 41.828 192.839 0 91.595-26.599 177.183-72.503 249.363-42.686 67.141-102.107 122.591-172.247 160.558-65.853 35.609-141.145 55.879-221.050 55.879z" fill="#1296db" p-id="5013"></path></svg>'
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