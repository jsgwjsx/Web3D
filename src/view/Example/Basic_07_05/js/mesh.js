import * as THREE from 'three'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { scene } from './index'
import { earth, lon2xyz } from './earth'
import { FileLoader } from 'three'
import config from './config'
import sprite from './Sprite'
import { countryLine } from './line'
import { countryMesh } from './countryMesh/index.js';//每个国家对应球面Mesh
import {getCountryGdpColor} from './countryGdpColor.js'
import bboxgroup from './bboxCreate.js'


var R = config.R//设置地球半径

//加载地球
const group = new THREE.Group()
group.add(earth)//加载地球

const Boxgroup = new THREE.Group()


group.meshArr = [];//用于鼠标射线拾取
var loader = new THREE.FileLoader()
loader.setResponseType('json')
loader.load('/model/example/Basic_07/worldZh.json', function (data) {
        data.features.forEach(function (country) {
            // "Polygon"：国家country有一个封闭轮廓
            //"MultiPolygon"：国家country有多个封闭轮廓
            if (country.geometry.type === "Polygon") {
                // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
                country.geometry.coordinates = [country.geometry.coordinates];
            }
            // 解析所有封闭轮廓边界坐标country.geometry.coordinates
            // R * 1.001比地球R稍大，以免深度冲突
            var line = countryLine(R * 1.002, country.geometry.coordinates);//国家边界
            var mesh = countryMesh(R * 1.001, country.geometry.coordinates);//国家轮廓mesh
            group.add(mesh)
            group.add(line)
            group.meshArr.push(mesh);

            mesh.name = country.properties.nameZh;//设置每个国家mesh对应的中文名
  
        })
})

//加载柱子
group.add(bboxgroup)


//加载地球光晕
group.add(sprite)

export { group }