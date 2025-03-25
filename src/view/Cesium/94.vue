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
    async function main() {
        // 添加一个球体作为示例对象
        const entity = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(0, 0, 200000),
            ellipsoid: {
                radii: new Cesium.Cartesian3(
                    200000.0,
                    200000.0,
                    200000.0
                ),
                material: Cesium.Color.RED,
            },
        });

        //添加一个球体作为示例对象
        const entity1 = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(0, 11.1, 200000),
            ellipsoid: {
                radii: new Cesium.Cartesian3(
                    200000.0,
                    200000.0,
                    200000.0
                ),
                material: Cesium.Color.GREEN,
            },
        });

        // 创建发光效果的着色器
        const glowFS = `
    // 输入纹理，包含原始场景渲染结果
    uniform sampler2D colorTexture;
    // 发光颜色
    uniform vec4 glowColor;
    // 发光强度
    uniform float glowIntensity;
    // 发光范围大小
    uniform float glowSize;
    // 纹理坐标输入
    in vec2 v_textureCoordinates;
    void main() {
        // 获取当前像素的颜色
        vec4 color = texture(colorTexture, v_textureCoordinates);
        // 创建发光效果
        vec4 glow = vec4(0.0);
        // 9x9 像素采样，创建模糊发光效果
        for(int i = -4; i <= 4; i++) {
            for(int j = -4; j <= 4; j++) {
                // 计算偏移采样位置
                vec2 offset = vec2(float(i), float(j)) * glowSize;
                // 获取周围像素的颜色
                vec4 neighborColor = texture(colorTexture, v_textureCoordinates + offset);
                // 检查是否是目标颜色（这里检测红色物体）
                if (neighborColor.g < 0.5 && neighborColor.r > 0.5 && neighborColor.b < 0.5) {
                    glow += glowColor;
                }
            }
        }
        // 平均采样点的发光值
        glow /= 81.0; 
        
        // 混合原始颜色和发光效果
        out_FragColor = mix(color, glow, glowIntensity);
    }
`;

        // 创建后处理阶段
        const stage = viewer.scene.postProcessStages.add(
            new Cesium.PostProcessStage({
                fragmentShader: glowFS,
                uniforms: {
                    glowColor: Cesium.Color.WHITE,
                    glowIntensity: 0.6,
                    glowSize: 0.001,
                },
            })
        );

        // 调整相机视角
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(0, 0, 10000000),
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-90.0),
                roll: 0.0,
            },
        });
    }
    main();
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