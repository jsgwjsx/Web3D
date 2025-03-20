import * as THREE from 'three'
import { mesh } from './mesh'

//加载四种纹理贴图
const colorLoader = new THREE.TextureLoader()
const Redmap = colorLoader.load('/model/example/Basic_04/model/珊瑚红.png')
const Blackmap = colorLoader.load('/model/example/Basic_04/model/幻夜黑.png')
const Bluemap = colorLoader.load('/model/example/Basic_04/model/极光蓝.png')
const Purplemap = colorLoader.load('/model/example/Basic_04/model/极光紫.png')


function toggleColor(type) {
    console.log(mesh)
    type == 'red' ? mesh.material.map = Redmap : ''
    type == 'purple' ? mesh.material.map = Purplemap : ''
    type == 'blue' ? mesh.material.map = Bluemap : ''
    type == 'black' ? mesh.material.map = Blackmap : ''
    // 注意：纹理朝向texture.flipY设置
    mesh.material.map.flipY = false;
}
export {
    toggleColor
}