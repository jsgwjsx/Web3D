import * as THREE from 'three'
import { scene } from './index';
var height = 3;//棱锥高度
var radius = 1.0 //半径
//设置旋转棱锥
var Conegrometry = new THREE.ConeGeometry(radius,height,4)
const material = new THREE.MeshLambertMaterial({
    color:0x00ffff
})
Conegrometry.computeVertexNormals()
var Conemesh = new THREE.Mesh(Conegrometry,material)
Conemesh.position.z+=2.3
Conemesh.rotateX(-Math.PI/2)
function updateCone(x,y,z){
    Conemesh.position.set(x,y,z+3.2)

}

export {updateCone,Conemesh}