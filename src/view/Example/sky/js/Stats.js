//引入Stats模块
import Stats from 'three/addons/libs/stats.module.js';
var stats = new Stats()
//设置监视器位置
stats.domElement.style.position = 'absolute'
stats.domElement.style.left = '0px'
stats.domElement.style.top = '0px'

export {stats}
