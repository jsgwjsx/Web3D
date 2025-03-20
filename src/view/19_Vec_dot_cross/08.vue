<template>
    <div id="container">
  
    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {CalculateAngle} from '../../lib/MathFun'
import {SphereCreate} from '../../lib/CreateGeometry'



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
// 直线经过两点坐标A、B
const A = new THREE.Vector3(0, 0, 0);
const B = new THREE.Vector3(100, 50, 50);
// 直线外一点p
const p = new THREE.Vector3(50, 0, 30);

const AB = B.clone().sub(A)
// ApB构建一个三角形，其中两条边构建向量a、向量b
const a = A.clone().sub(p);
const b = B.clone().sub(p);
const c = a.clone().cross(b);
const S = 0.5*c.length();//叉乘结果长度一半是三角形ApB的面积

//AB两点距离
const width = AB.length();
const H = S / width * 2;//三角形高度，也就是点到直线的距离
console.log('点到直线的距离',H);
console.log(c.clone().normalize())


//可视化垂直线段
const helper = new THREE.ArrowHelper(c.clone().normalize(),p,H)
helper.rotateOnWorldAxis(AB.clone().normalize(),Math.PI/2)
scene.add(helper)


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
scene.add(line)
const aMesh = SphereCreate(A,0xffff00)
const bMesh = SphereCreate(B,0xffff00)
const cMesh = SphereCreate(p,0x00ffff)
scene.add(aMesh,bMesh,cMesh)

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