import * as THREE from 'three'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { scene } from './index'
import {earth, lon2xyz } from './earth'
import {createHelpSphereMesh} from './help'
import { FileLoader } from 'three'
import {countryLine} from './line'
import config from './config'
import sprite from './Sprite'
import {flyArcGroup} from './FlyArc'

var R = config.R//设置地球半径

//加载地球
const group = new THREE.Group()
group.add(earth)

//加载飞线
group.add(flyArcGroup)

//加载国家边界线
group.add(countryLine(R))

//加载地球光晕
group.add(sprite)




export { group }