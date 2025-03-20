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
        shouldAnimate: true,
        //1. 通过baseLayer在viewer内部中添加地图
        baseLayer: new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
            url: ' http://webrd01.is.autonavi.com/appmaptile?&scale=1&lang=zh_cn&style=8&x={x}&y={y}&z={z}',
            minimumLevel: 1,
            maximumLevel: 18
        })
        )
    })
    viewer.scene.debugShowFramesPerSecond = true //显示fps
    function applyGravity(particle, dt) {
        //particle粒子本身属性，dt粒子步长时间
        const position = particle.position;
        //粒子经纬度
        var ellipsoid = viewer.scene.globe.ellipsoid
        var cartographic = ellipsoid.cartesianToCartographic(position)//转换为地理坐标(弧度)
        var lng = Cesium.Math.toDegrees(cartographic.longitude)//经度
        var lat = Cesium.Math.toDegrees(cartographic.latitude)//纬度
        var alt = cartographic.height
        //粒子坐标向正东方向偏移
        //控制偏移方向
        var lng1 = lng + 0.01
        var lat1 = lat + 0.01;
        var position1 = Cesium.Cartesian3.fromDegrees(lng1, lat1, alt)
        var vectorspeed = new Cesium.Cartesian3(position1.x - position.x, position1.y - position.y, position1.z - position.z)//获取偏移的幅度
        //获取偏移方向
        vectorspeed = Cesium.Cartesian3.normalize(vectorspeed, vectorspeed);//将向量归一化（即单位向量），实际应用中使得我们可以只考虑单位向量的方向，不去管他的大小
        //控制偏移幅度大小
        Cesium.Cartesian3.fromElements(
            vectorspeed.x * 0.1,
            vectorspeed.y * 0.1,
            vectorspeed.z * 0.1,
            vectorspeed,
        )
        //加载偏移给速度矢量
        particle.velocity = Cesium.Cartesian3.add(particle.velocity, vectorspeed, particle.velocity);// particle.velocity 粒子在世界坐标中的速度矢量。
    }
    function computeModeMatrix(position) {
        const center = Cesium.Cartesian3.fromDegrees(position.lon, position.lat, position.alt)
        const matrix = Cesium.Transforms.eastNorthUpToFixedFrame(center)//包含用于将位置转换为各种参考帧的函数
        return matrix
    }
    function computeEmitterModeMatrix() {
        let hrp = Cesium.HeadingPitchRoll.fromDegrees(0, 0, 90)
        let trs = new Cesium.TranslationRotationScale()//由平移、旋转和缩放定义的仿射变换。
        trs.translation = Cesium.Cartesian3.fromElements(0, 0, 0)//使用x，y，z创建一个笛卡尔3坐标实例
        trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hrp)//根据给定的俯仰倾三角计算四元数用来在三维空间表示倾斜
        let result = Cesium.Matrix4.fromTranslationRotationScale(trs) //根据四元数计算出4x4变换矩阵
        return result
    }
    var position= Cesium.Cartesian3.fromDegrees( 116.34516786934411,  39.99753297677145, 4)
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(116.34516786934411, 39.99753297677145, 600)
    })
    var viewModel = {         //对象
        emissionRate : 30.0, //发射频率
        gravity : 0.0, //地球引力
        minimumParticleLife : 1,  // 生命周期在5秒和10秒之间
        maximumParticleLife : 5,
        minimumSpeed : 20,   //运行速度Speed发射器控制了粒子的位置和方向，速度通过speed参数或者minimumSpeed和maximumSpeed    让粒子每秒运行20~50米:
        maximumSpeed : 50,
        startScale : 1.0,      //例子发射开始范围
        endScale : 0.5,        //粒子发射结束范围
        particleSize : 25.0      //颗粒大小
    };
    //通过viewer.scene.primitives加载ParticleSystem(粒子系统)
    var particleSystem = viewer.scene.primitives.add(new Cesium.ParticleSystem({
        image: '../../../public/Cesium/fire.png',
        startColor: Cesium.Color.RED.withAlpha(0.5),//设置粒子开始时候的颜色与透明度
        endColor: Cesium.Color.YELLOW.withAlpha(0.5),//设置粒子结束时候的颜色与透明度
        startScale: viewModel.startScale,//设置粒子开始时候的尺寸
        endScale: viewModel.endScale,//设置粒子结束时候的尺寸
        minimumParticleLife: viewModel.minimumParticleLife,//最小粒子运动时间
        maximumParticleLife: viewModel.maximumParticleLife,//最大粒子的运动时间
        minimumSpeed: viewModel.minimumSpeed,//最小运动速度
        minimumSpeed: viewModel.maximumSpeed,//最大运动速度
        imageSize: new Cesium.Cartesian2(viewModel.particleSize, viewModel.particleSize),//粒子图片尺寸
        sizeInMeters: true,//是否用米为单位，默认单位是像素px，也就是说粒子系统不随着相机的远近而改变大小，而以米为单位则随着相机的远近而改变大小
        emissionRate: viewModel.emissionRate,//每秒发射的粒子数量
        bursts: [
            // 周期性爆发指定范围内的粒子
            new Cesium.ParticleBurst({
                time: 5.0,
                minimum: 10,
                maximum: 100,
            }),
            new Cesium.ParticleBurst({
                time: 10.0,
                minimum: 50,
                maximum: 100,
            }),
            new Cesium.ParticleBurst({
                time: 15.0,
                minimum: 200,
                maximum: 300,
            }),
        ],

        emitter: new Cesium.BoxEmitter(new Cesium.Cartesian3(10, 100, 10)),//粒子发射器（发射形状都默认朝上），CircleEmitter表明粒子发射器是圆形
        modelMatrix: computeModeMatrix({ lon:116.34516786934411 , lat:39.99753297677145, alt:4 }),//将粒子系统从模型转换为世界坐标的 4x4 变换矩阵。以世界坐标为基准
        emitterModelMatrix: computeEmitterModeMatrix(),//在粒子系统局部坐标系内变换粒子系统发射器的 4x4 变换矩阵。以粒子发射器为中心，决定粒子发射的方向，角度
        updateCallback: applyGravity//用于在每个时间步长修改粒子属性的函数。这可能包括 force 修改、 颜色、尺寸等。
    }))

    //空间两点距离计算函数
    // function getSpaceDistance(pt1, pt2) {
    //     var point1cartographic = pt1;
    //     var point2cartographic = pt2;
    //     /**根据经纬度计算出距离**/
    //     var geodesic = new Cesium.EllipsoidGeodesic();
    //     geodesic.setEndPoints(point1cartographic, point2cartographic);
    //     var distance = geodesic.surfaceDistance;
    //     //返回两点之间的距离
    //     distance = Math.sqrt(Math.pow(distance, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
    //     return distance;
    // }
    // //视角距离与火大小成反比
    // viewer.scene.preRender.addEventListener(function () {
    //     var distance = getSpaceDistance(Cesium.Cartographic.fromCartesian(position), viewer.camera.positionCartographic);
    //     if (distance < 100) {
    //         particleSystem.startScale = viewModel.startScale;
    //         particleSystem.endScale = viewModel.endScale;
    //     } else {
    //         particleSystem.startScale = viewModel.startScale * 100 / distance;
    //         particleSystem.endScale = viewModel.endScale * 100 / distance;
    //     }
    //     particleSystem.show = distance < 1000000;
    // });
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