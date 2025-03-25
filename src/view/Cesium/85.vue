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
        // baseLayer: new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
        //     url: ' http://webrd01.is.autonavi.com/appmaptile?&scale=1&lang=zh_cn&style=8&x={x}&y={y}&z={z}',
        //     minimumLevel: 1,
        //     maximumLevel: 18
        // })
        // )
    })
    viewer.scene.debugShowFramesPerSecond = true //显示fps
    // 视角更改
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
    // 是否支持深度纹理
    if (!viewer.scene.context.depthTexture) {
        window.alert("This browser does not support the fog post process.");
    }

    // 着色器，重点
    const fragmentShaderSource = `
  float getDistance(sampler2D depthTexture, vec2 texCoords) 
  { 
    // 获取深度值，解包，
    float depth = czm_unpackDepth(texture(depthTexture, texCoords)); 
    if (depth == 0.0) { 
        return czm_infinity; 
    } 
    // 为了解决深度值在非线性空间中导致的精度问题，深度值转换回线性空间，也就是从 NDC 空间再转换回相机空间中，转为当前视角的距离
    // https://juejin.cn/post/7295565904406102057
    vec4 eyeCoordinate = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth); 
    return -eyeCoordinate.z / eyeCoordinate.w; 
  } 

  // 线性插值
  float interpolateByDistance(vec4 nearFarScalar, float distance) 
  { 
    float startDistance = nearFarScalar.x; 
    float startValue = nearFarScalar.y; 
    float endDistance = nearFarScalar.z; 
    float endValue = nearFarScalar.w; 
    // 值限制在 0~1之间
    float t = clamp((distance - startDistance) / (endDistance - startDistance), 0.0, 1.0); 
    // 值混合
    return mix(startValue, endValue, t); 
  } 

  // 透明度混合
  vec4 alphaBlend(vec4 sourceColor, vec4 destinationColor) 
  { 
      return sourceColor * vec4(sourceColor.aaa, 1.0) + destinationColor * (1.0 - sourceColor.a); 
  } 

  uniform sampler2D colorTexture; 
  uniform sampler2D depthTexture; 
  uniform vec4 fogByDistance; 
  uniform vec4 fogColor; 
  in vec2 v_textureCoordinates; 
  void main(void) 
  { 
    // 获取距离
    float distance = getDistance(depthTexture, v_textureCoordinates); 
    // 获取场景当前点的像素值
    vec4 sceneColor = texture(colorTexture, v_textureCoordinates); 
    // 插值透明度
    float blendAmount = interpolateByDistance(fogByDistance, distance); 
    // 改掉当前场景的透明度
    vec4 finalFogColor = vec4(fogColor.rgb, fogColor.a * blendAmount); 
    // 和传入的颜色混合
    out_FragColor = alphaBlend(finalFogColor, sceneColor); 
  }
  `;

    const ellipsoid = viewer.scene.globe.ellipsoid;
    const postProcessStage = viewer.scene.postProcessStages.add(
        new Cesium.PostProcessStage({
            fragmentShader: fragmentShaderSource,
            uniforms: {
                fogByDistance: new Cesium.Cartesian4(10, 0.0, 2000, 1.0), // 根据着色器，分析出这四个值分别是  开始距离，开始值，结束距离，结束值
                fogColor: Cesium.Color.WHITE,  // 沙盒里是黑色，效果不好，这里我改成了白色，效果很好
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