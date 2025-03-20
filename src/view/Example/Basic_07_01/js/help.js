import * as THREE from 'three';
function createHelpSphereMesh(R,x,y,z){
    var geometry = new THREE.SphereGeometry(R,25,25)
    var material = new THREE.MeshLambertMaterial({
        color:0xff0000
    })
    var mesh = new THREE.Mesh(geometry,material)
    mesh.position.set(x,y,z)
    return mesh
}

export {createHelpSphereMesh}