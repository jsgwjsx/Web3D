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

    //方式一，构造时赋值
    var entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-103.0, 40.0, 0.0),
        ellipse: {
            semiMajorAxis: 400000.0,
            semiMinorAxis: 400000.0,
            material: Cesium.Color.BLUE.withAlpha(0.3)
        }
    })
    //方法二，构造后赋值
    //1.颜色材质ColorMaterialProperty
    entity.ellipse.material = Cesium.Color.RED.withAlpha(0.5)
    viewer.zoomTo(entity)
    //2.照片材质ImageMaterialProperty
    entity.ellipse.material = new Cesium.ImageMaterialProperty({
        image: '../../../public/Cesium/a.jpg',
        //color:Cesium.Color.BLUE,
        repeat: new Cesium.Cartesian2(4, 4),
    })
    //也可以直接
    entity.ellipse.material = '../../../public/Cesium/a.jpg'
    //3.棋盘纹理(两种颜色交错分布)CheckerboardMaterialProperty
    entity.ellipse.material = new Cesium.CheckerboardMaterialProperty({
        evenColor: Cesium.Color.WHITE,//默认为白色，棋盘的第一个颜色
        oddColor: Cesium.Color.BLACK,//默认为黑色，棋盘的第二个颜色
        repeat: new Cesium.Cartesian2(40, 40)//重复次数
    });
    //4.条纹纹理StripMaterialProperty
    entity.ellipse.material = new Cesium.StripeMaterialProperty({
        evenColor: Cesium.Color.WHITE,
        oddColor: Cesium.Color.BLACK,
        repeat: 32,
        offset: 20,
        orientation: Cesium.StripeOrientation.VERTICAL//水平或垂直分布，默认水平
    });
    //5.GripMaterialProperty
    entity.ellipse.material = new Cesium.GridMaterialProperty({
        color: Cesium.Color.YELLOW,
        cellAlpha: 0.2,//单元格透明度
        lineCount: new Cesium.Cartesian2(8, 8),//行列个数
        lineThickness: new Cesium.Cartesian2(2.0, 2.0)//线偏移
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