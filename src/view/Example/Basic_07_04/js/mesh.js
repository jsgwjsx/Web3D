import * as THREE from 'three'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { scene } from './index'
import { earth, lon2xyz } from './earth'
import { FileLoader } from 'three'
import config from './config'
import sprite from './Sprite'
import { landPoints} from './countryMesh/index';

var R = config.R//设置地球半径

//加载地球
const group = new THREE.Group()
group.add(earth)


//加载地球光晕
group.add(sprite)

var loader = new THREE.FileLoader()
loader.setResponseType('json')
loader.load('/model/example/Basic_07/world.json', function (data) {
   var points = landPoints(R, data);//渲染陆地上网格点阵数据
group.add(points);


})


export { group }