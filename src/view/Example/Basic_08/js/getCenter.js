import * as THREE from 'three'

function getCenter(mesh){
    var bbox = new THREE.Box3()
    bbox.expandByObject(mesh)

    var size = new THREE.Vector3()
    var center = new THREE.Vector3()
    var max = new THREE.Vector3()
    bbox.getSize(size)
    bbox.getCenter(center)

    console.log('包围盒尺寸',size)
    console.log('包围盒中心',center)
    console.log(bbox)
}

export {getCenter}