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
const pointLight = new THREE.PointLight(0xffffff, 2, 0.0)
pointLight.position.set(300, 200, 100)
scene.add(pointLight)
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light)

const loader =new GLTFLoader().load('/model/轿车.glb',gltfSuccess)

const geometry = new THREE.PlaneGeometry(1000,500)
const material = new THREE.MeshLambertMaterial({
    color:0x00ffff
})
const mesh = new THREE.Mesh(geometry,material)
scene.add(mesh)





function gltfSuccess(gltf){
    scene.add(gltf.scene)
    //创建包围盒包围gltf模型
    //创建包围盒对象
    const box3 = new THREE.Box3()//此时包围盒对象.max与.min都是未定义状态，这两个属性都是三维向量，用来表示包围盒的最大点与最小点
    console.log(box3)
    //计算模型的最小包围盒
    box3.expandByObject(gltf.scene)//将计算结果的最大点与最小点赋值给max与min
    //创建一个三维向量，来接收包围盒的大小(长，宽，高)
    const scale = new THREE.Vector3()
    //getSize()获取包围盒长宽高尺寸，结果保存在参数三维向量对象scale中
    box3.getSize(scale)
    //计算包围盒中心坐标并用vector3对象接收数据
    const center = new THREE.Vector3()
    box3.getCenter(center)
    console.log(scale,center)//这样就获取到了一个物体包围盒的相关信息
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
    const camera = new THREE.OrthographicCamera(-s * k, k * s, k, -k, 1, 8000)
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