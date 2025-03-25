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
    //Viewer的场景
    const scene = viewer.scene;
    //圆锥的高度
    const length = 4000000.0;
    //圆锥上面的粗细
    let topRadius = 800000.0;
    //圆锥的经纬度
    let positionOnEllipsoid = Cesium.Cartesian3.fromDegrees(-105.0, 40.0);
    //根据经纬度创建圆锥的模型矩阵
    let modelMatrix = Cesium.Matrix4.multiplyByTranslation(
        Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid),
        new Cesium.Cartesian3(0.0, 0.0, length * 0.5),
        new Cesium.Matrix4()
    );
    //圆锥的几何体
    let cylinderGeometry = new Cesium.CylinderGeometry({
        length: length,
        topRadius: topRadius,
        bottomRadius: 0,
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
        // vertexFormat:Cesium.VertexFormat.ALL ,

    });
    //圆锥的geometryinstance
    const redCone = new Cesium.GeometryInstance({
        geometry: cylinderGeometry,
        modelMatrix: modelMatrix,
        attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED.withAlpha(0.5)),
        },

    });
    //创建圆锥的primitive并加入场景之中
    scene.primitives.add(
        new Cesium.Primitive({
            geometryInstances: [redCone],
            appearance: new Cesium.PerInstanceColorAppearance({
                // closed: true,
                // translucent: true,
            }),
        })
    );
    // 加载三个点位
    function AddPoint(pt, color = Cesium.Color.RED) {
        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(pt.lon, pt.lat, pt.h),
            point: {
                pixelSize: 10,
                color: color,
            },
        })
    }
    //圆锥底部点的位置
    let bottomPt = { lon: -105.0, lat: 40.0, h: 0 }
    //圆锥中心点的位置
    let centerPt = { lon: -105.0, lat: 40.0, h: length / 2 }
    //圆锥顶部点的位置
    let topPt = { lon: -105.0, lat: 40.0, h: length }
    //根据底部点的点位创建一个entity加入场景之中
    AddPoint(bottomPt);
    //根据中间点的点位创建一个entity加入场景之中
    AddPoint(centerPt);
    //根据顶部点的点位创建一个entity加入场景之中
    AddPoint(topPt);

    // 创建一个点进行是否在圆锥内的测试
    let testPt = { lon: -105.0, lat: 42.3, h: length - 10000 }
    AddPoint(testPt, Cesium.Color.YELLOW);

    //// 判断点是否在圆锥内,点的大小就会变成150
    // 计算点相对于中心点的相对坐标
    function getRelaCoor(org, pt) {
        // 中心点
        let org1 = Cesium.Cartesian3.fromDegrees(org.lon, org.lat, org.h);
        let pt1 = Cesium.Cartesian3.fromDegrees(pt.lon, pt.lat, pt.h);
        return Cesium.Cartesian3.subtract(pt1, org1, new Cesium.Cartesian3());
    }
    //点到圆锥中轴线的垂足
    function getFootPoint(startPt, endPt, pt) {
        let k = -((startPt.x - pt.x) * (endPt.x - startPt.x) + (startPt.y - pt.y) * (endPt.y - startPt.y) + (startPt.z - pt.z) * (endPt.z - startPt.z)) / ((endPt.x - startPt.x) * (endPt.x - startPt.x) + (endPt.y - startPt.y) * (endPt.y - startPt.y) + (endPt.z - startPt.z) * (endPt.z - startPt.z))
        return new Cesium.Cartesian3(
            k * (endPt.x - startPt.x) + startPt.x,
            k * (endPt.y - startPt.y) + startPt.y,
            k * (endPt.z - startPt.z) + startPt.z
        )
    }
    //判断点是否在选段上
    function ptInSegment(startPt, endPt, pt) {
        let length = Cesium.Cartesian3.distance(startPt, endPt);
        let length1 = Cesium.Cartesian3.distance(startPt, pt);
        let length2 = Cesium.Cartesian3.distance(pt, endPt);
        return length1 <= length && length2 <= length;
    }
    //判断点在圆锥内部
    function ptInCylinder(centerPt, bottomPt, topPt, testPt) {
        //得到所有点相对于圆锥中心点的坐标
        let bottomRelPt = getRelaCoor(centerPt, bottomPt) // Cartesian3
        let topRelPt = getRelaCoor(centerPt, topPt)
        let testRelPt = getRelaCoor(centerPt, testPt)
        // 在包围球之外，直接排除(提升效率)
        let d0 = Cesium.Cartesian3.distance(new Cesium.Cartesian3(), bottomRelPt);
        if (d0 > length / 2) return false;
        //得到点到圆锥中轴线的垂足
        let footPt = getFootPoint(bottomRelPt, topRelPt, testRelPt);
        // 垂足不在线段上，一定不在圆锥内
        if (!ptInSegment(bottomRelPt, topRelPt, footPt)) return false;
        // 点到圆锥顶部的距离
        let d1 = Cesium.Cartesian3.distance(footPt, bottomRelPt);
        // 当前高度对应的宽度， 大于宽度，在圆锥外，否则在圆锥内
        let dLimit = topRadius / 2 * d1 / length;
        let curDis = Cesium.Cartesian3.distance(footPt, testRelPt);

        return dLimit > curDis;
    }

    //创建一堆随着时间变化的随机点,使用点在圆锥内的判断,如果点在圆锥内
    class Point {
        viewer;
        posDegrees;
        posCart;
        pointPrim;
        speed;
        height;

        constructor(viewer, posDegrees, speed, height) {
            this.viewer = viewer;
            this.posDegrees = posDegrees;
            this.speed = speed;
            this.height = height;

            this.point = this.viewer.entities.add({
                position: new Cesium.CallbackProperty((time, result) => {
                    this.posDegrees[0] =
                        this.posDegrees[0] + Math.cos(Date.parse(time) / speed) / 1;
                    this.posCart = Cesium.Cartesian3.fromDegrees(
                        this.posDegrees[0],
                        this.posDegrees[1],
                        this.height
                    );

                    return this.posCart;
                }, false),

                point: {
                    pixelSize: new Cesium.CallbackProperty((time, result) => {
                        this.posDegrees[0] = this.posDegrees[0] + Math.cos(Date.parse(time) / speed) / 10;
                        // this.posCart = Cesium.Cartesian3.fromDegrees(
                        //     this.posDegrees[0],
                        //     this.posDegrees[1],
                        //     this.height
                        // );
                        if (ptInCylinder(centerPt, bottomPt, topPt, { lon: this.posDegrees[0], lat: this.posDegrees[1], h: this.height }))
                            return 150;

                        return 5;
                    }, false),
                    color: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 0,
                },
            });
        }
    }
    const point1 = new Point(viewer, [-154, -29], 151, 5076290);
    const point2 = new Point(viewer, [33, 83], 1001, 7937560);
    const point3 = new Point(viewer, [-74, -22], 356, 5707260);
    const point4 = new Point(viewer, [156, 41], 452, 1775640);
    const point5 = new Point(viewer, [-152, -51], 147, 4567090);
    const point6 = new Point(viewer, [64, 37], 718, 5511340);
    const point7 = new Point(viewer, [-60, -71], 165, 8161870);
    const point8 = new Point(viewer, [35, 27], 741, 4295460);
    const point9 = new Point(viewer, [-73, -61], 428, 6493760);
    const point10 = new Point(viewer, [136, 62], 157, 3789020);
    const point11 = new Point(viewer, [-47, -45], 690, 1924060);
    const point12 = new Point(viewer, [99, 72], 99, 6263930);
    const point13 = new Point(viewer, [-123, -73], 753, 1961910);
    const point14 = new Point(viewer, [82, 70], 489, 9210590);
    const point15 = new Point(viewer, [-181, -37], 403, 7075510);
    const point16 = new Point(viewer, [149, 4], 337, 9110590);
    const point17 = new Point(viewer, [-104, -66], 803, 8343390);
    const point18 = new Point(viewer, [15, 41], 225, 1818700);
    const point19 = new Point(viewer, [-173, -81], 874, 3268810);
    const point20 = new Point(viewer, [121, 31], 792, 9450240);
    const point21 = new Point(viewer, [-23, -73], 415, 9538930);
    const point22 = new Point(viewer, [139, 64], 241, 7580550);
    const point23 = new Point(viewer, [-72, -17], 818, 6385560);
    const point24 = new Point(viewer, [106, 73], 921, 9412890);
    const point25 = new Point(viewer, [-4, -50], 365, 9589530);
    const point26 = new Point(viewer, [148, 22], 381, 4258270);
    const point27 = new Point(viewer, [-134, -17], 996, 2405090);
    const point28 = new Point(viewer, [75, 32], 289, 5117280);
    const point29 = new Point(viewer, [-53, -88], 229, 1553520);
    const point30 = new Point(viewer, [65, 37], 898, 8773390);
    const point31 = new Point(viewer, [-44, -52], 499, 5628940);
    const point32 = new Point(viewer, [8, 87], 961, 9364770);
    const point33 = new Point(viewer, [-131, -24], 67, 2173320);
    const point34 = new Point(viewer, [42, 35], 529, 3187560);
    const point35 = new Point(viewer, [-147, -23], 176, 1855540);
    const point36 = new Point(viewer, [180, 8], 361, 6110320);
    const point37 = new Point(viewer, [-125, -77], 275, 7307220);
    const point38 = new Point(viewer, [155, 78], 281, 2340920);
    const point39 = new Point(viewer, [-18, -36], 222, 4014220);
    const point40 = new Point(viewer, [110, 17], 290, 4856380);
    const point41 = new Point(viewer, [-130, -49], 506, 6154320);
    const point42 = new Point(viewer, [31, 71], 3, 3300310);
    const point43 = new Point(viewer, [-161, -6], 916, 7965330);
    const point44 = new Point(viewer, [163, 66], 475, 2078770);
    const point45 = new Point(viewer, [-164, -16], 555, 9416910);
    const point46 = new Point(viewer, [112, 9], 794, 9251290);
    const point47 = new Point(viewer, [-96, -77], 530, 6061690);
    const point48 = new Point(viewer, [169, 69], 367, 8491820);
    const point49 = new Point(viewer, [-175, -37], 436, 2395880);
    const point50 = new Point(viewer, [11, 58], 660, 6965660);

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