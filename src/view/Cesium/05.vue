<template>
    <div>
        <div id="map"></div>
    </div>
</template>
<script setup>
import * as Cesium from "cesium";
import { onMounted } from 'vue'
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
var gui = new GUI()
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

    //1.setView
    //有两种计算视角方式
    //第一种使用Cartesian3计算
   
    //改变交互界面style属性
    gui.domElement.style.top = '80px'
    gui.domElement.style.right = '20px';
    gui.domElement.style.width = '300px';

    var matrix = {
        x: 20,
        y: 20,
        z: 10000,
        RotateX: 0,
        RotateY: 0,
        RotateZ: 0,
    }
    const SunShine = gui.addFolder('视角控制')
    SunShine.add(matrix, 'y', 0, 1000).onChange((value) => {
        viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(matrix.x,value,matrix.z),//相机位置
        //相机姿态
        orientation: {
            heading: Cesium.Math.toRadians(45.0),//方向
            // pitch:Cesium.Math.toRadians(90.0),
            // roll:0
        }
    })
    })
    SunShine.add(matrix, 'x', 0, 1000).onChange((value) => {
        viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(value,matrix.y,matrix.z),//相机位置
        //相机姿态
        orientation: {
            heading: Cesium.Math.toRadians(45.0),//方向
            // pitch:Cesium.Math.toRadians(90.0),
            // roll:0
        }
    })
    })
    SunShine.add(matrix, 'z', 0, 1000).onChange((value) => {
        viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(matrix.x,matrix.y,value),//相机位置
        //相机姿态
        orientation: {
            heading: Cesium.Math.toRadians(45.0),//方向
            // pitch:Cesium.Math.toRadians(90.0),
            // roll:0
        }
    })
    })
    //旋转的话就比较麻烦了，默认情况下，旋转是围绕原点 (0, 0, 0) 进行的。如果你的模型不在原点附近，旋转后可能会移动到远离相机的位置。
    //因此需要选将模型移动到原点位置，然后旋转，旋转完再移动回来

    SunShine.add(matrix, 'RotateX', 0, 360).onChange((value) => {
        viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(matrix.x,matrix.y,matrix.z),//相机位置
        //相机姿态
        orientation: {
            heading: Cesium.Math.toRadians(matrix.RotateZ),//方向
            pitch:Cesium.Math.toRadians(matrix.RotateY),
            roll:Cesium.Math.toRadians(value)
        }
    })
    })
    SunShine.add(matrix, 'RotateY', 0, 360).onChange((value) => {
        viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(matrix.x,value,matrix.z),//相机位置
        //相机姿态
        orientation: {
            heading: Cesium.Math.toRadians(matrix.RotateZ),//方向
            pitch:Cesium.Math.toRadians(value),
            roll:Cesium.Math.toRadians(matrix.RotateX)
        }
    })

    })
    SunShine.add(matrix, 'RotateZ', 0, 360).onChange((value) => {
        viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(matrix.x,value,matrix.z),//相机位置
        //相机姿态
        orientation: {
            heading: Cesium.Math.toRadians(value),//方向
            pitch:Cesium.Math.toRadians(matrix.RotateY),
            roll:Cesium.Math.toRadians(matrix.RotateX)
        }
    })
    })
    //第二种使用rectangle计算
    // viewer.camera.setView({
    //     destination: Cesium.Rectangle.fromDegrees(0.0, 20.0, 10.0, 30.0),//west, south, east, north
    //     orientation: {
    //         heading: Cesium.Math.toRadians(20.0), // 方向
    //         pitch: Cesium.Math.toRadians(-90.0),// 倾斜角度
    //         roll: 0
    //     }
    // });
    //2.flyto
    // viewer.camera.flyTo({
    //     destination: Cesium.Cartesian3.fromDegrees(116.435314, 39.960521, 15000.0), // 设置位置
    //     orientation: {
    //         heading: Cesium.Math.toRadians(20.0), // 方向
    //         pitch: Cesium.Math.toRadians(-90.0),// 倾斜角度
    //         roll: 0
    //     },
    //     duration: 5, // 设置飞行持续时间，默认会根据距离来计算
    //     complete: function () {
    //         // 到达位置后执行的回调函数
    //     },
    //     cancle: function () {
    //         // 如果取消飞行则会调用此函数
    //     },
    //     pitchAdjustHeight: -90, // 如果摄像机飞越高于该值，则调整俯仰俯仰的俯仰角度，并将地球保持在视口中。
    //     maximumHeight: 5000, // 相机最大飞行高度
    //     flyOverLongitude: 100, // 如果到达目的地有2种方式，设置具体值后会强制选择方向飞过这个经度(这个，很好用)
    // });
    //3.使用lookat
    // var center = Cesium.Cartesian3.fromDegrees(114.44455, 22.0444);//camera视野的中心点坐标
    // var heading = Cesium.Math.toRadians(50.0);
    // var pitch = Cesium.Math.toRadians(-20.0);
    // var range = 10000.0;
    // viewer.camera.lookAt(center, new Cesium.HeadingPitchRange(heading, pitch, range));
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