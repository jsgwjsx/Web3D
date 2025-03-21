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
    const GlowLineInstances = [];
    GlowLineInstances.push(
        new Cesium.GeometryInstance({
            geometry: new Cesium.PolylineGeometry({
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([-75, 38, 0, -125, 38, 0]),
                width: 20,
                vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
            }),
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE),
            }
        })
    );

    const GlowLinesPrimitive = new Cesium.Primitive({
        geometryInstances: GlowLineInstances,
        appearance: new Cesium.PolylineMaterialAppearance({
            material: new Cesium.Material({
                fabric: {
                    uniforms: {
                        color: new Cesium.Color(1.0, 1.0, 0.0, 0.5),
                        centerColor: Cesium.Color.RED,
                        glowPower: 0.2,
                        taperPower: 0.5,
                    },
                    source: `
                uniform vec4 color;
                uniform float glowPower;
                uniform float taperPower;

                czm_material czm_getMaterial(czm_materialInput materialInput)
                {
                    czm_material material = czm_getDefaultMaterial(materialInput);

                    vec2 st = materialInput.st;
                    float glow = glowPower / abs(st.t - 0.5) - (glowPower / 0.5);
                    vec4 fragColor;
                    float c = step(glow,1.0);
                    fragColor.rgb = centerColor.rgb*c+color.rgb*(1.0-c);

                    fragColor.a = clamp(0.0, 1.0, glow) * color.a;
                    fragColor = czm_gammaCorrect(fragColor);
                    material.emission = fragColor.rgb;
                    material.alpha = fragColor.a;
                    return material;
                }`
                }
            })
        }),
        asynchronous: true
    });
    viewer.scene.primitives.add(GlowLinesPrimitive);
    //设置初始位置
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(-100, 38, 5000000)
    });

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