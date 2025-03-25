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
        "../../../public/Cesium/3dtiles/tileset.json"
    );
    tileset.then((tileset) => {
        viewer.scene.primitives.add(tileset);
        viewer.zoomTo(tileset)//跳转到当前对象中

    })
    // Mouse over the globe to see the cartographic position
    let handler;
    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (movement) {
        const pos = new Cesium.Cartesian3()
        viewer.scene.pickPosition(movement.position, pos)
        viewer.scene.primitives.remove(viewer.scene.primitives._primitives[1])
        viewer.scene.primitives.add(
            new Cesium.ClassificationPrimitive({
                geometryInstances: new Cesium.GeometryInstance({
                    geometry: Cesium.SphereGeometry.createGeometry(new Cesium.SphereGeometry({
                        radius: 10.0,
                        vertexFormat: Cesium.VertexFormat.POSITION_ONLY
                    })),
                    modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(pos),
                    attributes: {
                        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                            new Cesium.Color(0.0, 1.0, 0.0, 0.5)
                        ),
                        show: new Cesium.ShowGeometryInstanceAttribute(true),
                    },
                    id: "volume",
                }),
                classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
                asynchronous: false,
                //debugShowBoundingVolume:true
            })
        );

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  
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