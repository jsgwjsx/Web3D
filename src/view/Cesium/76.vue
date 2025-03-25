<template>
    <div>
        <div id="map"></div>
    </div>
</template>
<script setup>
import * as Cesium from "cesium";
import { onMounted } from 'vue'
onMounted(async() => {
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

    const tileset = Cesium.Cesium3DTileset.fromUrl(
        "../../../public/Cesium/3dtiles/tileset.json",
        {
        customShader: new Cesium.CustomShader({
            lightingModel: Cesium.LightingModel.PBR,
            fragmentShaderText: `
                    // Color tiles by distance to the camera
                    void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
                    {
                        const vec3 w = vec3(0.2125, 0.7154, 0.0721);
                        //原材质的颜色
                        vec3 rgb = material.diffuse;
                        //灰色值, dot()是点乘函数, 即w与RGB分量相乘然和求和, 得到灰度值
                        float luminance = dot(rgb, w);
                        vec3 target = vec3(luminance, luminance, luminance);

                        //0为灰色, 1为原图, 2为饱和度
                        float ut = 0.0;
                        //float ut = 1.0;
                        //float ut = 2.0;

                        material.diffuse = mix(target, rgb, ut);
                    }
                    `,
        }),
    }
    );
    tileset.then((tileset) => {
        viewer.scene.primitives.add(tileset);
        viewer.zoomTo(tileset)//跳转到当前对象中

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