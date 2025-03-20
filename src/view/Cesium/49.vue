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
    const cylinder = new Cesium.CylinderGeometry({
        length: 800000,
        topRadius: 0,
        bottomRadius: 200000,
        vertexFormat: Cesium.VertexFormat.ALL
    });
    const geometry = Cesium.CylinderGeometry.createGeometry(cylinder);
    const appearance = new Cesium.MaterialAppearance({
        material: new Cesium.Material({
            fabric: {
                type: 'custom',
                uniforms: {
                    R: 0.0
                },
                source: `
                uniform float R;
                czm_material czm_getMaterial(czm_materialInput materialInput)
            {
                czm_material material = czm_getDefaultMaterial(materialInput);
                //拿到UV坐标
                vec2 st = materialInput.st;
                float dis=distance(st,vec2(0.5,0.5));
                if(dis>R){
                material.diffuse = vec3(1.0,1.0,0.1);
                material.alpha = 0.0;
                }
                else{
                material.diffuse = vec3(1.0,0.0,0.1);
                material.alpha = dis;
                }

                //material.alpha = 1.0;
                return material;
            }
                
                `
            }
        }),
        faceForward: true
    })
    const primitive = new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: geometry,
            modelMatrix: Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(
                Cesium.Cartesian3.fromDegrees(121, 37)), new Cesium.Cartesian3(0.0, 0.0, 500000.0), new Cesium.Matrix4()),
            id: 'cylinder',
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.AQUA)
            }
        }),
        appearance: appearance,
        asynchronous: false
    })
   
    // Cesium.Matrix4.multiplyByMatrix3(modelMatrix, MatrixZ, modelMatrix)
    function loop() {
        if (appearance.material.uniforms.R >= 1.0) {
            appearance.material.uniforms.R = 0.0
        }
        appearance.material.uniforms.R += 0.01
        requestAnimationFrame(loop)
    }
    loop()
    viewer.scene.primitives.add(primitive);

    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(110, 37, 2200000),
        orientation: {
            heading: Cesium.Math.toRadians(90),
            pitch: Cesium.Math.toRadians(-60),
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