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
    // //创建彩虹的圆弧
    // //起始点经纬度和高度
    // const startLon = 121.0
    // const startLat = 36.95
    // //结束点点经纬度和高度
    // const endLon = 121.0
    // const endLat = 37.05
    // //圆心的经纬度
    // const midLon = 121.0
    // const midLat = 37.0
    // //彩虹的半径
    // const R = (endLat - startLat) * 20000


    // const arr = []
    // for (let i = 0; i < 180; i++) {
    //     const radius = Cesium.Math.toRadians(i)
    //     const lon = 121.0
    //     const lat = startLat + (endLat - startLat / 180.0) * i
    //     const height = R * Math.sin(radius)
    //     arr.push(lon, lat, height)
    // }
    //创建彩虹的圆弧
    //起始点经纬度和高度
    const startLon = 121.0
    const startLat = 36.95
    //结束点点经纬度和高度
    const endLon = 121.0
    const endLat = 37.05
    //圆心的经纬度
    const midLon = 121.0
    const midLat = 37.0
    //彩虹的半径
    const R = (endLat - startLat) * 20000
    //根据三个点绘制一个圆弧polyline
    const arr = []
    for (let i = 0; i < 180; i++) {
        //计算角度
        const radius = Cesium.Math.toRadians(i)
        //计算每个点的经纬度和高度
        const lon = 121.0
        const lat = startLat + ((endLat - startLat) / 180.0) * i
        const height = R * Math.sin(radius)
        arr.push(lon, lat, height)
    }
    // const arr = []
    // for (let i = 0; i < 180; i++) {
    //     const radius = Cesium.Math.toRadians(i)
    //     const lon = 121.0
    //     const lat = startLat + (endLat - startLat / 180.0) * i
    //     const height = R * Math.sin(radius)
    //     arr.push(lon, lat, height)
    // }
    const polyline = new Cesium.PolylineGeometry({
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(arr),
        width: 20.0,
        vertexFormat: Cesium.MaterialAppearance.VERTEX_FORMAT
    });
    const geometry = Cesium.PolylineGeometry.createGeometry(polyline);
    const polylineInstance = new Cesium.GeometryInstance({
        geometry: geometry,
        id: 'rectangle',
        attributes: {
            color: new Cesium.ColorGeometryInstanceAttribute(0.0, 1.0, 1.0, 1.0),
        },
    });
    //自定义一个彩虹材质
    const material = new Cesium.Material({
        fabric: {
            type: 'rainbow',
            uniforms: {},
            source: `
        czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;
    if(st.t>=0.0&&st.t<=0.14){
        material.diffuse = vec3(1.0,0.0,0.0);
        }
        else if(st.t>=0.14&&st.t<=0.28){
        material.diffuse = vec3(1.0,0.647,0.0);
        }
        else if(st.t>=0.28&&st.t<=0.42){
        material.diffuse = vec3(1.0,1.0,0.0);
        }
        else if(st.t>=0.42&&st.t<=0.56){
        material.diffuse = vec3(0.0,1.0,0.0);
        }
        else if(st.t>=0.56&&st.t<=0.70){
        material.diffuse = vec3(0.0,1.0,1.0);
        }
        else if(st.t>=0.70&&st.t<=0.84){
        material.diffuse = vec3(0.294,0.0,0.51);
        }
        else{
        material.diffuse = vec3(0.502,0.0,0.502);
    }
         material.alpha = 0.25;

        return material;
        }
        
        `
        }
    })
    viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: polylineInstance,
        appearance: new Cesium.PolylineMaterialAppearance({
            material: material
        }),
        asynchronous: false
    }));
    //设置相机位置
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(120.88, 37, 1000),
        orientation: {
            heading: Cesium.Math.toRadians(90),//相机左右翻转
            pitch: Cesium.Math.toRadians(0),//相机上下翻转，默认-90
                                            //roll相机旋转翻转，相机正前方是x轴
        }
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