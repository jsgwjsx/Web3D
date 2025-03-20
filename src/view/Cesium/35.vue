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
    //线设置一个运动的模型
    var lujingdata = [[117.4603186710001, 31.14388249900003, 11.147400000001653],

    [117.45946237800001, 31.143739847000063, 11.108399999997346],

    [117.45859906800001, 31.143571198000075, 10.89079999999376],

    [117.45789337300005, 31.143422075000046, 11.12170000000333],

    [117.4571119630001, 31.143350937000037, 11.545700000002398],

    [117.45620292500007, 31.143325030000028, 11.529899999994086],

    [117.45545284400009, 31.143363754000063, 11.038100000005215],

    [117.45473256600008, 31.143448056000068, 10.86380000000645],

    [117.45399052200003, 31.143623321000064, 11.345600000000559],

    [117.45347615200001, 31.14381135600007, 11.687300000005052],

    [117.45292459000007, 31.144031608000034, 12.106100000004517],

    [117.45192097000006, 31.144426226000064, 12.842399999994086],

    [117.45065835500009, 31.144954275000032, 12.712299999999232],

    [117.44980033200011, 31.145266268000057, 12.504899999999907],

    [117.44943370300007, 31.145413392000023, 12.731599999999162],

    [117.44920128900003, 31.145382554000037, 12.967699999993783],

    [117.44897692800009, 31.144980649000047, 14.909599999999045],

    [117.44872415000009, 31.14449598400006, 14.55899999999383],

    [117.44851592000009, 31.144125416000065, 14.410999999992782],

    [117.44848024700002, 31.14392828000007, 14.475800000000163],

    [117.44948683700011, 31.14350793500006, 14.507400000002235],

    [117.45089297600009, 31.142959855000072, 14.290399999998044],

    [117.45149371900004, 31.142693826000027, 14.127099999997881],

    [117.45166848000008, 31.142571364000048, 15.52610000000277],

    [117.4516358520001, 31.142433625000024, 14.0341000000044],

    [117.45082070700005, 31.140899211000033, 13.289099999994505],

    [117.45082070700005, 31.140899211000033, 13.289099999994505]]
    var dataSource = new Cesium.CustomDataSource('asda')
    viewer.dataSources.add(dataSource)
    var polyline = dataSource.entities.add({
        id: 'polylinetest',
        name: 'borderLine',
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(lujingdata.flat()),
            width: 2,
            material: Cesium.Color.YELLOW
        }
    })
    //Cesium的SampledPositionProperty对象是一种用于表示实体在时间上变化位置的属性对象。
    //是一种时间动态的属性，可以用于将实体的位置随时间进行插值，并在三维地球上进行动画演示。
    //SampledPositionProperty对象可以用于表示实体的连续运动轨迹，通过在不同的时间点上添加位置和时间信息，可以创建一个时间序列，描述实体在不同时间点上的位置。这些位置点可以通过插值方法来计算并在动画中平滑地过渡。

    var property = new Cesium.SampledPositionProperty()
    //记录开始时间
    var starttime = new Date()
    var stoptime;

    //调用getTime()获取时间戳
    var timestamp = starttime.getTime();
    //生成时间序列
    lujingdata.forEach((pos, index) => {
        var time = new Date(timestamp + index * 5000);
        stoptime = time
        var position = Cesium.Cartesian3.fromDegrees(pos[0], pos[1], pos[2])
        property.addSample(Cesium.JulianDate.fromDate(time), position)
    }),
        property.setInterpolationOptions({
            //插值次数
            interpolationDegree: 0.001,
            //插值算法
            interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
        })
    //使用dataSource.entities中添加实体,并传入一个包含实体属性的对象。
    var entitydd = dataSource.entities.add({
        //设置实体可见的时间段
        availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
            start: Cesium.JulianDate.fromDate(starttime),
            stop: Cesium.JulianDate.fromDate(stoptime)
        })]),
        position: property,
        //基于property时间序列相邻的两个点计算角度
        orientation: new Cesium.VelocityOrientationProperty(property),
        label: {
            text: 'label1',
            scale: 0.5,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: Cesium.Color.RED,
            pixelOffset: new Cesium.Cartesian2(0, -30),
            eyeOffset: new Cesium.Cartesian3(0, 0, 10),//视觉上的位置，第三个参数相当于电脑与人眼的距离，可以用来处理遮挡情况
        },
        //添加模型
        model: {
            minimumPixelSize: 32,//最小尺寸
            // 模型路径
            uri: '../../../public/Cesium/汽车.glb',
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(10, 20000),//模型显示的视野范围
        },
        // 4.实体的path属性指定了实体的路径属性。
        path: {
            //路径提前时间
            leadTime: 0,
            //路径的分辨率，表示路径上的点之间的距离为1m
            resolution: 1,
            //设置路径材质与宽度
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.1,
                color: Cesium.Color.RED
            }),
            width: 10
        },
        viewFrom: Cesium.Cartesian3.fromDegrees(200, 0, 0)
    })
    viewer.camera.setView({
        destination:Cesium.Cartesian3.fromDegrees(117.44920128900003, 31.145382554000037, 600)
    })
    //设置动画
    //设置地图的当前时间
    viewer.clock.currentTime = Cesium.JulianDate.fromDate(starttime);
    //设置地图的结束时间
    viewer.clock.stopTime = Cesium.JulianDate.fromDate(new Date(stoptime));
    //设置地图时钟的范围为Cesium.ClockRange.LOOP_STOP。当地图时间超过停止时间时，时钟会重新从开始时间开始循环。
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP,
        //是否自动播放
        viewer.clock.shouldAnimate = true;
    // viewer.zoomTo(dataSource);
    //时间轴的监听回调函数
    viewer.clock.onTick.addEventListener((tick) => {
        //转为经纬度
        var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(entitydd.position.getValue(tick.currentTime))//转换为地理坐标(弧度)
        //弧度转经纬度
        cartographic.longitude = Cesium.Math.toDegrees(cartographic.longitude)//经度
        cartographic.latitude = Cesium.Math.toDegrees(cartographic.latitude)//纬度
        // console.log(cartographic)
        //修改label值
        entitydd.label.text = Number(cartographic.longitude).toFixed(4) + ',' + Number(cartographic.latitude).toFixed(4)
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