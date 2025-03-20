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

    //条带的长度
    const length = 100000.0
    //条带宽度
    const width = 1000.0;
    //多长的长度实现一个起伏效果的参数
    const length1 = 200.0
    //条带最高点的高度
    const Hmax = 300.0
    //存储点
    const pointArr = []
    //根据条带的长度获取条带上的所有点(创建两千个点)
    for (let i = 0; i < 2000.0; i++) {
        //a,b两点代表条带宽度的两边
        const Ax = (length / 2000.0) * i
        const Ay = Hmax * Math.sin(Ax / length1)
        const Az = -width
        const Bx = (length / 2000.0) * i
        const By = Hmax * Math.sin(Bx / length1)
        const Bz = width
        pointArr.push(Ax, Ay, Az, Bx, By, Bz)
    }
    //创建一个数组存储我们最后的顶点
    const finallyArr = []
    //在不使用index索引绘制的情况下我们需要把所有顶点按照三角形的顺序处理一下(逆时针为正,顺时针为反)
    for (let i = 0; i < pointArr.length; i += 6) {
        //获得每个矩形所需要的点
        if (i + 11 < pointArr.length) {
            const ax = pointArr[i]
            const ay = pointArr[i + 1]
            const az = pointArr[i + 2]

            const bx = pointArr[i + 3]
            const by = pointArr[i + 4]
            const bz = pointArr[i + 5]

            const cx = pointArr[i + 6]
            const cy = pointArr[i + 7]
            const cz = pointArr[i + 8]

            const dx = pointArr[i + 9]
            const dy = pointArr[i + 10]
            const dz = pointArr[i + 11]

            //这些点按照顺序放入数组里
            finallyArr.push(
                ax, ay, az,
                bx, by, bz,
                cx, cy, cz,
                cx, cy, cz,
                bx, by, bz,
                dx, dy, dz,

            )
        }
    }
    const positions = new Float32Array(finallyArr);
    const geometry = new Cesium.Geometry({
        attributes: {
            position: new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                componentsPerAttribute: 3,
                values: positions
            }),
            normal: new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                componentsPerAttribute: 3,
                values: positions
            })
        },
        //indices : new Uint16Array([0, 1, 1, 2, 2, 0]),
        primitiveType: Cesium.PrimitiveType.LINES,
        boundingSphere: Cesium.BoundingSphere.fromVertices(positions)
    });
    const instance = new Cesium.GeometryInstance({
        geometry: geometry,
        modelMatrix: Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(
            Cesium.Cartesian3.fromDegrees(120.59777, 37)), new Cesium.Cartesian3(0.0, 0.0, 1000.0), new Cesium.Matrix4()),
        attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.SKYBLUE)
        },
        id: 'bottom'
    });
    viewer.camera.setView({
        destination:Cesium.Cartesian3.fromDegrees(120.69777, 36.8,2000),
        orientation:{
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(0),
        }
    })
    viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: instance,
        appearance: new Cesium.PerInstanceColorAppearance({
            flat: true,
            //translucent:false,
        }),
        asynchronous: false,
        shadows: Cesium.ShadowMode.ENABLED
    }));
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