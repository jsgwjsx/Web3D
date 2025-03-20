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

    const polyline = new Cesium.PolylineGeometry({
        positions: Cesium.Cartesian3.fromDegreesArray([
            110.080842, 45.002073,
            100.91517, 45.002073,
            104.058488, 40.998429,
            109.04798, 40.998429,
            110.080842, 45.002073,
        ]),
        width: 20.0,
        vertexFormat: Cesium.MaterialAppearance.VERTEX_FORMAT
    });
    const geometry = Cesium.PolylineGeometry.createGeometry(polyline);
    const polylineInstance = new Cesium.GeometryInstance({
        geometry: geometry,
        id: 'polyline',
        attributes: {
            color: new Cesium.ColorGeometryInstanceAttribute(0.0, 1.0, 1.0, 1.0)
        }
    });
    const material = new Cesium.Material({
        translucent:true,
        fabric: {
            type: 'rainbow',
            uniforms: {
                u_time: 0.0,
                u_img: '../../../public/Cesium/colors1.png'
            },
            source: `
            uniform sampler2D u_img;
            uniform float u_time;
        czm_material czm_getMaterial(czm_materialInput materialInput){
            czm_material material = czm_getDefaultMaterial(materialInput);
             vec4 imgColor = texture(u_img, fract(vec2(materialInput.st.x + u_time, materialInput.st.y)));
            material.diffuse = vec3(imgColor.rgb);
            vec2 st = materialInput.st;
            material.alpha = imgColor.a;
            return material;
}
        `
        }
    })
   const primitive = viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: polylineInstance,
        appearance: new Cesium.PolylineMaterialAppearance({
            material: material
        }),
        asynchronous: false
    }));
    viewer.camera.setView({
        destination: new Cesium.Cartesian3.fromDegrees(110.080842, 45.002073, 600)
    })
    setInterval(function(){
        primitive.appearance.material.uniforms.u_time += 0.01
    },10)
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