import * as THREE from 'three'
import { data } from './flydata'
import { updateCone } from './ConeGeometry'
import { CreateCyl } from './clyCreate'
import { scene } from './index.js'
var dataArr = data()
var eventGroup;
var flyGroup
function updateFly(name, ChildrenNum) {
    //清除原有的eventGroup
    eventGroup ? clearGroup(eventGroup) : ''

    var start = null;
    var endArr = []
    dataArr.forEach((coord, index) => {
        if (coord.name == name) {
            //所有飞线的起点
            start = new THREE.Vector3(coord.E, coord.N, 0)
        } else {
            //所有飞线的终点
            endArr.push(coord)
        }
    })
    //绘制当前省份对应的所有的cyl柱体与Cone三棱锥
    updateCone(start.x, start.y, start.z)
    eventGroup = new THREE.Group()
    eventGroup.position.z += 2.3
    var cyl = updateCly(endArr, ChildrenNum)
    var flyLine = updateLine(start, endArr)

    eventGroup.add(cyl, flyLine[0], flyLine[1])
    scene.add(eventGroup)



}
function updateCly(endArr, ChildrenNum) {
    var color1 = new THREE.Color(0x00ffff);
    var color2 = new THREE.Color(0x00ff33);
    var maxH = 40
    var cylGroup = new THREE.Group()
    endArr.forEach((value) => {
        //console.log(value.name,ChildrenNum[value.name])
        var h = (ChildrenNum[value.name] / maxH) * 10 //[0,10]
        var color = color1.clone().lerp(color2.clone(), ChildrenNum[value.name] / maxH)
        var bbox = CreateCyl(value.E, value.N, color, h, 1.0)
        cylGroup.add(bbox)
    })
    return cylGroup
}

