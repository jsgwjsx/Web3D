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

const loader = new GLTFLoader().load('/model/16/人.glb', (gltf) => {
    scene.add(gltf.scene)
    const mesh = gltf.scene.children[0];
    // 获取所有变形目标的顶点数据
    const tArr = mesh.geometry.morphAttributes.position
    console.log('所有变形目标', tArr);
    console.log('所有权重', mesh.morphTargetInfluences);
    //每个变形目标对应的含义(注意和变形目标对应起来)
    const nameArr = ['变胖', '丰乳肥臀', '增肌', '年龄', '变瘦'];
    const obj = {};
    for (let i = 0; i < tArr.length; i++) {
        obj['t' + i] = 0;//obj批量定义一个属性表示变性目标的权重系数
        // 批量设置要改变的obj属性，对应name名字，和对应权重
        gui.add(obj, 't' + i, 0, 1).name(nameArr[i]).onChange(function (v) {
            mesh.morphTargetInfluences[i] = v;
        });
    }
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
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.setPixelRatio(window.devicePixelRatio)//传递设备像素比，防止模糊
    // renderer.outputColorSpace = THREE.SRGBColorSpace
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
        renderer.setSize(width, height)
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
onUnmounted(()=>{
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
</style>