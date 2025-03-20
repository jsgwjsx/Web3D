import config from '../config'
import * as THREE from 'three'
import { lon2xyz } from '../earth'
import { createFlyLine } from './FlyLine.js'
var R = config.R;//地球半径

function flyArc(lon1, lat1, lon2, lat2) {
    //坐标转换
    var sphereCoord1 = lon2xyz(R, lon1, lat1)
    var sphereCoord2 = lon2xyz(R, lon2, lat2)
    //轨迹线球面坐标
    var startSphereCoord = new THREE.Vector3(sphereCoord1.x, sphereCoord1.y, sphereCoord1.z)
    var endSphereCoord = new THREE.Vector3(sphereCoord2.x, sphereCoord2.y, sphereCoord2.z)
    //计算绘制圆弧需要的关于y轴对称的起点、结束点和旋转四元数
    var startEndQua = _3Dto2D(startSphereCoord, endSphereCoord)
    // 调用arcXOY函数绘制一条圆弧飞线轨迹
    var arcline = arcXOY(startEndQua.startPoint, startEndQua.endPoint);
    arcline.quaternion.multiply(startEndQua.quaternion)
    return arcline

}
function _3Dto2D(startSphere, endSphere) {
    var origin = new THREE.Vector3(0, 0, 0)
    var startDir = startSphere.clone().sub(origin)
    var endDir = endSphere.clone().sub(origin)
    // dir1和dir2构成一个三角形，.cross()叉乘计算该三角形法线normal
    var normal = startDir.clone().cross(endDir).normalize()
    var xoyNormal = new THREE.Vector3(0, 0, 1)
    var quaternion3D_XOY = new THREE.Quaternion().setFromUnitVectors(normal, xoyNormal)//用来记录将三角形旋转到xoy平面上所需要旋转的旋转弧度
    //将弧度应用到startDir与endDir上面,三维空间中的立体空间变成了二维的平面
    var startSphereXOY = startSphere.clone().applyQuaternion(quaternion3D_XOY)
    var endSphereXOY = endSphere.clone().applyQuaternion(quaternion3D_XOY)

    //计算第二次旋转的四原数
    var middleV3 = startSphereXOY.clone().add(endSphereXOY).multiplyScalar(0.5)
    var midDir = middleV3.clone().sub(origin).normalize();// 旋转前向量midDir，中点middleV3和球心构成的方向向量
    var yDir = new THREE.Vector3(0, 1, 0);// 旋转后向量yDir，即y轴
    // .setFromUnitVectors()计算从midDir向量旋转达到yDir向量所需要的四元数
    // quaternion2表示让第一次旋转到XOY平面的起点和结束点关于y轴对称需要的四元数
    var quaternionXOY_Y = new THREE.Quaternion().setFromUnitVectors(midDir, yDir);
    /*第二次旋转：使旋转到XOY平面的点再次旋转，实现关于Y轴对称*/
    var startSpherXOY_Y = startSphereXOY.clone().applyQuaternion(quaternionXOY_Y);
    var endSphereXOY_Y = endSphereXOY.clone().applyQuaternion(quaternionXOY_Y);

    var quaternionInverse = quaternion3D_XOY.clone().invert().multiply(quaternionXOY_Y.clone().invert())
    return {
        // 返回两次旋转四元数的逆四元数
        quaternion: quaternionInverse,
        // 范围两次旋转后在XOY平面上关于y轴对称的圆弧起点和结束点坐标
        startPoint: startSpherXOY_Y,
        endPoint: endSphereXOY_Y,
    }

}

