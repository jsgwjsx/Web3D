<template>
    <div id="container">
  
    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {CalculateAngle} from '../../lib/MathFun'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



//创建一个3维场景scene
const scene = new THREE.Scene()
//添加一个三维坐标轴
const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);



const light = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(light)
//设置平行光
const DirectionLight = new THREE.DirectionalLight(0xffffff, 1.0, 0.0)
DirectionLight.position.set(100, 100, 60)
scene.add(DirectionLight)


// 已知条件
// 一条线段两点坐标A、B
const A = new THREE.Vector3(0, 0, 10);
const B = new THREE.Vector3(100, 0, 10);

// 判断p1、p2两点位于线段AB同一侧，还是异侧
const p1 = new THREE.Vector3(20, 0, 40);
//const p2 = new THREE.Vector3(80, 0, 40);//与p1同侧

const p2 = new THREE.Vector3(80, 0, -30);//与p1异侧
// 小球可视化四个坐标点
const group = new THREE.Group();
const AMesh = createSphereMesh(0xffff00,2);
AMesh.position.copy(A);
const BMesh = createSphereMesh(0xffff00,2);
BMesh.position.copy(B);
const p1Mesh = createSphereMesh(0xff0000,2);
p1Mesh.position.copy(p1);
const p2Mesh = createSphereMesh(0xff0000,2);
p2Mesh.position.copy(p2);
group.add(AMesh,BMesh,p1Mesh,p2Mesh);

function createSphereMesh(color,R) {
    const geometry = new THREE.SphereGeometry(R);
    const material = new THREE.MeshLambertMaterial({
        color: color,
    });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

// Line可视化线段AB
const geometry = new THREE.BufferGeometry(); 
const vertices = new Float32Array([
    A.x, A.y, A.z, 
    B.x, B.y, B.z, 
]);
geometry.attributes.position = new THREE.BufferAttribute(vertices, 3);
const material = new THREE.LineBasicMaterial({
    color: 0xffff00, 
});
const line = new THREE.LineLoop(geometry, material); 
group.add(line);

// p1分别向线段AB两点创建两条向量a1、b1
const a1 = A.clone().sub(p1);
const b1 = B.clone().sub(p1);
// p2分别向线段AB两点创建两条向量a2、b2
const a2 = A.clone().sub(p2);
const b2 = B.clone().sub(p2);

// 通过c1、c2方向是否相同来推断两点是否位于线段同一侧
const c1 = a1.clone().cross(b1);
const c2 = a2.clone().cross(b2);

group.add(new THREE.ArrowHelper(a1.clone().normalize(), p1, a1.length(),0xff0000))
group.add(new THREE.ArrowHelper(b1.clone().normalize(), p1, b1.length(),0x00ff00))
group.add(new THREE.ArrowHelper(a2.clone().normalize(), p2, a2.length(),0xff0000))
group.add(new THREE.ArrowHelper(b2.clone().normalize(), p2, b2.length(),0x00ff00))
group.add(new THREE.ArrowHelper(c1.clone().normalize(), p1, 50, 0x0000ff))
group.add(new THREE.ArrowHelper(c2.clone().normalize(), p2, 50, 0x0000ff))

scene.add(group)
// 向量c1与c2夹角余弦值：用来推断向量c1与c2方向是否相同
const cos =  c1.normalize().dot(c2.normalize());
if(cos>0.5){//方向相同时候，余弦值1>0.5
    console.log('方向相同，两点在线段同侧');
}else{//方向相反时候，余弦值-1<0.5
    console.log('方向相反，两点在线段异侧');
}


function initProgram(canvasid) {
    let container = document.getElementById(canvasid)

    //获取dom元素的宽高
    var box = container.getBoundingClientRect()

    //声明canvas画布的尺寸(单位:px)
    var width = box.width;  //宽度
    var height = box.height;  //高度
    var s = width / height //设置宽高比
    var k = 600; //设置参数控制大小,相当于二分之一投影矩形的高度
    //创建正交投影相机对象(左，右，上，下，前，后)
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 8000)
    camera.position.set(200, 200, 200)
    camera.lookAt(0, 0, 0);//指向坐标原点

    const renderer = new THREE.WebGLRenderer({
        antialias: true,//开启抗锯齿
    });
  

    renderer.setPixelRatio(window.devicePixelRatio)//传递设备像素比，防止模糊
    //three默认加载gltf因为webgl默认的编码方式不同会造成颜色偏差，
    //修改webgl默认的编码方式，以此来解决three.js渲染结果颜色偏差
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setSize(width, height)
    renderer.render(scene, camera)

    container.appendChild(renderer.domElement)
    const controls = new OrbitControls(camera, renderer.domElement);

    window.onresize = () => {
        //获取dom元素的宽高
        var box = container.getBoundingClientRect()

        //声明canvas画布的尺寸(单位:px)
        width = box.width;  //宽度
        height = box.height;  //高度
        // 1. WebGL渲染器渲染的Cnavas画布尺寸更新
        renderer.setSize(width, height);
        // 2.1.更新相机参数
        const s = width / height;
        camera.aspect = s
        // 2.2.相机的left, right, top, bottom属性变化了，通知threejs系统
        camera.updateProjectionMatrix();
    }



    function render() {
        renderer.render(scene, camera)
        window.requestAnimationFrame(render)
    }
    render()

    return scene

}


onMounted(() => {
    initProgram('container')

})
</script>
<style scoped>
#container {
    width: 100%;
    height: 100%;
    position: relative;
}

#tag {
    overflow: hidden;
    color: white;
    width: 100px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border-radius: 10px;
    background-color: red;
    display:'none';
}
</style>