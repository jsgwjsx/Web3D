<template>
    <div id="container">

    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';




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
//创建一个精灵材质对象
const spriteMaterial = new THREE.SpriteMaterial({
    color:0x00ffff,
    //rotation:Math.PI/2 //旋转属性设置
}) 
//创建一个精灵对象
const sprite = new THREE.Sprite(spriteMaterial)
//精灵模型Sprite默认是一个矩形形状，默认长宽都是1，默认在坐标原点位置。Sprite默认尺寸为1
scene.add(sprite)
//设置精灵矩形大小
sprite.scale.set(100,50,1)
//设置一个mesh模型，用来和sprite精灵模型对象进行对比不同
const plane = new THREE.PlaneGeometry(100,50)
const planematerial = new THREE.MeshLambertMaterial({
    color:0x00ffff
})
const mesh = new THREE.Mesh(plane,planematerial)
scene.add(mesh)
mesh.position.set(0,80,0)

const texture = new THREE.TextureLoader().load('/光点.png')
const spriteMaterials = new THREE.SpriteMaterial({
    map:texture,
    transparent:true
})
const sprite1 = new THREE.Sprite(spriteMaterials)
scene.add(sprite1)
sprite1.scale.set(10,10,1)
sprite1.position.set(0,110,0)

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
        const s = width / height;
        camera.aspect = s
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