function arcXOY(startPoint, endPoint) {
    //计算两点中点
    var middleV3 = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5)
    var dir = middleV3.clone().normalize()
    //计算夹角
    var earthRadianAngle = radiansAOB(startPoint, endPoint, new THREE.Vector3(0, 0, 0))
    //飞线圆弧开始角度
    /*设置飞线轨迹圆弧的中间点坐标
  弧度值 * R * 0.2：表示飞线轨迹圆弧顶部距离地球球面的距离
  起点、结束点相聚越远，构成的弧线顶部距离球面越高*/
    var arcTopCoord = dir.multiplyScalar(R + earthRadianAngle * R * 0.2)
    //三个点求圆心
    var flyArcCenter = threePointCenter(startPoint, endPoint, arcTopCoord)
    //飞线圆弧轨迹
    var flyArcR = Math.abs(flyArcCenter.y - arcTopCoord.y)

    //计算圆弧起始角度
    var flyRadianbAngle = radiansAOB(startPoint, new THREE.Vector3(0, -1, 0), flyArcCenter)
    var startAngle = -Math.PI / 2 + flyRadianbAngle
    var endAngle = Math.PI - startAngle
    // 调用圆弧线模型的绘制函数
    var arcline = circleLine(flyArcCenter.x, flyArcCenter.y, flyArcR, startAngle, endAngle)
    // var arcline = new THREE.Group();// 不绘制轨迹线，使用THREE.Group替换circleLine()即可
    arcline.center = flyArcCenter;//飞线圆弧自定一个属性表示飞线圆弧的圆心
    arcline.topCoord = arcTopCoord;//飞线圆弧自定一个属性表示飞线圆弧中间也就是顶部坐标


    //截取线段内部的点，设置为飞线
    var flyAngle = (endAngle - startAngle) / 12;//飞线圆弧的长度
    //绘制一段飞线，圆心作为坐标原点
    var flyLine = createFlyLine(flyArcR, startAngle, startAngle + flyAngle)
    flyLine.position.y = flyArcCenter.y;//平移飞线圆弧和飞线轨迹圆弧重合
    //飞线段flyLine作为飞线轨迹arcLine子对象，继承飞线轨迹平移旋转等变换
    arcline.add(flyLine);
    //飞线段运动范围startAngle~flyEndAngle
    flyLine.flyEndAngle = endAngle - startAngle - flyAngle;
    flyLine.startAngle = startAngle;
    // arcline.flyEndAngle：飞线段当前角度位置，这里设置了一个随机值用于演示
    flyLine.AngleZ = arcline.flyEndAngle * Math.random();
    // flyLine.rotation.z = arcline.AngleZ;
    // arcline.flyLine指向飞线段,便于设置动画是访问飞线段
    arcline.flyLine = flyLine;
    return arcline

}
/*绘制一条圆弧曲线模型Line
5个参数含义：(圆心横坐标, 圆心纵坐标, 飞线圆弧轨迹半径, 开始角度, 结束角度)*/
function circleLine(x, y, r, startAngle, endAngle) {
    var geometry = new THREE.BufferGeometry(); //声明一个几何体对象Geometry
    // THREE.ArcCurve创建圆弧曲线
    var arc = new THREE.ArcCurve(x, y, r, startAngle, endAngle, false);
    //getSpacedPoints是基类Curve的方法，返回一个vector2对象作为元素组成的数组
    var points = arc.getSpacedPoints(50); //分段数50，返回51个顶点
    geometry.setFromPoints(points);// setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
    var material = new THREE.LineBasicMaterial({ color: 0x009999, });//线条材质
    var line = new THREE.Line(geometry, material);//线条模型对象
    return line;
}
function radiansAOB(A, B, O) {
    // dir1、dir2：球面上两个点和球心构成的方向向量
    var dir1 = A.clone().sub(O).normalize();
    var dir2 = B.clone().sub(O).normalize();
    //点乘.dot()计算夹角余弦值
    var cosAngle = dir1.clone().dot(dir2);
    var radianAngle = Math.acos(cosAngle);//余弦值转夹角弧度值,通过余弦值可以计算夹角范围是0~180度
    // console.log('夹角度数',THREE.Math.radToDeg(radianAngle));
    return radianAngle
}
//求三个点的外接圆圆心，p1, p2, p3表示三个点的坐标Vector3。
function threePointCenter(p1, p2, p3) {
    var L1 = p1.lengthSq();//p1到坐标原点距离的平方
    var L2 = p2.lengthSq();
    var L3 = p3.lengthSq();
    var x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y, x3 = p3.x, y3 = p3.y;
    var S = x1 * y2 + x2 * y3 + x3 * y1 - x1 * y3 - x2 * y1 - x3 * y2;
    var x = (L2 * y3 + L1 * y2 + L3 * y1 - L2 * y1 - L3 * y2 - L1 * y3) / S / 2;
    var y = (L3 * x2 + L2 * x1 + L1 * x3 - L1 * x2 - L2 * x3 - L3 * x1) / S / 2;
    // 三点外接圆圆心坐标
    var center = new THREE.Vector3(x, y, 0);
    return center
}

export { flyArc }