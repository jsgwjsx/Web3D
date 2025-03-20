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
    const positions = new Float64Array([
        0.0, 0.0, 0.0,
        20000.0, 0.0, 0.0,
        0.0, 20000.0, 0.0
    ]);
    const geometry = new Cesium.Geometry({
        attributes: {
            position: new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                componentsPerAttribute: 3,
                values: positions
            })
        },
        indices: new Uint16Array([0, 1, 1, 2, 2, 0]),
        primitiveType: Cesium.PrimitiveType.TRIANGLE_FAN,
        boundingSphere: Cesium.BoundingSphere.fromVertices(positions)
    });
    //创建一堆三角面
    for (let i = 0; i < 1000; i++) {
        const x = Math.random() * (121 - 120 + 1) + 120
        const y = Math.random() * (38 - 37 + 1) + 37
        const z = Math.random() * 300000
        //计算颜色插值(x为R,Y为G,Z为B)
        const R = (x - 120.0) / 2.0
        const G = (y - 37.0) / 2.0
        const B = z / 400000
        //console.log(R,G,B);
        //模型矩阵
        const m = Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(
            Cesium.Cartesian3.fromDegrees(x, y)), new Cesium.Cartesian3(0, 0, z), new Cesium.Matrix4())
        //随便弄一个旋转矩阵
        const rotate = new Cesium.Matrix3()
        //旋转随机
        const x1 = Math.random() * 90
        const y1 = Math.random() * 90
        const z1 = Math.random() * 90
        Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(x1), rotate)
        Cesium.Matrix4.multiplyByMatrix3(m, rotate, m)
        Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(y1), rotate)
        Cesium.Matrix4.multiplyByMatrix3(m, rotate, m)
        Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(z1), rotate)
        Cesium.Matrix4.multiplyByMatrix3(m, rotate, m)
        viewer.scene.primitives.add(new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: geometry,
                modelMatrix: m,
                id: 'trangle' + i,
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(R, G, B))
                }
            }),
            appearance: new Cesium.PerInstanceColorAppearance({
                flat: true,
                translucent: false
            }),
            asynchronous: false,
            releaseGeometryInstances: false,
        }));
    }
    //创建一个边界三角形
    const positions1 = new Float64Array([
        0.0, 0.0, 0.0,
        20000.0, 0.0, 0.0,
        0.0, 20000.0, 0.0
    ]);
    const geometry1 = new Cesium.Geometry({
        attributes: {
            position: new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                componentsPerAttribute: 3,
                values: positions1
            })
        },
        indices: new Uint16Array([0, 1, 1, 2, 2, 0]),
        primitiveType: Cesium.PrimitiveType.LINE_LOOP,
        boundingSphere: Cesium.BoundingSphere.fromVertices(positions)
    });
    let select;
    //射线拾取,拾取物体把三角形放到拾取的地方。
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction((ele) => {
        if (select) {
            viewer.scene.primitives.remove(select);
        }
        const pos = ele.endPosition
        viewer.camera.getPickRay(pos)
        const intersect = viewer.scene.drillPick(pos)
        if (intersect.length > 0) {
            const primitives = new Cesium.Primitive({
                geometryInstances: new Cesium.GeometryInstance({
                    geometry: geometry1,
                    modelMatrix: intersect[0].primitive.geometryInstances.modelMatrix,
                    id: 'trangle',
                    attributes: {
                        color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE)
                    }
                }),
                appearance: new Cesium.PerInstanceColorAppearance({
                    flat: true,
                    translucent: false
                }),
                asynchronous: false,
                releaseGeometryInstances: false,
            })
            console.log(primitives._pickIds[0]);
            select = viewer.scene.primitives.add(primitives);

        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)


    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(115, 36, 400000),
        orientation: {
            heading: Cesium.Math.toRadians(60),
            pitch: Cesium.Math.toRadians(-28),
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