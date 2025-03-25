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
    const DashLine = [];
    DashLine.push(
        new Cesium.GeometryInstance({
            geometry: new Cesium.PolylineGeometry({
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                    -75, 38, 250000,
                    -125, 38, 250000
                ]),
                width: 5,
                vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
            }),
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE),
            }
        })
    );
    const oneTypeLinesPrimitive = new Cesium.Primitive({
        geometryInstances: DashLine,
        appearance: new Cesium.PolylineMaterialAppearance({
            material: new Cesium.Material({
                fabric: {
                    uniforms: {
                        animationSpeed: 0.08,
                        color: new Cesium.Color(1.0, 1.0, 0.0, 0.5),
                        gapColor: Cesium.Color.TRANSPARENT,
                        dashLength: 16,
                        dashPattern: 255,
                    },
                    source: `
                uniform vec4 color;
                uniform vec4 gapColor;
                uniform float dashLength;
                uniform float dashPattern;
                in float v_polylineAngle;

                const float maskLength = 16.0;

                mat2 rotate(float rad) {
                    float c = cos(rad);
                    float s = sin(rad);
                    return mat2(
                        c, s,
                        -s, c
                    );
                }

                czm_material czm_getMaterial(czm_materialInput materialInput)
                {
                    czm_material material = czm_getDefaultMaterial(materialInput);

                    vec2 pos = rotate(v_polylineAngle) * gl_FragCoord.xy;

                    // Get the relative position within the dash from 0 to 1
                    float time = czm_frameNumber * animationSpeed;
                float dashPosition = fract(pos.x / (dashLength * czm_pixelRatio)-time);

                    // Figure out the mask index.
                    float maskIndex = floor(dashPosition * maskLength);
                    // Test the bit mask.
                    float maskTest = floor(dashPattern / pow(2.0, maskIndex));
                    vec4 fragColor = (mod(maskTest, 2.0) < 1.0) ? gapColor : color;
                    if (fragColor.a < 0.005) {   // matches 0/255 and 1/255
                        discard;
                    }

                    fragColor = czm_gammaCorrect(fragColor);
                    material.emission = fragColor.rgb;
                    material.alpha = fragColor.a;
                    return material;
                }
                `
                }
            })
        }),
        asynchronous: true
    });
    viewer.scene.primitives.add(oneTypeLinesPrimitive);
    //设置初始位置
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(-75, 38, 5000000)
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