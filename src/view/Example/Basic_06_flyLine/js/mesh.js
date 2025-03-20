import * as THREE from 'three'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { scene } from './index'
import { FileLoader } from 'three'
import { line } from './line'
import { shapeMesh } from './shapeMesh'
import {cityPointMesh} from './cityPointMesh'
import { _s } from './index'
import { Conemesh } from './ConeGeometry'
import {updateFly} from './fly'
var ChildrenNum

const group = new THREE.Group()
const linegroup = new THREE.Group()
const backlinegroup = new THREE.Group()
const shapegroup = new THREE.Group()
const mapgroup = new THREE.Group()
//const taggroup = new THREE.Group()


linegroup.position.z += 2.3
const loader = new THREE.FileLoader();
loader.setResponseType('json')

  //加载地图模块与波纹效果
loader.load('/model/example/Basic_06/GeoJSON数据/china.json', function (data) {
  //childrenName
  ChildrenNum = {}
  data.features.forEach(function (area) {
    // "Polygon"：国家area有一个封闭轮廓
    //"MultiPolygon"：国家area有多个封闭轮廓
    if (area.geometry.type === "Polygon") {
      // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
      area.geometry.coordinates = [area.geometry.coordinates];
    }
    // 解析所有封闭轮廓边界坐标area.geometry.coordinates
    linegroup.add(line(area.geometry.coordinates));//国家边界轮廓插入组对象mapGroup
    var mesh =shapeMesh(area.geometry.coordinates,area.properties.name)
    shapegroup.add(mesh);//国家轮廓Mesh插入组对象mapGroup
    var pos = area.properties.cp;
    var size = 1.2;
    if(pos){
      //波纹
      var curr = cityPointMesh(size,pos[0],pos[1])
      curr .position.z += 2.3
      curr .s =_s*Math.random() + 1
      mapgroup.add(curr)
      mesh.currguation = curr

      ChildrenNum[area.properties.name] = area.properties.childNum
    }

  });
    updateFly('河南',ChildrenNum)  
});




group.add(backlinegroup)//背面边界线
group.add(linegroup) //边界线
group.add(shapegroup)//mesh图层
group.add(mapgroup) //省会城市波纹
//group.add(taggroup) //省会城市标注
group.add(Conemesh)


export { group,mapgroup,shapegroup,ChildrenNum }