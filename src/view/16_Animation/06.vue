<template>
    <div id="container">
        <div class="pos">
            <div id="Idle" class="bu">休息</div>
            <div id="Run" class="bu" style="margin-left: 10px;">跑步</div>
            <div id="Walk" class="bu" style="margin-left: 10px;">走路</div>
        </div>
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



const light = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(light)
//设置平行光
const DirectionLight = new THREE.DirectionalLight(0xffffff, 1.0, 0.0)
DirectionLight.position.set(100, 100, 60)
scene.add(DirectionLight)

const loader = new GLTFLoader().load('/model/16/士兵.glb', (gltf) => {
    scene.add(gltf.scene)
    console.log(gltf.scene)
    const Bonehelper = new THREE.SkeletonHelper(gltf.scene)
    scene.add(Bonehelper)
    //包含关键帧动画的模型作为参数创建一个播放器
    //const mixer = new THREE.AnimationMixer(gltf.scene);
    // gltf.animations[0]休息
    // gltf.animations[1]跑步
    // gltf.animations[2]静止展开
    // gltf.animations[3]走路
    //1.可以用play与stop进行模式切换
    // const IdleAction = mixer.clipAction(gltf.animations[0]);
    // const RunAction = mixer.clipAction(gltf.animations[1]);
    // const WalkAction = mixer.clipAction(gltf.animations[3]);
    // IdleAction.play();
    // let ActionState = IdleAction;//当前处于播放状态的动画动作对象
    // // 通过UI按钮控制，切换动画运动状态
    // document.getElementById('Idle').addEventListener('click', function () {
    //     ActionState.stop();//播放状态动画终止
    //     IdleAction.play();
    //     ActionState = IdleAction;
    // })
    // document.getElementById('Run').addEventListener('click', function () {
    //     ActionState.stop();//播放状态动画终止
    //     RunAction.play();
    //     ActionState = RunAction;
    // })
    // document.getElementById('Walk').addEventListener('click', function () {
    //     ActionState.stop();//播放状态动画终止
    //     WalkAction.play();
    //     ActionState = WalkAction;
    // })

    //2.也可以通过设置ClipAction.weight属性决定各个动画对物体的影响程度(0~1)
    const mixer = new THREE.AnimationMixer(gltf.scene);
    const IdleAction = mixer.clipAction(gltf.animations[0]);
    const RunAction = mixer.clipAction(gltf.animations[1]);
    const WalkAction = mixer.clipAction(gltf.animations[3]);
    IdleAction.play();
    RunAction.play();
    WalkAction.play();
    // 跑步和走路动画对人影响程度为0，人处于休闲状态
    IdleAction.weight = 1.0;
    RunAction.weight = 0.0;
    WalkAction.weight = 0.0;
    let ActionState = IdleAction;//标记当前处于播放状态的动画动作对象
    // 通过UI按钮控制，切换动画运动状态
    document.getElementById('Idle').addEventListener('click', function () {
        ActionState.weight = 0.0;//播放状态动画权重设置为0
        IdleAction.weight = 1.0;
        ActionState = IdleAction;
    })
    document.getElementById('Run').addEventListener('click', function () {
        ActionState.weight = 0.0;//播放状态动画权重设置为0
        RunAction.weight = 1.0;
        ActionState = RunAction;
    })
    document.getElementById('Walk').addEventListener('click', function () {
        ActionState.weight = 0.0;//播放状态动画权重设置为0
        WalkAction.weight = 1.0;
        ActionState = WalkAction;
    })
    // 如果想播放动画,需要周期性执行`mixer.update()`更新AnimationMixer时间数据
    const clock = new THREE.Clock();
    function loop() {
        requestAnimationFrame(loop);
        //clock.getDelta()方法获得loop()两次执行时间间隔
        const frameT = clock.getDelta();
        // 更新播放器相关的时间
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
    camera.position.set(5, 5, 5)
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

.pos {
    position: absolute;
    left: 50%;
    margin-left: -65px;
    bottom: 100px;
}

.bu {
    background: rgba(0, 0, 0, 0.1);
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #fff;
    display: inline-block;
    border-radius: 30px;
    margin: 3px;
}

.bu:hover {
    cursor: pointer;
    background: grey;
}
</style>