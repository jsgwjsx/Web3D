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

    })

    //设置鹰眼中球的属性
    viewer.scene.debugShowFramesPerSecond = true //显示fps
    var i = 0
    var intervaltime = 100;//间隔
    var redTube = viewer.entities.add({
        name: 'Red tube with rounded corners',
        polylineVolume: {
            positions: Cesium.Cartesian3.fromDegreesArray([-85.0, 32.0, -85.0, 36.0, -89.0, 36.0]),
            shape: computeCircle(6000.0),
            //颜色回调
            material: new Cesium.ColorMaterialProperty(new Cesium.CallbackProperty(function () {
                i+=1;
                i=i%intervaltime
                return Cesium.Color.RED.withAlpha(i/intervaltime)

            }, false))
        }
    });
    function computeCircle(radius) {
            var positions = [];
            for (var i = 0; i < 360; i++) {
                var radians = Cesium.Math.toRadians(i);
                positions.push(new Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
            }
            return positions;
        }
    viewer.zoomTo(redTube)
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