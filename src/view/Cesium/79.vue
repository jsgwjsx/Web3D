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
    viewer.scene.postProcessStages.fxaa.enabled = true //开启全局着色器

    const scene = viewer.scene;
    scene.globe.depthTestAgainstTerrain = true;
    // 着色器叠加
    // https://www.shadertoy.com/view/mtyGWy
    // http://localhost:8000/Apps/Sandcastle/index.html?src=Fog%20Post%20Process.html&label=All

    viewer.scene.camera.setView({
        destination: new Cesium.Cartesian3(
            1216356.033078094,
            -4736402.278325668,
            4081270.375520902
        ),
        orientation: new Cesium.HeadingPitchRoll(
            0.08033365594766728,
            -0.29519015695063455,
            0.00027759141518046704
        ),
        endTransform: Cesium.Matrix4.IDENTITY,
    });

    const fragmentShaderSource = `
uniform sampler2D colorTexture; 
in vec2 v_textureCoordinates; 

vec3 palette( float t ) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263,0.416,0.557);

    return a + b*cos( 6.28318*(c*t+d) );
}

void main() 
{
    vec2 iResolution = czm_viewport.zw;
    float iTime = czm_frameNumber*0.008;

    vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);
    for (float i = 0.0; i < 4.0; i++) {
        uv = fract(uv * 1.5) - 0.5;
        float d = length(uv) * exp(-length(uv0));
        vec3 col = palette(length(uv0) + i*.4 + iTime*.4);
        d = sin(d*8. + iTime)/8.;
        d = abs(d);
        d = pow(0.01 / d, 1.2);
        finalColor += col * d;
    }
    out_FragColor = vec4(finalColor, 1.0);
    // 场景颜色
    vec4 sceneColor = texture(colorTexture, v_textureCoordinates); 
    // 颜色混合-混合场景颜色和当前效果的颜色
    out_FragColor = mix(out_FragColor,sceneColor,0.9);
}`;

    const ellipsoid = viewer.scene.globe.ellipsoid;
    const postProcessStage = viewer.scene.postProcessStages.add(
        new Cesium.PostProcessStage({
            fragmentShader: fragmentShaderSource,
            uniforms: {
                // fogColor: Cesium.Color.BLACK,
            },
        })
    );
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