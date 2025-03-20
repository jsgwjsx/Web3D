import * as THREE from 'three'

// 13524750.5
// 3664234.375
// 177
var textureLoader= new THREE.TextureLoader()
var texture = textureLoader.load('/model/example/Basic_08/渐变.png')
var ConeGroup = new THREE.Group()
var Conematerial = new THREE.MeshLambertMaterial({
    color:0xccff22,
    map:texture,
    transparent: true, //需要开启透明度计算，否则着色器透明度设置无效
    // opacity: 0.5,//整体改变透明度
    side:THREE.DoubleSide,
    depthTest:false,
})

var geometry = new THREE.ConeGeometry(20,100,4)
var mesh1 = new THREE.Mesh(geometry,Conematerial)
var mesh2 = new THREE.Mesh(geometry,Conematerial)
mesh1.translateY(50)
mesh2.translateY(-50)
mesh2.rotateX(Math.PI)
//光圈
var circle = new THREE.CircleGeometry(50,32)
var circlematerial = new THREE.MeshLambertMaterial({
    map:textureLoader.load('/model/example/Basic_08/标注光圈.png'),
    color:0xccff22,
    transparent: true, //需要开启透明度计算，否则着色器透明度设置无效
    // opacity: 0.5,//整体改变透明度
    side:THREE.DoubleSide,
})
var circleMesh = new THREE.Mesh(circle,circlematerial)
circleMesh.rotateX(Math.PI/2)
ConeGroup.add(circleMesh)


//设置圆柱
var cly = new THREE.CylinderGeometry(50,50,20,32,32,true)
var clymaterial = new THREE.MeshLambertMaterial({
    color:0xccff22,
    map: textureLoader.load('/model/example/Basic_08/渐变.png'),
    transparent:true,
    side:THREE.DoubleSide
})
var clyMesh = new THREE.Mesh(cly,clymaterial)
clyMesh.position.setY(-450+10)

ConeGroup.add(clyMesh)
ConeGroup.add(mesh2)
ConeGroup.add(mesh1)
ConeGroup.position.set(13524750.5,3664234.375,450)
ConeGroup.rotateX(Math.PI/2)

loop()
var _s = 0
function loop(){
    _s+=0.02
    if(circleMesh){
        circleMesh.scale.set(_s,_s,_s)
    }
    if (_s <= 3) {
        //淡入
        circlematerial.opacity = (_s - 1) /1;//保证透明度在0~1之间变化
    } else if (_s > 3 && _s <= 6) {
        //淡出
        circlematerial.opacity = 1 - (_s - 2) /2;//保证透明度在0~1之间变化
    } else {
        _s = 1.0;
    }
    if(clyMesh){
        clyMesh.scale.set(_s*3,1,_s*3)
    }
    ConeGroup.rotateY(0.05)
    requestAnimationFrame(loop)
}


export {ConeGroup}