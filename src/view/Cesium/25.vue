<template>
    <div>
        <div id="map"></div>
    </div>
</template>
<script setup>
import * as Cesium from "cesium";
import { en } from "element-plus/es/locales.mjs";
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

    const entity = viewer.entities.add({
        label: {
            show: false,
            showBackground: true,
            font: "14px monospace",
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(15, 0),
        }
    })
    //Cesium自带的地图监听方法
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(function (movement) {
        //获取鼠标移动到地球上时候的地球坐标，如果不在地图上为undefined
        const cartesian = viewer.camera.pickEllipsoid(
            movement.endPosition,
            viewer.scene.globe.ellipsoid,
        );
        if (cartesian) {
            //x,y转经纬度(弧度表示)
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
            const longitude = Cesium.Math.toDegrees(
                cartographic.longitude
            ).toFixed(2)
            const latitude = Cesium.Math.toDegrees(
                cartographic.latitude
            ).toFixed(2);
            entity.position = cartesian
            entity.label.show = true;
            entity.label.text =
                `Lon: ${`   ${longitude}`.slice(-7)}\u00B0` +
                `\nLat: ${`   ${latitude}`.slice(-7)}\u00B0`;

        } else {
            entity.label.show = false
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)


    //自定义primitives
    const positions = new Float64Array([
        0.0, 0.0, 0.0,
        950000.0, 0.0, 0.0,
        0.0, 950000.0, 0.0
    ])
    const geometry = new Cesium.Geometry({
        attributes: {
            position: new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.DOUBLE,//数据类型，双精度
                componentsPerAttribute: 3,//多少个数据为一组
                values: positions,//data
            })
        },
        indices: new Uint16Array([0, 1, 1, 2, 2, 0]),//索引
        primitiveType: Cesium.PrimitiveType.LINES,//绘制线
        boundingSphere: Cesium.BoundingSphere.fromVertices(positions),//一个完全封闭几何体的可选边界球体。
    })
    const instance = new Cesium.GeometryInstance({
        geometry: geometry,
        modelMatrix: Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(
            Cesium.Cartesian3.fromDegrees(-110.59777, 20.03883)), new Cesium.Cartesian3(0.0, 0.0, 1000.0), new Cesium.Matrix4()),
        attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED)
        },
        id:'bottom'
    })

    viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances:instance,
        appearance:new Cesium.PerInstanceColorAppearance({
            flat:true,//不计算阴影
            translucent:false
        }),
        asynchronous:false//指定加载3D模型时是否异步加载,默认为true

    }))
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