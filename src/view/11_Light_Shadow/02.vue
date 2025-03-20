<template>
    <div id="container">

    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



//创建一个3维场景scene
const scene = new THREE.Scene()
//添加一个三维坐标轴
const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);



const light = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(light)
//设置平行光
const DirectionLight = new THREE.DirectionalLight(0xffffff, 1.0, 0.0)
DirectionLight.position.set(300, 300, 300)
scene.add(DirectionLight)


const geometry1 = new THREE.PlaneGeometry(800, 500)
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    side: THREE.DoubleSide
})
const mesh1 = new THREE.Mesh(geometry1, material)

mesh1.rotateX(Math.PI / 2)
scene.add(mesh1)

const geometry2 = new THREE.BoxGeometry(50, 100, 50)
const material2 = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
})
const num = 5
for (var i = 0; i < num; i++) {
    const mesh = new THREE.Mesh(geometry2, material2)
    mesh.position.set( i*100-200,50, 0)
    mesh.receiveShadow = true //允许模型对象接收阴影产生的纹理贴图
    mesh.castShadow = true //允许模型对象产生阴影
    scene.add(mesh)
}



mesh1.receiveShadow = true //允许模型对象接收阴影产生的纹理贴图
DirectionLight.castShadow = true //允许光源产生阴影
//设置DirectionLight.shadow.camera设置阴影渲染范围,实际就是一个正交投影相机所形成的一个盒子，在盒子里面的可以渲染出阴影，在外面的不行
console.log(DirectionLight.shadow.camera)
DirectionLight.shadow.camera = new THREE.OrthographicCamera(-500, 500, 500, -500, 1, 1000)
//设置阴影贴图尺寸属性,尺寸越大，渲染的阴影质量就越高,越清晰，反之越模糊，尺寸一般是2的n次方
DirectionLight.shadow.mapSize.set(512,512)
//设置阴影半径，半径越大，则阴影边缘越模糊，越小越清晰
DirectionLight.shadow.radius = 5


//使用cameraHelper可视化正交投影相机的盒子
const helper = new THREE.CameraHelper(DirectionLight.shadow.camera, 0xffffff)
scene.add(helper)
//使用directionHelper可视化平行光
const dirhelper = new THREE.DirectionalLightHelper(DirectionLight,0Xffffff)
scene.add(dirhelper)


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

    //允许渲染器渲染阴影
    renderer.shadowMap.enabled = true;
    //设置render渲染器渲染阴影贴图的类型，来去除默认算法的条纹效果
    renderer.shadowMap.type = THREE.VSMShadowMap


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