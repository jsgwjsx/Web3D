<template>
    <div>
        <div id="map"></div>
    </div>
</template>
<script setup>
import * as Cesium from "cesium";
import { onMounted } from 'vue'
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import {rotatex,rotatey,rotatez} from './util/rotate'

//实例化一个gui对象
let gui = new GUI()
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

    //改变交互界面style属性
    gui.domElement.style.top = '80px'
    gui.domElement.style.right = '20px';
    gui.domElement.style.width = '300px';

    var matrix = {
        x: 0,
        y: 0,
        z: 0,
        RotateX: 0,
        RotateY: 0,
        RotateZ: 0,
    }

    const tileset = Cesium.Cesium3DTileset.fromUrl(
        '../../../public/Cesium/3dtiles/tileset.json',
        {
            maximumScreenSpaceError: 2, //最大的屏幕空间误差
            // modelMatrix: m  //可以在初始化的时候就配置矩阵进行偏移
        }
    );
    tileset.then((tileset) => {
        viewer.scene.primitives.add(tileset);
        viewer.zoomTo(tileset)//跳转到当前对象中
        //也可以在初始化完成后_modelMatrix配置矩阵进行偏移
        //使用gui控制
        let m = Cesium.Matrix4.clone(tileset.modelMatrix);//m为原始矩阵
        const SunShine = gui.addFolder('平移与旋转')
        SunShine.add(matrix, 'y', 0, 1000).onChange((value) => {
            var translation = Cesium.Cartesian3.fromArray([matrix.x, value, matrix.z])
            var m1 = Cesium.Matrix4.fromTranslation(translation)
            tileset.modelMatrix = m1
            m = Cesium.Matrix4.clone(m1)
        })
        SunShine.add(matrix, 'x', 0, 1000).onChange((value) => {
            var translation = Cesium.Cartesian3.fromArray([value, matrix.y, matrix.z])
            var m1 = Cesium.Matrix4.fromTranslation(translation)
            tileset.modelMatrix = m1
            m = Cesium.Matrix4.clone(m1)
        })
        SunShine.add(matrix, 'z', 0, 1000).onChange((value) => {
            var translation = Cesium.Cartesian3.fromArray([matrix.x, matrix.y, value])
            var m1 = Cesium.Matrix4.fromTranslation(translation)
            tileset.modelMatrix = m1
            m = Cesium.Matrix4.clone(m1)
        })
        //旋转的话就比较麻烦了，默认情况下，旋转是围绕原点 (0, 0, 0) 进行的。如果你的模型不在原点附近，旋转后可能会移动到远离相机的位置。
        //因此需要选将模型移动到原点位置，然后旋转，旋转完再移动回来
        
        SunShine.add(matrix, 'RotateX', 0, 360).onChange((value) => {
             rotatex(value,tileset,m)
        })
        SunShine.add(matrix, 'RotateY', 0, 360).onChange((value) => {
            rotatey(value,tileset,m)
        
        })
        SunShine.add(matrix, 'RotateZ', 0, 360).onChange((value) => {
            rotatez(value,tileset,m)
        })
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