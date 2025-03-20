import * as THREE from 'three'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

import { scene } from './index'
import { FileLoader } from 'three'
import { line } from './line'
import { shapeMesh } from './shapeMesh'
import {tag} from './tag'

const group = new THREE.Group()
const linegroup = new THREE.Group()
const backlinegroup = new THREE.Group()
const shapegroup = new THREE.Group()
const taggroup = new THREE.Group()

linegroup.position.z -= 0
const loader = new THREE.FileLoader();
loader.setResponseType('json')

// 加载GDP数据
loader.load('/model/example/Basic_06/GeoJSON数据/gdp.json', function (data) {
  var gdpObj = {};//每个省份的名字作为属性，属性值是国家对应GDP
  var color1 = new THREE.Color(0xffffff);
  var color2 = new THREE.Color(0xff8888); //GDP最高对应颜色
  var gdpMax = 10000//设置一个基准值,以最高的郑州gdp为准
  data.arr.forEach(function (obj) {
    var gdp = obj.value;//当前省份GDP
    gdpObj[obj.name] = gdp;//每个省份的名字作为属性，属性值是国家对应GDP
  })

  //  加载 "河南.json"，结构和./china.json 一样，地级市对应省份
  loader.load('/model/example/Basic_06/GeoJSON数据/河南.json', function (data2) {
    // 访问所有子行政区(地级市)边界坐标数据：data.features
    data2.features.forEach(function (area) {
      // "Polygon"：省份area有一个封闭轮廓
      //"MultiPolygon"：省份area有多个封闭轮廓
      if (area.geometry.type === "Polygon") {
        // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
        area.geometry.coordinates = [area.geometry.coordinates];
      }
      var name = area.properties.name;//地级市名
      // height：行政区轮廓拉伸高度，和gdp大小正相关，不过注意相机渲染范围(或者说地图尺寸范围)
      var height = gdpObj[name] / 10000;//拉伸高度
      var mesh = shapeMesh(area.geometry.coordinates, height)
      mesh.name = name;//设置mesh对应的地级市名字
      shapegroup.add(mesh);//地级市轮廓拉伸Mesh插入组对象mapGroup
      // 颜色插值计算
      var color = color1.clone().lerp(color2.clone(), Math.sqrt(gdpObj[mesh.name] / gdpMax));
      mesh.material.color.copy(color);

      var tag3D = tag(mesh.name);
      var center = area.properties.centroid;//行政区几何中心经纬度坐标
      tag3D.position.set(center[0], center[1], height + 0.01)
      //缩放CSS3DObject模型对象
      tag3D.scale.set(0.007, 0.007, 0.007);//根据相机渲染范围适当缩放
      // tag3D.rotateX(Math.PI / 2);//从XOY平面旋转到XOZ平面
      taggroup.add(tag3D);

      // 解析所有封闭轮廓边界坐标area.geometry.coordinates
      var lines = line(area.geometry.coordinates);
      linegroup.add(lines);//地级市边界轮廓插入组对象lineGroup
      var line2 = lines.clone();
      line2.position.z = height;//顶部边界线跟随轮廓拉伸高度保持一致
      backlinegroup.add(line2);
    });
  })
})
//加载一个文本文件，并把结果输出到控制台上
// loader.load('/model/example/Basic_06/GeoJSON数据/河南.json', function (data) {

//   data.features.forEach(function (area) {
//     // "Polygon"：国家area有一个封闭轮廓
//     //"MultiPolygon"：国家area有多个封闭轮廓
//     if (area.geometry.type === "Polygon") {
//       // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
//       area.geometry.coordinates = [area.geometry.coordinates];
//     }
//     // 解析所有封闭轮廓边界坐标area.geometry.coordinates
//     linegroup.add(line(area.geometry.coordinates));//国家边界轮廓插入组对象mapGroup
//     shapegroup.add(shapeMesh(area.geometry.coordinates));//国家轮廓Mesh插入组对象mapGroup
//   });
//   backlinegroup.copy(linegroup)
//   backlinegroup.position.z -= 2.5
//   //使用包围盒进行相机视角的适配
//   const bbox = new THREE.Box3()
//   bbox.expandByObject(shapegroup)
//   var scaleV3 = new THREE.Vector3()
//   bbox.getSize(scaleV3)

//   var center = new THREE.Vector3()
//   bbox.getCenter(center)
//   console.log(scaleV3,center)//来根据两个三维向量设置相机

// });
group.add(backlinegroup)
group.add(linegroup)
group.add(shapegroup)
group.add(taggroup)



export { group, shapegroup }