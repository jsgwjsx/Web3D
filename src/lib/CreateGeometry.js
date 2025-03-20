import * as THREE from 'three'
const SpereGeometry = new THREE.SphereGeometry(3)

export function SphereCreate(position,color){
    const material = new THREE.MeshLambertMaterial({
        color:color
    })
    const mesh = new THREE.Mesh(SpereGeometry,material)
    mesh.position.copy(position)
    return mesh
}
