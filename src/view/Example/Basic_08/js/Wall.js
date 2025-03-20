import  * as THREE from 'three'
import ouputFragment from './output_fragment.glsl'
var material1 = new THREE.MeshLambertMaterial({
    color:0xffff00,
    side:THREE.DoubleSide,
    transparent: true, //需要开启透明度计算，否则着色器透明度设置无效
    depthTest: false,
})
material1.onBeforeCompile=function(shader){
    shader.vertexShader = shader.vertexShader.replace('void main() {',`
        varying vec3 vposition;
        void main() {
            vposition = position;
        `)
    shader.fragmentShader = shader.fragmentShader.replace('void main() {',`
            varying vec3 vposition;
            void main() {
        `)
    shader.fragmentShader = shader.fragmentShader.replace('	#include <output_fragment>', ouputFragment)
}
var texture = new THREE.TextureLoader().load('/model/example/Basic_08/流动.png')
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping
texture.repeat.set(100,1)
var material2 = new THREE.MeshLambertMaterial({
    map:texture,
    side:THREE.DoubleSide,
    transparent: true, //需要开启透明度计算，否则着色器透明度设置无
    color:0xffff00
})
function createWall(pointsArr){
    var geometry = new THREE.BufferGeometry()
    var h = 20 //墙的高度
    var posArr = []
    var uvsArr = []
    for(var i = 0;i<pointsArr.length-2;i+=2){
        posArr.push(pointsArr[i],pointsArr[i+1],0,pointsArr[i+2],pointsArr[i+3],0,pointsArr[i+2],pointsArr[i+3],h)//添加第一个三角形
        posArr.push(pointsArr[i],pointsArr[i+1],0,pointsArr[i+2],pointsArr[i+3],h,pointsArr[i],pointsArr[i+1],h)//添加第二个三角形

        uvsArr.push(0,0,1,0,1,1)
        uvsArr.push(0,0,1,1,0,1)
    }
    geometry.attributes.position = new THREE.BufferAttribute(new Float32Array(posArr),3)
    geometry.attributes.uv = new THREE.BufferAttribute(new Float32Array(uvsArr),2)
    geometry.computeVertexNormals()
    
    
    var mesh = new THREE.Mesh(geometry,material1)
    var mesh2 = mesh.clone()
    mesh2.material = material2
    mesh2.geometry = mesh.geometry.clone()
    mesh.add(mesh2)
    // mesh.rotateX(-Math.PI/2)
    return mesh
}
requestAnimationFrameloop()
function requestAnimationFrameloop(){
    texture.offset.y -= 0.007;
    requestAnimationFrame(requestAnimationFrameloop)
}

export {createWall}