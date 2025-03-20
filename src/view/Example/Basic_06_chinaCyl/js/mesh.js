import * as THREE from 'three'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { scene } from './index'
import { FileLoader } from 'three'
import { line } from './line'
import { shapeMesh } from './shapeMesh'
import { cirMesh } from './cirMesh'
import { tag } from './tag'
import {CreateCyl} from './clyCreate'

const group = new THREE.Group()
//地图
const linegroup = new THREE.Group()
const backlinegroup = new THREE.Group()
const shapegroup = new THREE.Group()
//数据
const cylGroup = new THREE.Group()
const tagGroup = new THREE.Group()

tagGroup.position.z += 0.1
linegroup.position.z += 0.1
const loader = new THREE.FileLoader();
loader.setResponseType('json')
loader.load('/model/example/Basic_06/非GeoJSON数据/gdp.json', function (data) {
  loader.load('/model/example/Basic_06/GeoJSON数据/其它GeoJSON/china-详细.json', function (data2) {
    //加载地图
    data2.features.forEach(function (area) {
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

      //加载处理GDP数据
      // GDP最高对应红色，GDP最低对应白色
      var color1 = new THREE.Color(0xffff00);
      var color2 = new THREE.Color(0xff0000);
      var GDPmax = 107671.07

      var GDPArr = {};//所有pm2.5数据集合
      data.arr.forEach((v) => {
        GDPArr[v.name] = v.value
      })

      var color = color1.clone().lerp(color2.clone(),GDPArr[mesh.name]/GDPmax)
      var height = GDPArr[mesh.name]/10000


      if (area.properties.center) {
        //标签
        var label = tag(mesh.name, area.properties.center[0], area.properties.center[1],height)
        tagGroup.add(label)

        //cly柱体
        var cyl = CreateCyl(area.properties.center[0], area.properties.center[1],color,height,0.5)
        cylGroup.add(cyl)
      }

    });
    backlinegroup.copy(linegroup)
    backlinegroup.position.z -= 0.1




  });
})

// ./数据.json包含城市的经纬度坐标和对应的PM2.5值


group.add(backlinegroup)//背面边界线
group.add(linegroup) //边界线
group.add(shapegroup)//mesh图层
group.add(tagGroup)//标签
group.add(cylGroup)//柱体


export { group, shapegroup }