function clearGroup(group) {
    const clearCache = (item) => {
        if (item.geometry && item.material) {
            item.geometry.dispose();
            item.material.dispose();
        }

    };
    const removeObj = (obj) => {
        let arr = obj.children.filter((x) => !!x);
        arr.forEach((item) => {
            if (item.children.length) {
                removeObj(item);
            } else {
                clearCache(item);
            }
        });
        obj.clear();
        arr = null;
    };
    removeObj(group);
}
function updateLine(start, endArr) {
    flyGroup = new THREE.Group()
    var flyTrack = new THREE.Group()
    endArr.forEach((cood) => {
        var end = new THREE.Vector3(cood.E, cood.N, 0); //终
        //飞线运动轨迹绘制函数flyTrack
        var flyTrack = flyTrackFun(start, end);
        flyGroup.add(flyTrack); //线条对象添加到场景中
        // 获取飞线轨迹线上的顶点坐标，用于飞线段绘制
        var points = flyTrack.flyTrackPoints;

        var index = 20; //飞线索引起点
        var flyline = flylineFun(index, points); //绘制一段飞线

        flyline.index = Math.floor((points.length - flyline.num) * Math.random()); //索引位置随机
        flyTrack.add(flyline); //飞线段flyline作为飞线轨迹flyTrack子对象，可以继承飞线轨迹平移旋转等变换
    })
    return [flyGroup, flyTrack]
}
function flyTrackFun(start, end) {
    // var H = 3; //弧线高度全部一样
    var length = start.clone().sub(end).length();
    var H = length * 0.1; //根据两点之间距离设置弧线高度
    var middle = new THREE.Vector3(0, 0, 0);
    middle.add(start).add(end).divideScalar(2)
    // middle.y += H;
    middle.z += H; //调整高度方向为z

    var geometry = new THREE.BufferGeometry(); //声明一个几何体对象Geometry
    // 起始点坐标和弧线高度确定一条3D样条曲线
    var curve = new THREE.CatmullRomCurve3([
        start,
        middle,
        end
    ]);
    var points = curve.getPoints(100); //分段数100，返回101个顶点，返回一个vector3对象作为元素组成的数组
    geometry.setFromPoints(points); // setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
    //材质对象
    var material = new THREE.LineBasicMaterial({
        color: 0x00aaaa,
    });
    //线条模型对象
    var line = new THREE.Line(geometry, material);
    line.flyTrackPoints = points; // 自定义属性用于飞线动画
    return line;
}
function flylineFun(index, points) {
    var choosePoints = []; //存储飞线轨迹上选择的顶点坐标，用于飞线绘制
    var num = 20; //从曲线上取11个点 飞线长度占飞线轨迹长度的10%  你可通过获取的点数调节飞线长度
    for (var i = 0; i < num; i++) {
        choosePoints.push(points[i + index])
    }
    // 创建一个LineGeometry几何体
    var geometry = new THREE.BufferGeometry();
    var pointArr = []
    //把样条曲线返回的顶点坐标Vector3中xyz坐标提取到pointArr数组中
    choosePoints.forEach(function (v3) {
        pointArr.push(v3.x, v3.y, v3.z)
    })
    // 设置几何体顶点位置坐标
    geometry.attributes.position = new THREE.BufferAttribute(new Float32Array(pointArr), 3);
    var colorArr = []
    for (var i = 0; i < choosePoints.length; i++) {
        var color1 = new THREE.Color(0x006666); //飞线轨迹相近的颜色
        var color2 = new THREE.Color(0xffff00);
        var colo = null
        // posNum：插值计算的临界值  对应color2
        // var posNum = points.length/2;//飞线段，黄色居中，两侧青色
        var posNum = choosePoints.length - 2;
        if (i < posNum) {
            colo = color1.lerp(color2, i / posNum)
        } else {
            colo = color2.lerp(color1, (i - posNum) / (choosePoints.length - posNum))
        }
        colorArr.push(colo.r, colo.g, colo.b)
    }
    //设置几何体顶点颜色值，进行插值计算
    geometry.attributes.color = new THREE.BufferAttribute(new Float32Array(colorArr), 3);
    // //几何体LineGeometry对应的材质LineMaterial
    // var material = new THREE.LineBasicMaterial({
    //     // color: 0xffff00,//使用顶点颜色，材质颜色不用设置
    //     vertexColors: true, //使用顶点颜色插值计算
    //     linewidth: 2.5, // 设置线宽
    // });

    // 点模型渲染几何体每个顶点
    var material = new THREE.PointsMaterial({
        // color: 0xffff00,
        size: 1, //点大小
        vertexColors:true, //使用顶点颜色渲染
    });
    
    var percentArr = []; //attributes.percent的数据
    for (var i = 0; i < pointArr.length; i++) {
        percentArr.push(Math.sqrt(i / pointArr.length));
    }
    var percentAttribue = new THREE.BufferAttribute(new Float32Array(percentArr), 1);
    geometry.attributes.percent = percentAttribue

    material.onBeforeCompile = function (shader) {

        shader.vertexShader = shader.vertexShader.replace(
            'void main() {',
            [
                'attribute float percent;', //顶点大小百分比变量，控制点渲染大小
                'void main() {',
            ].join('\n') // .join()把数组元素合成字符串
        );
        // 调整点渲染大小计算方式
        shader.vertexShader = shader.vertexShader.replace(
            'gl_PointSize = size;',
            [
            'gl_PointSize = percent * size;',
            ].join('\n') // .join()把数组元素合成字符串
        );
    };


    //材质输入Three.js渲染canvas画布的宽高度
    var flyline = new THREE.Points(geometry, material);
    // 自定义飞线属性flyline.num、flyline.index，用于飞线动画
    flyline.num = num;
    flyline.index = index;
    return flyline;
}
// updateFlyGeo：更新飞线几何体顶点位置坐标
function updateFlyGeo(flyline, index, points) {
    var pointArr = []; //存储飞线轨迹上选择的顶点坐标，用于飞线绘制
    for (var i = 0; i < flyline.num; i++) {
        var v3 = points[i + index]
        pointArr.push(v3.x, v3.y, v3.z)
    }
    // 设置几何体顶点位置坐标
    flyline.geometry.attributes.position = new THREE.BufferAttribute(new Float32Array(pointArr), 3);
    //flyline.geometry.verticesNeedUpdate = true; //通知three.js几何体顶点位置坐标数据更新
}

function updateShader(newPoints2) {
    // 每个顶点对应一个百分比数据attributes.percent 用于控制点的渲染大小
    var percentArr = []; //attributes.percent的数据
    for (var i = 0; i < newPoints2.length; i++) {
        percentArr.push(i / newPoints2.length);
    }
    var percentAttribue = new THREE.BufferAttribute(new Float32Array(percentArr), 1);
    geometry2.attributes.percent = percentAttribue;
    // 批量计算所有顶点颜色数据
    var colorArr = [];
    for (var i = 0; i < newPoints2.length; i++) {
        var color1 = new THREE.Color(0x006666); //轨迹线颜色 青色
        var color2 = new THREE.Color(0xffff00); //黄色
        var color = color1.lerp(color2, i / newPoints2.length)
        colorArr.push(color.r, color.g, color.b);
    }
    // 设置几何体顶点颜色数据
    geometry2.attributes.color = new THREE.BufferAttribute(new Float32Array(colorArr), 3);

}
export { updateFly, flyGroup, updateFlyGeo }