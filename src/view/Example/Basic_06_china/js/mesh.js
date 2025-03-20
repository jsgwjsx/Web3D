import * as THREE from 'three'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import {Conemesh} from './ConeGeometry'
import { scene } from './index'
import { FileLoader } from 'three'
import { line } from './line'
import { shapeMesh } from './shapeMesh'
import {cityPointMesh} from './cityPointMesh'
//import { tag } from './tag'

const group = new THREE.Group()
const linegroup = new THREE.Group()
const backlinegroup = new THREE.Group()
const shapegroup = new THREE.Group()
const mapgroup = new THREE.Group()
//const taggroup = new THREE.Group()


linegroup.position.z += 2.3
const loader = new THREE.FileLoader();
loader.setResponseType('json')
loader.load('/model/example/Basic_06/非GeoJSON数据/gdp.json',function(data){
  var gdpObj = {}
  var color1 = new THREE.Color(0xffffff);
  var color2 = new THREE.Color(0xff0000);
  var gdpMax = 110000;
  data.arr.forEach(obj=>{
    var gdp = obj.value
    gdpObj[obj.name] = gdp
  })
  //加载一个文本文件，并把结果输出到控制台上
loader.load('/model/example/Basic_06/GeoJSON数据/其它GeoJSON/china-详细.json', function (data) {

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
    var color = color1.clone().lerp(color2.clone(),gdpObj[mesh.name]/gdpMax)
    mesh.material.color.copy(color)
    mesh.gdp = gdpObj[mesh.name]
    mesh.lnglat = area.properties.center
    mesh.color = color

    var pos = area.properties.center;
    var size = 1.2;
    if(pos){
      //波纹
      var mesh = cityPointMesh(size,pos[0],pos[1])
      mesh.position.z += 2.3
      mapgroup.add(mesh)

      //标签
      // console.log(area.properties.name)
      // var Taglabel = tag(area.properties.name,pos[0],pos[1],2.5)
      // taggroup.add(Taglabel)
    }
  
  });
  backlinegroup.copy(linegroup)
  backlinegroup.position.z -= 2.5
  //使用包围盒进行相机视角的适配
  const bbox = new THREE.Box3()
  bbox.expandByObject(shapegroup)
  var scaleV3 = new THREE.Vector3()
  bbox.getSize(scaleV3)

  var center = new THREE.Vector3()
  bbox.getCenter(center)
  console.log(scaleV3,center)//来根据两个三维向量设置相机

});
})


group.add(Conemesh)




group.add(backlinegroup)//背面边界线
group.add(linegroup) //边界线
group.add(shapegroup)//mesh图层
group.add(mapgroup) //省会城市波纹
//group.add(taggroup) //省会城市标注



export { group,mapgroup,shapegroup }