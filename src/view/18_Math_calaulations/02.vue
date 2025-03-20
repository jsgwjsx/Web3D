<template>
    <div id="container">

    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';


//实例化一个gui对象
let gui = new GUI()

//改变交互界面style属性
gui.domElement.style.top = '80px'
gui.domElement.style.right = '20px';
gui.domElement.style.width = '300px';


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

const loader = new GLTFLoader().load('/model/工厂.glb', (gltf) => {
    scene.add(gltf.scene)
})


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
    renderer.outputEncoding = THREE.sRGBEncoding;
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

    let dir = new THREE.Vector3()
    camera.getWorldDirection(dir)
    dir.normalize()
    const pos0 = camera.position.clone();//记录相机初始位置
    // L：相机沿着视线移动距离，从0~200
    gui.add({ L: 0 }, 'L', 0, 200).onChange(function (v) {
        const dis = dir.clone().multiplyScalar(v);//相机沿着视线偏移长度v
        const newPos = pos0.clone().add(dis);//相机初始位置+相机偏移向量    
        camera.position.copy(newPos);//新的位置赋值给相机位置
    });






    function render() {
        renderer.render(scene, camera)
        window.requestAnimationFrame(render)
    }
    render()

    return scene

}
onUnmounted(() => {
    gui.destroy()
})

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
    display: 'none';
}
</style>