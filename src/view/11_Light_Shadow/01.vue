<template>
    <div id="container">

    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//导入gltf加载器
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



//创建一个3维场景scene
const scene = new THREE.Scene()
//添加一个三维坐标轴
const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);

//灯光
// const pointLight = new THREE.PointLight(0xffffff, 2, 0.0)
// pointLight.position.set(300, 200, 100)
// scene.add(pointLight)
const light = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(light)

//设置聚光源(光颜色color，光照强度intensity)
const spot = new THREE.SpotLight(0xffffff,1.0)
//光源添加到模型中
scene.add(spot)

//设置聚光源发散角度
spot.angle = Math.PI/6
//设置衰减
spot.decay = 0.0
//设置聚光光源位置
spot.position.set(0,50,0)
//设置聚光光源目标对象.target
spot.target.position.set(50,0,0)
//将聚光光源对象也添加到scene中
console.log(spot.target)//也是一个object3d对象
scene.add(spot.target)

// 聚光源辅助对象，可视化聚光源
const spotLightHelper = new THREE.SpotLightHelper(spot,0xffffff)
scene.add(spotLightHelper);

const geometry = new THREE.PlaneGeometry(800,500)
const material = new THREE.MeshLambertMaterial({
    color:0x00ffff,
    side:THREE.DoubleSide
})
const mesh = new THREE.Mesh(geometry,material)
mesh.rotateX(Math.PI/2)
scene.add(mesh)



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
    const camera = new THREE.OrthographicCamera(-s * k, k * s, k, -k, 1, 8000)
    camera.position.set(300, 300, 200)
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
    function render() {
        renderer.render(scene, camera)
        window.requestAnimationFrame(render)
    }
    render()
    window.onresize = () => {
        //获取dom元素的宽高
        var box = container.getBoundingClientRect()

        //声明canvas画布的尺寸(单位:px)
        var width = box.width;  //宽度
        var height = box.height;  //高度
        // 1. WebGL渲染器渲染的Cnavas画布尺寸更新
        renderer.setSize(width, height);
        // 2.1.更新相机参数
        const s = width / height; //canvas画布宽高比
        camera.left = -s * k;
        camera.right = s * k;
        // 2.2.相机的left, right, top, bottom属性变化了，通知threejs系统
        camera.updateProjectionMatrix();
    }

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
</style>