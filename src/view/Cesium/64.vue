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
    const particles = 10000;
    const radius = 200;

    const positions = [];
    const colors = [];
    const indices = [];
    const normals = []
    //创建顶点,颜色,索引,法线等
    for (let i = 0; i < particles; i++) {
        indices.push(i);

        positions.push((Math.random() * 2 - 1) * radius);
        positions.push((Math.random() * 2 - 1) * radius);
        positions.push((Math.random() * 2 - 1) * radius);
        normals.push(0.0);
        normals.push(0.0);
        normals.push(1.0);


        let color = Cesium.Color.fromHsl(i / particles, 1, 0.5);
        colors.push(
            Cesium.Color.floatToByte(color.red),
            Cesium.Color.floatToByte(color.green),
            Cesium.Color.floatToByte(color.blue),
        );
    }

    const geometry = new Cesium.Geometry({
        attributes: {
            position: new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                componentsPerAttribute: 3,
                values: new Float64Array(positions)
            }),
            color: new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.UNSIGNED_BYTE,
                componentsPerAttribute: 3,
                normalize: true,
                values: new Float32Array(colors)
            }),
            normal: new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.FLOAT,
                componentsPerAttribute: 3,
                //normalize: true,
                values: new Float32Array(normals)
            }),
        },
        indices: new Uint16Array(indices),
        primitiveType: Cesium.PrimitiveType.POINTS,
        vertexFormat: Cesium.VertexFormat.POSITION_AND_COLOR,
        boundingSphere: Cesium.BoundingSphere.fromVertices(positions)
    });
    const instance = new Cesium.GeometryInstance({
        geometry: geometry,
        modelMatrix: Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(
            Cesium.Cartesian3.fromDegrees(120, 40.0)), new Cesium.Cartesian3(0.0, 0.0, 0.0), new Cesium.Matrix4()),

    });
    //加入场景
    const appearance = new Cesium.MaterialAppearance({
        //片段着色器
        fragmentShaderSource: `
            precision mediump float;
            in vec4 v_color;
            in vec2 v_st;
            void main()
            {
                // 按图元到圆心的距离修改透明度
                float d = distance(gl_PointCoord, vec2(0.5,0.5));
                if(d < 0.5){
                    out_FragColor = (1.0-d*2.0) * v_color;
                }else{
                    discard;
                }
            }
            `,
        //顶点着色器
        vertexShaderSource: `
            in vec3 position3DHigh;
            in vec3 position3DLow;
            in vec4 color;
            in vec2 st;
            out vec2 v_st;
            out vec4 v_color;
            in float batchId;
            void main()
            {
                vec4 p = czm_computePosition();
                v_color =color;
                v_st=st;
                p = czm_modelViewProjectionRelativeToEye * p;
                gl_Position = p;
                float time = czm_frameNumber * 0.008;
                gl_PointSize= 20.0 * (1.0 + sin(time)); // 根据时间调整点大小
            }
        `,
        flat: true
    })
    console.log(appearance.vertexFormat);
    viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: instance,
        appearance: appearance,
        asynchronous: false
    }));


    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(120, 40, 2000),
        orientation: {
            heading: Cesium.Math.toRadians(-30),
            pitch: Cesium.Math.toRadians(-90),
            roll: Cesium.Math.toRadians(0),
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