import * as THREE from 'three'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { scene } from './index'
import {earth, lon2xyz } from './earth'
import {createHelpSphereMesh} from './help'
import { FileLoader } from 'three'
import {countryLine} from './line'
import config from './config'
import sprite from './Sprite'
import {HotNews} from './HotNews'

var R = config.R//设置地球半径

//加载地球
const group = new THREE.Group()
group.add(earth)


group.add(HotNews);//所有新闻热点Mesh作为earth子对象

//加载国家边界线
group.add(countryLine(R))

//加载地球光晕
group.add(sprite)


export { group }