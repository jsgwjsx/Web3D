<template>
    <div id="main">
        <div id="cesiumContainer"></div>
        <div ref="slider" style="width: 20px;height:100%;position:fixed;left:40%;background-color:red"></div>
    </div>
</template>

<script setup>
import * as Cesium from 'cesium'
import { onMounted, ref } from 'vue';
const slider = ref(null);
let viewer;
onMounted(() => {
    initCesium()

    const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'];
    const layers = viewer.imageryLayers;
    const earthAtNight = new Cesium.ImageryLayer(new Cesium.WebMapTileServiceImageryProvider({
        url: 'http://t{s}.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=af982aa2aee4a6958ec8c814c2bff6dc',
        layer: 'USGSShadedReliefOnly',
        subdomains: subdomains,
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'default028mm',
        //tileMatrixLabels : ['default028mm:0', 'default028mm:1', 'default028mm:2' ],
        maximumLevel: 18,
        credit: new Cesium.Credit('U. S. Geological Survey')
    }));
    earthAtNight.splitDirection = Cesium.SplitDirection.RIGHT; // Only show to the left of the slider.
    layers.add(earthAtNight);

    viewer.scene.splitPosition = 0.5;

    // const handler = new Cesium.ScreenSpaceEventHandler(slider.value);

    // let moveActive = false;

    // function move(movement) {
    //     if (!moveActive) {
    //         return;
    //     }

    //     const relativeOffset = movement.endPosition.x;
    //     const splitPosition =
    //         (slider.offsetLeft + relativeOffset) / slider.parentElement.offsetWidth;
    //     slider.style.left = `${100.0 * splitPosition}%`;
    //     viewer.scene.splitPosition = splitPosition;
    // }

    // handler.setInputAction(function () {
    //     moveActive = true;
    // }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    // handler.setInputAction(function () {
    //     moveActive = true;
    // }, Cesium.ScreenSpaceEventType.PINCH_START);

    // handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    // handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);
    // handler.setInputAction(function () {
    //     moveActive = false;
    // }, Cesium.ScreenSpaceEventType.LEFT_UP);
    // handler.setInputAction(function () {
    //     moveActive = false;
    // }, Cesium.ScreenSpaceEventType.PINCH_END);





})
function initCesium() {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZDBiOWI1Ni0yN2NlLTRjNTYtYTg5Mi01N2VlN2M5MWRhMTMiLCJpZCI6MjA0NzMzLCJpYXQiOjE3MTE1MTQ5ODZ9.EmuPT8se7QBJvBIdvA9r2Y_OEa0CabzpU0XqRMkmiWw'
    viewer = new Cesium.Viewer('cesiumContainer', {
        animation: false,//动画控件
        baseLayerPicker: false,//基础图层选择器
        fullscreenButton: false,//全屏按钮
        vrButton: false,//vr按钮
        geocoder: false,//搜索框
        homeButton: false,//主页按钮
        infoBox: false,//infoBox按钮
        sceneModePicker: false,//2D,3D转换按钮
        timeline: false,//时间线
        navigationHelpButton: false,//帮助按钮
        navigationInstructionsInitiallyVisible: false,//不知道什么控件
        selectionIndicator: false,//不知道什么控件

    })
}
</script>

<style scoped>
#main {
    width: 100%;
    height: 100%;
}

#cesiumContainer {
    width: 100%;
    height: 100%;
}

/* 不占据空间，无法点击 */
.cesium-viewer-toolbar,
/* 右上角按钮组 */
.cesium-viewer-animationContainer,
/* 左下角动画控件 */
.cesium-viewer-timelineContainer,
/* 时间线 */
.cesium-viewer-bottom

/* logo信息 */
    {
    display: none;
}

</style>