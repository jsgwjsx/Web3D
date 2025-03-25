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
    let m1 = Cesium.Transforms.eastNorthUpToFixedFrame(viewer.scene.globe.ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(-100.0, 40.0)));
    Cesium.Matrix4.multiplyByTranslation(m1, new Cesium.Cartesian3(0.0, 0.0, 20.0), m1);
    let modelMatrix = Cesium.Matrix4.multiplyByUniformScale(m1, 1.0, m1);
    /*
        这里只加了上下两排点
    */
    let segCount = 150; // 每排横向分段数，段数越多，曲面效果越好
    let height = 10.0;  // 旗帜宽
    let width = 15.0;   // 旗帜高
    let pts = [];
    let uvs = [];
    let nms = [];
    let step = width / segCount;
    let uvstep = 1.0 / segCount;
    for (let i = 0; i <= segCount; ++i) {
        // 顶点
        pts.push(0.0, step * i, 0.0);
        pts.push(0.0, step * i, 1.0 * height);
        // 纹理坐标
        uvs.push(1 - uvstep * i, 0);
        uvs.push(1 - uvstep * i, 1);
        // 法向
        nms.push(1.0, 0.0, 0.0);
        nms.push(1.0, 0.0, 0.0);
    }

    let indices = [];
    // 每4个点对应2个面
    for (let i = 1; i <= segCount; i++) {
        let before = 2 * (i - 1);
        let cur = 2 * i;
        indices.push(
            before + 0, before + 1, cur + 1,      // 0,1,3
            before + 0, cur + 1, cur,             // 0,3,2
        );
    }

    const positions = new Float64Array(pts);
    console.log(positions)
    const sts = new Float32Array(uvs);
    const normals = new Float32Array(nms);

    const geometry = new Cesium.Geometry({
        attributes: {
            position: new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                componentsPerAttribute: 3,
                values: positions
            }),
            st: new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.FLOAT,
                componentsPerAttribute: 2,
                values: sts
            }),
            normal: new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.FLOAT,
                componentsPerAttribute: 3,
                values: normals,
            })
        },
        indices: new Uint16Array(indices),
        primitiveType: Cesium.PrimitiveType.LINE_STRIP, // 线框
        primitiveType: Cesium.PrimitiveType.TRIANGLES,
        vertexFormat: Cesium.EllipsoidSurfaceAppearance.ALL,
        boundingSphere: Cesium.BoundingSphere.fromVertices(positions)
    });

    const instance = new Cesium.GeometryInstance({
        geometry: geometry,
        modelMatrix: modelMatrix,
    });

    //加入场景
    viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: instance,
        /*注意这里用EllipsoidSurfaceAppearance的话，背面不显示*/
        // appearance: new Cesium.EllipsoidSurfaceAppearance({
        appearance: new Cesium.MaterialAppearance({
            material: new Cesium.Material({
                fabric: {
                    type: "Image",
                    uniforms: {
                        image: "../../../public/Cesium/Flag.png",
                    },
                },
            }),
            vertexShaderSource: `
        in vec3 position3DHigh;
        in vec3 position3DLow;
        in vec3 normal;
        in vec3 tangent;
        in vec3 bitangent;
        in vec2 st;
        in float batchId;
        out vec3 v_positionEC;
        out vec3 v_normalEC;
        out vec3 v_tangentEC;
        out vec3 v_bitangentEC;
        out vec2 v_st;
        float rand(vec2 co)
        {
            return fract(sin(dot(co.xy ,vec2(12.9898, 78.233))) * 43758.5453);
        }
        void main()
        {
            vec4 p = czm_computePosition();
            float noiseValue = rand(p.xy+sin(czm_frameNumber)) * 1.0;

            // 效果一
            float range =10.0;//幅度
            p.y += sin(range*p.x)*sin(czm_frameNumber*3.14159265/180.0);

            v_positionEC = (czm_modelViewRelativeToEye * p).xyz;      // position in eye coordinates
            v_normalEC = czm_normal * normal;                         // normal in eye coordinates
            v_tangentEC = czm_normal * tangent;                       // tangent in eye coordinates
            v_bitangentEC = czm_normal * bitangent;                   // bitangent in eye coordinates
            v_st = st;

            gl_Position = czm_modelViewProjectionRelativeToEye * p;
            // 效果二
             //gl_Position.y += sin(gl_Position.x)*sin(czm_frameNumber*3.14159265*10.0/180.0);//+noiseValue;
        }
        `,
        }),
        asynchronous: false
    }));

    viewer.camera.flyTo({
        destination: new Cesium.Cartesian3(-849669.380384398, -4818389.484212656, 4078016.4602457224),
        orientation: {
            heading: 1.6256212189222454,
            pitch: -0.3600880235248547,
            roll: 6.283184158001929,
        },
        duration: 0.1
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