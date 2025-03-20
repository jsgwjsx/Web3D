import * as THREE from 'three'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { scene } from './index'
import { FileLoader } from 'three'
import { line } from './line'
import { shapeMesh } from './shapeMesh'


const group = new THREE.Group()
const linegroup = new THREE.Group()
const backlinegroup = new THREE.Group()
const shapegroup = new THREE.Group()
const potGroup = new THREE.Group()
const roadGroup = new THREE.Group()
potGroup.position.z += 0.1
linegroup.position.z += 0.1
roadGroup.position.z += 0.2
const loader = new THREE.FileLoader();
loader.setResponseType('json')

loader.load('/model/example/Basic_06/GeoJSON数据/其它GeoJSON/china-详细.json', function (data) {

  data.features.forEach(function (area) {
    // "Polygon"：国家area有一个封闭轮廓
    //"MultiPolygon"：国家area有多个封闭轮廓
    if (area.geometry.type === "Polygon") {
      // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
      area.geometry.coordinates = [area.geometry.coordinates];
    }
    // 解析所有封闭轮廓边界坐标area.geometry.coordinates
    linegroup.add(line(area.geometry.coordinates));//国家边界轮廓插入组对象lineGroup
    var mesh = shapeMesh(area.geometry.coordinates, area.properties.name)
    shapegroup.add(mesh);//国家轮廓Mesh插入组对象shapeGroup
  });
  backlinegroup.copy(linegroup)
  backlinegroup.position.z -= 0.1
});


loader.load('/model/example/Basic_06/非GeoJSON数据/微博签到数据.json', function (data) {
  var coord = data.coordinates
  var verticesArr = []
  for (var i = 0; i < coord.length; i += 2) {
    verticesArr.push(new THREE.Vector3(coord[i],coord[i+1],0))
  }
  var geometry = new THREE.BufferGeometry()
  geometry.setFromPoints(verticesArr)
  var material = new THREE.PointsMaterial({
    color:0xffff00,
    size:0.2
  })
  var points = new THREE.Points(geometry,material)
  potGroup.add(points)
})
loader.load('/model/example/Basic_06/非GeoJSON数据/公交轨迹.json', function (data) {
  var coords = data.coordinates;//所有经纬度坐标数据
  var group = new THREE.Group();
  coords.forEach(function (coord) {
    var verticesArr = [];//所有顶点数据，三个元素为一组
    for (var i = 0; i < coord.length; i += 2) {
      verticesArr.push(coord[i], coord[i + 1], 0);//经纬度作为顶点xy坐标，顶点z坐标设置为0        
    }
    var geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象
    //3个为一组，表示一个顶点的xyz坐标
    var attribute = new THREE.BufferAttribute(new Float32Array(verticesArr), 3);
    // 设置几何体attributes属性的位置属性
    geometry.attributes.position = attribute;
    // 线材质
    var material = new THREE.LineBasicMaterial({
      color: 0x00ffff,
    });
    // 线模型
    var line = new THREE.Line(geometry, material); //点模型对象
    roadGroup.add(line);
  })
})

group.add(backlinegroup)//背面边界线
group.add(linegroup) //边界线
group.add(shapegroup)//mesh图层
group.add(potGroup)//点图
group.add(roadGroup)//线图


export { group, shapegroup, potGroup }