import * as THREE from 'three'
import {lon2xyz} from './earth'
import config from './config'
const geometry = new THREE.BoxGeometry(1,1,1)
geometry.computeVertexNormals()
geometry.rotateX(Math.PI/2)
geometry.translate(0,0,0.5)

function createBBox(height,color,lonlat){
    const material = new THREE.MeshBasicMaterial({
        color:color
    })
    const mesh = new THREE.Mesh(geometry,material)
    console.log(lonlat)
    var pos = lon2xyz(config.R,lonlat[0],lonlat[1])
    console.log(pos)
    mesh.position.set(pos.x,pos.y,pos.z)

    var original = new THREE.Vector3(0,0,1)
    var dir = new THREE.Vector3(pos.x,pos.y,pos.z).normalize()

    mesh.quaternion.setFromUnitVectors(original,dir)
    //mesh.position.setZ(0)
    mesh.scale.set(1,1,height/100000000000)

    return mesh
}
export {createBBox}