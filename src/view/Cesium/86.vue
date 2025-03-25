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
    var lon = 128.055;
    var lat = 0;
    var offset = 5;
    var doubleoffset = offset * 2;

    //设置初始位置
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(lon + offset, lat + offset, 5000000)
    });

    //用primitive方式改写
    var oneTypeLineInstances = [];
    oneTypeLineInstances.push(
        new Cesium.GeometryInstance({
            geometry: new Cesium.PolygonGeometry({
                polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights([
                    lon, lat, 2500,
                    lon + doubleoffset, lat, 2500,
                    lon + doubleoffset, lat + doubleoffset, 2500,
                    lon, lat + doubleoffset, 2500,
                ])),
                vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
            }),
        })
    );
    let f_shader = `
    czm_material czm_getMaterial(czm_materialInput materialInput) { 
        czm_material material = czm_getDefaultMaterial(materialInput);
        vec2 st = materialInput.st;
        vec2 position = -1.0 + 2.0 *st;
        // 动态颜色
        float time = czm_frameNumber * animationSpeed;
        float r = abs( cos( position.x * position.y + time / 5.0 ) );
        float g = abs( sin( position.x * position.y + time / 4.0 ) );
        float b = abs( cos( position.x * position.y + time / 3.0 ) );
        material.diffuse = vec3( r, g, b);

        // 渐变
        float width = gradientwidth;
        material.alpha = 1.0;
        // 横向
        if(st.s < width)
            material.alpha *= st.s/width;
        else if(st.s > 1.0-width)
            material.alpha *= (1.0-st.s)/width;

        // 纵向
        if(st.t < width)
            material.alpha *= st.t/width;
        else if(st.t > 1.0-width)
            material.alpha *= (1.0-st.t)/width;

        return material;
    }
`;
    const oneTypeLinesPrimitive = new Cesium.Primitive({
        geometryInstances: oneTypeLineInstances,
        appearance: new Cesium.MaterialAppearance({
            material: new Cesium.Material({
                fabric: {
                    uniforms: {
                        // 动效速度
                        animationSpeed: 0.1,
                        // 渐变宽度
                        gradientwidth: 0.2
                    },
                    source: f_shader,
                }
            })
        }),
        asynchronous: true
    });
    viewer.scene.primitives.add(oneTypeLinesPrimitive);

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