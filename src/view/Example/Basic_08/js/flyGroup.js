
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { lon2xy } from './math.js';
import ouputFragment from './output_fragment4.glsl.js';
import { createSignalMesh } from './signalMesh.js'


var flyGroup = new THREE.Group()// 一架无人机
var mixer = null; //声明一个混合器变量
var loader = new GLTFLoader();
var fly = null;
loader.load('/model/example/Basic_08/fly.glb', function (gltf) {
    fly = gltf.scene;

    // 三维场景默认单位是米，美术导出模型单位是厘米，需要缩小数字尺寸
    // fly.scale.set(0.01,0.01,0.01);
    fly.scale.set(4, 4, 4);//根据需要放大无人机
    fly.position.x = -28 * 4;//如果美术导出的模型不居中，需要代码调整
    // console.log('gltf', gltf);
    fly.rotateX(Math.PI/2)
    flyGroup.add(fly);
    fly.traverse(function (child) {
        if (child.isMesh) {
            var material = child.material
            child.material = new THREE.MeshLambertMaterial({
                color: material.color,
            })
        }
    });
    // obj作为混合器的参数，可以播放obj包含的帧动画数据
    mixer = new THREE.AnimationMixer(fly);
    // console.log('gltf.animations[0]', gltf.animations);
    // obj.animations[0]：获得剪辑clip对象
    var AnimationAction = mixer.clipAction(gltf.animations[0]);
    AnimationAction.timeScale = 15; //默认1，可以调节播放速度
    // AnimationAction.loop = THREE.LoopOnce; //不循环播放
    // AnimationAction.clampWhenFinished=true;//暂停在最后一帧播放的状态
    AnimationAction.play();
})



// 一直无人机数据：经纬度和高度
var height = 500;//无人机飞行高度300米
flyGroup.position.set(13524900.5, 3664000.375, height);



//设置无人机球
var sphereGeometry = new THREE.SphereGeometry(100, 16, 16)
var sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    transparent: true
})
var sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
flyGroup.add(sphereMesh)
sphereMaterial.onBeforeCompile = function (shader) {
    shader.vertexShader = shader.vertexShader.replace('void main() {', `
        varying vec3 vnormal;
        void main() {
          // normal：对应geometry.attributes.normal数据
          // 相机视图矩阵和模型自身的矩阵变换都会影响模型表面某位置法线相对视线夹角发生改变
         // 法线矩阵normalMatrix是通过模型的模型矩阵和视图矩阵变换而来
         // three.js内部normalMatrix表示顶点法线的变换矩阵
            vnormal = normalize(normalMatrix*normal);
        `)
    shader.fragmentShader = shader.fragmentShader.replace('void main() {', `
            varying vec3 vnormal;
            void main() {
        `)
    shader.fragmentShader = shader.fragmentShader.replace('	#include <output_fragment>', ouputFragment)
}
flyGroup.add(createSignalMesh())

// var helper = new THREE.AxesHelper(1000,0xff0000)
// flyGroup.add(helper)
var R = 500
var angle = 0
var clock = new THREE.Clock();
//飞机初始朝向
var a= new THREE.Vector3(0,-1,0)
// 姿态调整

var q0 = flyGroup.quaternion.clone()

var beforedir = flyGroup.quaternion.clone()
function UpdateLoop() {
    if (mixer !== null) {
        //clock.getDelta()方法获得两帧的时间间隔
        mixer.update(clock.getDelta());

        if (fly) {
            //飞机绕东方明珠飞行
            angle += 0.01
            var x = 13524900.5 + R * Math.cos(angle)
            var y = 3664000.375 + R * Math.sin(angle)

            var x1 = 13524900.5 + R * Math.cos(angle + 0.01)
            var y1 = 3664000.375 + R * Math.sin(angle + 0.01)
            flyGroup.position.x = x
            flyGroup.position.y = y

            //无人机对准中间
            const b = new THREE.Vector3(x1-x,y1-y,0).normalize()//表示无人机指向目标点的向量
            //无人机对准前方
            const q = new THREE.Quaternion()
            q.setFromUnitVectors(a,b)
           flyGroup.quaternion.copy(q)
        }

    }
    requestAnimationFrame(UpdateLoop);
}
UpdateLoop();

export { flyGroup };