<template>
    <div>
        <div id="map"></div>
    </div>
</template>
<script setup>
import * as Cesium from "cesium";
import { vi } from "element-plus/es/locales.mjs";
import { TrefoilPolynomialKnot } from "three/examples/jsm/curves/CurveExtras.js";
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
        // baseLayer: new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
        //     url: ' http://webrd01.is.autonavi.com/appmaptile?&scale=1&lang=zh_cn&style=8&x={x}&y={y}&z={z}',
        //     minimumLevel: 1,
        //     maximumLevel: 18
        // })
        // ),
        terrain: Cesium.Terrain.fromWorldTerrain(),
    })
    viewer.scene.debugShowFramesPerSecond = true //显示fps
    //添加一个简单的线条
    // var yellowLine = viewer.entities.add({
    //     name: 'Red line on the surface',
    //     polyline: {
    //         positions: Cesium.Cartesian3.fromDegreesArray([
    //             112.82436,
    //             23.071506,
    //             112.82742,
    //             23.067512,
    //             112.828878,
    //             23.064659,
    //             112.830799,
    //             23.060947,
    //             112.832166,
    //             24.058329
    //         ]),
    //         width: 10,
    //         material: Cesium.Color.YELLOW
    //     }
    // });
    //viewer.zoomTo(yellowLine)
    //1.添加一个正常的贴地线，使用entity.corride即可，其他参数与polyline一样
    //这种会有问题，如果线正上方有其他的物体，线也会影响这个物体(点云)的颜色
    var redLine = viewer.entities.add({
        name: 'Red line on the surface',
        corridor: {
            positions: Cesium.Cartesian3.fromDegreesArray([
                90, 30, 90.1, 30
            ]),
            width: 100,
            material: Cesium.Color.RED
        }
    });
    viewer.zoomTo(redLine)
    //2.使用geojson加载贴地线，配置clampToGround参数为true就好
    //也会出现上述问题
    viewer.dataSources.add(Cesium.GeoJsonDataSource.load('../../../public/Cesium/line.json', {
        clampToGround: true,
    }))
    //3.使用primitive进行绘制,效果比较好，不影响点云
    const instance = new Cesium.GeometryInstance({
        geometry: new Cesium.GroundPolylineGeometry({
            positions: Cesium.Cartesian3.fromDegreesArray([
                90, 30, 90.1, 30.2
            ]),
            width: 4.0
        }),
        id: 'object returned when this instance is picked and to get/set per-instance attributes'
    });

    viewer.scene.groundPrimitives.add(new Cesium.GroundPolylinePrimitive({
        geometryInstances: instance,
        appearance: new Cesium.PolylineMaterialAppearance()
    }));
    //用CZML创建
    const czml = [{
        "id": "document",
        "name": "CZML Geometries: Polyline",
        "version": "1.0",
    },
    {
        "id": "redCorridor",
        "name": "Red corridor on surface with rounded corners",
        "corridor": {
            "positions": {
                "cartographicDegrees": [90.1, 30.2, 0, 90.1, 30.07, 0],
            },
            "width": 200.0,
            material: {
                solidColor: {
                    color: {
                        rgba: [255, 255, 0, 127],
                    },
                },
            },
        },
    }];
    const dataSourcePromise = Cesium.CzmlDataSource.load(czml);
    viewer.dataSources.add(dataSourcePromise)
    //上述四种无论是czml，geojson，还是entity，其实都是corridor，会影响到上方的点云
    //只有用primitives不是，不会影响点云颜色
    //此外，除了直接使用api做贴地线，我们也可以通过polyline进行插值，然后使用 new Cesium.Cartographic(lon, lat);来获取每个点在当前位置的高度，然后拼接所有的插值点，变成贴地线
    //这种实质是polyline,这里不做赘述

    // var line = viewer.entities.add(createCorridor([90.1, 30.3], [90.1, 30.07], 1000))
    // viewer.zoomTo(line)
    // function createCorridor(start, end, length) {

    //     var startLat = Cesium.Math.toRadians(start[0])
    //     var startLon = Cesium.Math.toRadians(start[1]);
    //     var endLat = Cesium.Math.toRadians(end[0]);
    //     var endLon = Cesium.Math.toRadians(end[1]);



    //     var terrainSamplePositions = [];
    //     for (var i = 0; i < length; ++i) {
    //         var lon = Cesium.Math.lerp(endLon, startLon, i / (length - 1));
    //         var lat = Cesium.Math.lerp(endLat, startLat, i / (length - 1))
    //         var position = new Cesium.Cartographic(lon, lat);
    //         console.log(position)
    //         terrainSamplePositions.push(position);
    //     }


    //     var offset = 10.0;
    //     var entity = new Cesium.Entity({
    //         polyline: {
    //             positions: Cesium.Ellipsoid.WGS84.cartographicArrayToCartesianArray(terrainSamplePositions),
    //             followSurface: false,
    //             width: 5,
    //             material: new Cesium.PolylineOutlineMaterialProperty({
    //                 color: Cesium.Color.BLACK,
    //                 outlineWidth: 2,
    //                 outlineColor: Cesium.Color.BLACK
    //             }),
    //             depthFailMaterial: new Cesium.PolylineOutlineMaterialProperty({
    //                 color: Cesium.Color.RED,
    //             })
    //         }
    //     })
    //     return entity
    // }
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