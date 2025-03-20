<template>
    <div id="container">
    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//引入TWEEN库
import TWEEN from '@tweenjs/tween.js';

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

//加载数据并播放gltf中的动画
const loader = new GLTFLoader().load('/model/16/工厂.glb', (gltf) => {
    scene.add(gltf.scene)
    console.log('动画数据', gltf.animations);
    const mixer = new THREE.AnimationMixer(gltf.scene)
    const clipAction = mixer.clipAction(gltf.animations[0])
    clipAction.play()
    const clock = new THREE.Clock();
    function loop() {
        requestAnimationFrame(loop);
        const frameT = clock.getDelta();
        mixer.update(frameT);
    }
    loop();
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





    const R = 100//相机圆周运动半径

    //生成一个tween对象
    const tween = new TWEEN.Tween({
        angle: 0
    })//设置初始数值
    .to({ angle: Math.PI * 2 }, 16000)//设置目标数值
    .onUpdate((obj) => {
            //修改camera的position与lookat
            camera.position.x = R * Math.cos(obj.angle);
            camera.position.z = R * Math.sin(obj.angle);
            camera.lookAt(0, 0, 0);
    })
    .start()//开启动画


    function render() {
        tween.update();//tween更新，动画前进
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
</style>