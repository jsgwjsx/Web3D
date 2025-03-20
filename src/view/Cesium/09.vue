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
    //简单来说就加载数据->根据数据生成一张渐变的图，canvas画布->将图赋值到纹理上
    //两种写法
    //1.一种是简写，可以直接给entity.物体.material添加canvas2d对象，
    //添加物体
    // var redWall = viewer.entities.add({
    //     name: 'Red wall at height',
    //     wall: {
    //         positions: Cesium.Cartesian3.fromDegreesArrayHeights([
    //             121.444409, 31.247417, 200.0,
    //             121.533521, 31.235685, 200.0,
    //             121.563273, 31.190347, 200.0,
    //             121.546744, 31.194054, 200.0,
    //             121.516705, 31.191459, 200.0,
    //             121.502188, 31.203074, 200.0
    //         ]),
    //         minimumHeights: [3000.0, 2000.0, 2000, 2000, 2000, 3000],
    //         material: getColorRamp([0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0], true)
    //     }
    // });
    //2.但是如果要设计图片为透明的，此时就不能简写了，需要借助imageMaterialProperty
    var redWall = viewer.entities.add({
        name: 'Red wall at height',
        position:new Cesium.Cartesian3.fromDegrees(-107.0, 40.0, 30000.0),
        box:{
            dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
            material:new Cesium.ImageMaterialProperty({
                image:getColorRamp([0.0,0.045,0.1,0.15,0.37,0.54,1.0],true),
                transparent:true
            }),
            outline: true,
            outlineColor: Cesium.Color.BLACK
        }
        // wall: {
        //     positions: Cesium.Cartesian3.fromDegreesArrayHeights([
        //         121.444409, 31.247417, 200.0,
        //         121.533521, 31.235685, 200.0,
        //         121.563273, 31.190347, 200.0,
        //         121.546744, 31.194054, 200.0,
        //         121.516705, 31.191459, 200.0,
        //         121.502188, 31.203074, 200.0,
        //     ]),
        //     minimumHeights: [3000.0, 2000.0, 2000, 2000, 2000, 3000],
        //     material: new Cesium.ImageMaterialProperty({
        //         image:getColorRamp([0.0,0.045,0.1,0.15,0.37,0.54,1.0],true),
        //         transparent:true
        //     })
        // }
    });
    viewer.zoomTo(redWall)
    //纹理图绘制
    function getColorRamp(elevationRamp) {
        var ramp = document.createElement('canvas');
        ramp.width = 1;
        ramp.height = 100;
        var ctx = ramp.getContext('2d');

        var values = elevationRamp;
        var grd = ctx.createLinearGradient(0, 0, 0, 100);
        grd.addColorStop(values[0], '#000000'); //black
        grd.addColorStop(values[1], '#2747E0'); //blue
        grd.addColorStop(values[2], '#D33B7D'); //pink
        grd.addColorStop(values[3], '#D33038'); //red
        grd.addColorStop(values[4], '#FF9742'); //orange
        grd.addColorStop(values[5], 'transparent'); //yellow
        grd.addColorStop(values[6], '#ffffff'); //white

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 1, 100);
        return ramp;
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