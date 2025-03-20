import * as THREE from 'three';
var geometry = new THREE.CylinderGeometry(0.3,0.3,1,4)
geometry.computeVertexNormals()//计算法线，//是其棱角分明
geometry.rotateX(Math.PI/2)
geometry.translate(0,0,0.5)

function CreateCyl(x,y,color,height,size){
    var material = new THREE.MeshLambertMaterial({
        color:color
    })
    var mesh = new THREE.Mesh(geometry,material)
    mesh.position.set(x,y,0);
    mesh.scale.set(size,size,height)
    return mesh
}
export {CreateCyl}