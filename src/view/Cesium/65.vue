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
    const czml = [
        {
            id: "document",
            name: "CZML Polygon - Interpolating References",
            version: "1.0",
        },
        {
            id: "dynamicPolyline",
            name: "Dynamic Polygon with Reference Properties",
            availability: "2012-08-04T16:00:00Z/2012-08-04T17:00:00Z",
            polyline: {
                positions: {
                    references: ["v1#position", "v3#position"],
                },
                perPositionHeight: true,
                material: {
                    solidColor: {
                        color: [
                            {
                                interval: "2012-08-04T16:00:00Z/2012-08-04T16:25:00Z",
                                rgbaf: [1, 0, 1, 1],
                            },
                            {
                                interval: "2012-08-04T16:30:00Z/2012-08-04T17:00:00Z",
                                rgbaf: [0, 1, 1, 1],
                            },
                        ],
                    },
                },
            },
        },
        {
            id: "v1",
            point: {
                color: {
                    rgba: [255, 255, 255, 128],
                },
                outlineColor: {
                    rgba: [255, 0, 0, 128],
                },
                outlineWidth: 3,
                pixelSize: 15,
            },
            path: {
                material: {
                    polylineOutline: {
                        color: {
                            rgba: [255, 0, 255, 255],
                        },
                        outlineColor: {
                            rgba: [0, 255, 255, 255],
                        },
                        outlineWidth: 5,
                    },
                },
                width: 8,
                leadTime: 10,
                trailTime: 100,
                resolution: 5,
            },
            position: {
                interpolationAlgorithm: "LINEAR",
                interpolationDegree: 1,
                interval: "2012-08-04T16:00:00Z/2012-08-04T17:00:00Z",
                epoch: "2012-08-04T16:00:00Z",
                cartographicDegrees: [
                    0, -60, 35, 30000,
                    160, -65, 35, 5000000,
                    400, -70, 40, 20000, 800,
                    -62, 45, 200000, 1800,
                    -65, 40, 650000, 3600,
                    -60, 35, 3000,
                ],
            },
        },
        {
            id: "v3",
            point: {
                color: {
                    rgba: [255, 255, 255, 128],
                },
                outlineColor: {
                    rgba: [255, 0, 0, 128],
                },
                outlineWidth: 3,
                pixelSize: 15,
            },
            path: {
                material: {
                    polylineOutline: {
                        color: {
                            rgba: [255, 0, 255, 255],
                        },
                        outlineColor: {
                            rgba: [0, 255, 255, 255],
                        },
                        outlineWidth: 5,
                    },
                },
                width: 8,
                leadTime: 10,
                trailTime: 100,
                resolution: 5,
            },
            position: {
                interpolationAlgorithm: "LINEAR",
                interpolationDegree: 1,
                interval: "2012-08-04T16:00:00Z/2012-08-04T17:00:00Z",
                epoch: "2012-08-04T16:00:00Z",
                cartographicDegrees: [
                    0, -45, 60, 4000,
                    400, -40, 70, 2000000,
                    1000, -35, 75, 100000,
                    3600, -45, 65, 3000,
                ],
            },
        },
    ];
    const dataSource = await Cesium.CzmlDataSource.load(czml)
    viewer.dataSources.add(dataSource)

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