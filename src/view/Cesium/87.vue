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
    var geometry = Cesium.BoxGeometry.fromDimensions({
        vertexFormat: Cesium.VertexFormat.POSITION_AND_NORMAL,
        dimensions: new Cesium.Cartesian3(20.0, 15.0, 10.0),
    });

    var instance = new Cesium.GeometryInstance({
        geometry: geometry,
        modelMatrix: Cesium.Matrix4.multiplyByTranslation(
            Cesium.Transforms.eastNorthUpToFixedFrame(
                Cesium.Cartesian3.fromDegrees(
                    124.21936679679918,
                    45.85136872098397
                )
            ),
            new Cesium.Cartesian3(0.0, 0.0, 80.0),
            new Cesium.Matrix4()
        ),
        id: "lsh",
    });

    var material = new Cesium.Material({
        fabric: {
            uniforms: {
                u_time: 0.0
            }
        },
        translucent: true //开关双面渲染
    });
    // const aper = new Cesium.MaterialAppearance({
    //     fragmentShaderSource: ` 
    //         in vec3 wc_p;
    //         void main()
    //         {
    //             //vec3 wc_p_lxs = (wc_p/vec3(10.0,7.5,5.0)+1.0)/2.0; // 计算三维坐标  类似二维 st
    //             // float lxs_z = fract(wc_p_lxs.z - u_time_0);   // x,y,z 三个方向
    //             //float dis = distance(wc_p_lxs,vec3(0.0));
    //             // float dis = length(wc_p_lxs);
    //             //float a = 1.0;
    //             vec3 c=vec3(wc_p);
    //             vec3 c1=vec3(distance(vec3(0.0),c));
    //             out_FragColor = vec4(c,1.0);
    //         }`,
    //     vertexShaderSource: `
    //         in vec3 position3DHigh;
    //         in vec3 position3DLow;
    //         in vec3 normal;
    //         in vec2 st;
    //         in float batchId;
    //         out vec3 wc_p;
    //         void main()
    //         {   
    //             vec4 p = czm_computePosition();  //世界坐标
    //             wc_p = position3DHigh+position3DLow;
    //             vec3 cameraPos = czm_encodedCameraPositionMCHigh + czm_encodedCameraPositionMCLow;
    //             gl_Position = czm_modelViewProjectionRelativeToEye * p;
    //         }`,
    //     closed: false
    // });


    const aper = new Cesium.MaterialAppearance({
        fragmentShaderSource: ` 
            in vec3 wc_p;
            void main()
            {
                vec3 wc_p_lxs = (wc_p/vec3(10.0,7.5,5.0)+1.0)/2.0; // 计算三维坐标  类似二维 st
                float lxs_z = fract(wc_p_lxs.z - u_time_0);   // x,y,z 三个方向
                out_FragColor = vec4(vec3(0.,0.5,.9),lxs_z);
            }`,
        vertexShaderSource: `
            in vec3 position3DHigh;
            in vec3 position3DLow;
            in vec3 normal;
            in vec2 st;
            in float batchId;
            out vec3 wc_p;
            void main()
            {    

                vec3 cameraPos = czm_encodedCameraPositionMCHigh + czm_encodedCameraPositionMCLow;
                vec4 p = czm_computePosition();  //世界坐标
                wc_p = position3DHigh + position3DLow;
                gl_Position = czm_modelViewProjectionRelativeToEye * p;
            }`,
        closed: false
    });


    // const aper = new Cesium.MaterialAppearance({
    //     fragmentShaderSource: ` 
    //     in vec3 wc_p;
    //     void main()
    //     {
    //         vec3 wc_p_lxs = (wc_p/vec3(10.0,7.5,5.0)+1.0)/2.0; // 计算三维坐标  类似二维 st
    //         float lxs_z = fract(wc_p_lxs.z - u_time_0);   // x,y,z 三个方向
    //         out_FragColor = vec4(vec3(0.,0.5,.9),lxs_z);
    //     }`,
    //     vertexShaderSource: `
    //    in vec3 position3DHigh;
    //    in vec3 position3DLow;
    //    in vec3 normal;
    //    in vec2 st;
    //    in float batchId;
    //     out vec3 wc_p;
    //     void main()
    //     {    
    //         wc_p = position3DHigh + position3DLow;
    //         vec3 cameraPos = czm_encodedCameraPositionMCHigh + czm_encodedCameraPositionMCLow;
    //         vec4 p = czm_computePosition();  //世界坐标
    //         gl_Position = czm_modelViewProjectionRelativeToEye * p;
    //     }`,
    //     closed: false
    // });

    const lxs = viewer.scene.primitives.add(
        new Cesium.Primitive({
            geometryInstances: instance,
            appearance: aper,
            asynchronous: true,
        })
    );
    lxs.appearance.material = material;



    viewer.camera.lookAt(new Cesium.Cartesian3.fromDegrees(124.21936679679918,
        45.85136872098397, 80), new Cesium.Cartesian3(-115, 12, 0));
    viewer.scene.preRender.addEventListener(function (s, t) {
        var elaspTime = Cesium.JulianDate.now().secondsOfDay / 1.0;
        lxs.appearance.material.uniforms.u_time = elaspTime;
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