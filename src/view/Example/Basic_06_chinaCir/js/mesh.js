import * as THREE from 'three'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { scene } from './index'
import { FileLoader } from 'three'
import { line } from './line'
import { shapeMesh } from './shapeMesh'
import {cirMesh} from './cirMesh'
//import { tag } from './tag'

const group = new THREE.Group()
const linegroup = new THREE.Group()
const backlinegroup = new THREE.Group()
const shapegroup = new THREE.Group()
const cirGroup = new THREE.Group()

cirGroup.position.z += 0.1
linegroup.position.z += 0.1
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
    var mesh =shapeMesh(area.geometry.coordinates,area.properties.name)
    shapegroup.add(mesh);//国家轮廓Mesh插入组对象shapeGroup
  });
  backlinegroup.copy(linegroup)
  backlinegroup.position.z -= 0.1
});


// ./数据.json包含城市的经纬度坐标和对应的PM2.5值
loader.load('/model/example/Basic_06/非GeoJSON数据/数据.json', function (data) {

  // GDP最高对应红色，GDP最低对应白色
  var color1 = new THREE.Color(0x00ffcc);
  var color2 = new THREE.Color(0xff6666);

  var pmArr = [];//所有pm2.5数据集合
  data.arr.forEach(function (obj) {
    var pm25 = obj.value;//访问数据PM2.5值
    pmArr.push(pm25);
  })
  pmArr.sort((a,b)=>{
    return a-b
  });
  console.log(pmArr)
  // console.log('排序后pm2.5',pmArr);
  var Max = pmArr[pmArr.length - 1]//PM2.5最大值作为基准值
  data.arr.forEach(function (obj) {
    var pm25 = obj.value
    // 颜色插值计算
    var color = color1.clone().lerp(color2.clone(), pm25 / Max);
    // 气泡大小和pm2.5正相关，同时注意根据相机渲染范围来设置合适大小
    var mesh = cirMesh(obj.coordinate[0], obj.coordinate[1], pm25 / Max*1.2, color.getHex())
    cirGroup.add(mesh);
    mesh.name = obj.name;
    mesh.pm25 = pm25;//mesh自定义一个gdp属性，用于标签设置
    mesh.lnglat = obj.coordinate;//用于控制标签位置
    mesh.color = color;//记录下自身的颜色，以便选中改变mesh颜色的时候，不选中状态再改变回来
  })
})


group.add(backlinegroup)//背面边界线
group.add(linegroup) //边界线
group.add(shapegroup)//mesh图层
group.add(cirGroup)//气泡图



export { group,shapegroup,cirGroup }