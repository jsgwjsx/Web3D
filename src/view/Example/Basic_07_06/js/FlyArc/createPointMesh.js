import * as THREE from 'three'
import {lon2xyz} from '../earth'

var geometry = new THREE.PlaneGeometry(1,1)
var texloader = new THREE.TextureLoader()
var texture = texloader.load('/model/example/Basic_07/标注.png')

function createPointMesh(R,lon,lat){
    var material = new THREE.MeshBasicMaterial({
        color:0x22ffff,
        map:texture,
        transparent:true,
        depthTest:false,//禁止写入深度缓冲区数据
    })
    var mesh = new THREE.Mesh(geometry,material)

    //经纬度转球面坐标
    var coord = lon2xyz(R*1.001,lon,lat)
    var size = R * 0.05 //平面mesh的尺寸
    mesh.scale.set(size,size,size)
    mesh.position.set(coord.x,coord.y,coord.z)

    //mesh姿态跳转
    var coordVec3 = new THREE.Vector3(coord.x,coord.y,coord.z).normalize()
    var meshNormal = new THREE.Vector3(0,0,1)

    mesh.quaternion.setFromUnitVectors(meshNormal,coordVec3)
    return mesh
}

export { createPointMesh };