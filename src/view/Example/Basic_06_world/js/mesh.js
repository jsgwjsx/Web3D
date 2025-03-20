import * as THREE from 'three'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { scene } from './index'
import { FileLoader } from 'three'
import { line } from './line'
import { shapeMesh } from './shapeMesh'

const group = new THREE.Group()
const linegroup = new THREE.Group()
const shapegroup = new THREE.Group()
linegroup.position.z += 1.0



const loader = new THREE.FileLoader();
loader.setResponseType('json')
//地图本体
loader.load('/model/example/Basic_06/GeoJSON数据/world.json', function (data) {

  data.features.forEach(function (area) {
    // "Polygon"：国家area有一个封闭轮廓
    //"MultiPolygon"：国家area有多个封闭轮廓
    if (area.geometry.type === "Polygon") {
      // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
      area.geometry.coordinates = [area.geometry.coordinates];
    }
    // 解析所有封闭轮廓边界坐标area.geometry.coordinates
    linegroup.add(line(area.geometry.coordinates));//国家边界轮廓插入组对象mapGroup
    shapegroup.add(shapeMesh(area.geometry.coordinates));//国家轮廓Mesh插入组对象mapGroup
  });
});
group.add(linegroup)
group.add(shapegroup)

loader.load('/model/example/Basic_06/非GeoJSON数据/人口密度.json', function (data) {
  var coord = data.population
  var max = 500
  var color1 = new THREE.Color(0x229977);
  var color2 = new THREE.Color(0x29ee77)
  var geoArr = [];


  for (var i = 0; i < coord.length; i++) {
    var height = coord[i][2]
    var boxheight = height / 100
    var geometry = new THREE.BoxGeometry(0.3, 0.3, boxheight)
    geometry.translate(coord[i][0], coord[i][1],boxheight/ 2)//(0.5是高度的一半)
    var color = color1.clone().lerp(color2.clone(), height / max)
    //设置柱子颜色为渐进色
    var colorArr = [];//几何体所有顶点颜色数据
    for (var j = 0; j < geometry.attributes.position.count; j++) {
      colorArr.push(color.r, color.g, color.b)
    }
    //对顶点颜色进行一次处理，为每一个柱体设置不同的颜色
    var colorAttribute = new THREE.BufferAttribute(new Float32Array(colorArr), 3);
    //设置几何体 顶点颜色数据
    geometry.attributes.color = colorAttribute;
    geoArr.push(geometry)
  }
  var BufferGeometry = BufferGeometryUtils.mergeBufferGeometries(geoArr)
  var pos = BufferGeometry.attributes.position
  var col = BufferGeometry.attributes.color
  var index = pos.count

  //对顶点颜色进行二次处理，每一个柱体的顶部与底部设置不同的颜色，从而实现颜色渐进
  for(var i = 0;i<index;i++){//
    if(pos.getZ(i)<0.0001){//底部点颜色
      col.setX(i,col.getX(i)*0.0)
      col.setY(i,col.getY(i)*0.1)
      col.setZ(i,col.getZ(i)*0.1)
    }else{//顶部点颜色
      col.setX(i,col.getX(i)*0.0)
      col.setY(i,col.getY(i)*1.0)
      col.setZ(i,col.getZ(i)*1.0)
    }
  }
    var material = new THREE.MeshLambertMaterial({
      vertexColors: true
    })
    var mesh = new THREE.Mesh(BufferGeometry, material)
    mesh.position.z+=1.0
    scene.add(mesh)
  
});


export { group }