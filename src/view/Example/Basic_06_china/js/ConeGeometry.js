import * as THREE from 'three'

var height = 5;//棱锥高度
var radius = 2 //半径
//设置旋转棱锥
var Conegrometry = new THREE.ConeGeometry(radius,height,4)
const material = new THREE.MeshLambertMaterial({
    color:0x00ffff
})
var Conemesh = new THREE.Mesh(Conegrometry,material)
Conemesh.rotateX(-Math.PI/2)
Conemesh.position.set(113.4668,33.8818,5.0)
export {Conemesh}