<template>
    <div id="container">
        <div class="pos">
            <div class="bu" v-on:click="test">下落</div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as CANNON from 'cannon-es'
//记录小球是否添加进去
let addBool = false

//创建一个3维场景scene
const scene = new THREE.Scene()
//添加一个三维坐标轴
const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);

//设置音频
const audio = new Audio('/碰撞声.wav');

const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light)
//设置平行光
const DirectionLight = new THREE.DirectionalLight(0xffffff, 1.0, 0.0)
DirectionLight.position.set(100, 100, 60)
scene.add(DirectionLight)

//设置物理小球与地面的材质,不同的材质物理计算的结果也不同
const sphereMaterial = new CANNON.Material()
const groundMaterial = new CANNON.Material()
//定义当两种材质相遇时发生的情况。
const contactMaterial = new CANNON.ContactMaterial(groundMaterial, sphereMaterial, {
    restitution: 0.9,//反弹恢复系数
})

// 1m半径球体,设置物体形状
const bodyShape = new CANNON.Sphere(0.02);

//先写虚拟的物理世界的物体
//创建一个用于物理模拟计算的物体，并设置属性
//这里创建的物体表示小球
const body = new CANNON.Body({
    mass: 0.03,//该物体重量为0.03kg
    position: new CANNON.Vec3(0, 10, 0), //设置物体位置
    shape: bodyShape,
    material: sphereMaterial
});

//创建一个物体表示地面
const groundBody = new CANNON.Body({
    mass: 0,//质量为0，就会始终保持精致，不受到力碰撞或加速度影响
    shape: new CANNON.Plane(),
    material: groundMaterial
})
// 改变平面默认的方向，法线默认沿着z轴，旋转到平面向上朝着y方向
//旋转规律类似threejs 平面
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);



// CANNON.World创建物理世界对象
const world = new CANNON.World();
//设置物理世界的重力加速度
world.gravity.set(0, -9.8, 0)//单位m/s
//addBody将物体添加到物理世界中
// world.addBody(body)
//将地面添加到物理世界中
world.addBody(groundBody)


//设置three.js网格小球
const geometry = new THREE.SphereGeometry(0.02);
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
});
const mesh = new THREE.Mesh(geometry, material);
mesh.position.y = 1;

// 设置网格地面
const planeGeometry = new THREE.PlaneGeometry(2, 2);
const texture = new THREE.TextureLoader().load('/瓷砖.jpg');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(3, 3);
const planeMaterial = new THREE.MeshLambertMaterial({
    color: 0x777777,
    map: texture,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotateX(-Math.PI / 2);

scene.add(planeMesh)
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
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 8000)
    camera.position.set(2, 2, 2)
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
    // renderer.setClearColor(0xffffff)

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

    //固定的时间步长1/60秒
    const fixedTimeStep = 1 / 60;

    function render() {
        world.step(fixedTimeStep);//更新物理世界的时间，用于计算物体的状态,单位s
        // 渲染循环中，同步物理球body与网格球mesh的位置
        mesh.position.copy(body.position);
        renderer.render(scene, camera)
        window.requestAnimationFrame(render)
    }
    render()

    return scene

}

function test() {
    body.position.y = 10;//点击按钮，body回到下落的初始位置
    if (!addBool) {
        world.addBody(body);//添加到物理世界，才开始下落
        addBool = true;
    }
}
//设置小球碰撞事件
body.addEventListener('collide', (event) => {
    const contact = event.contact;
    //获得小球沿法线的冲击速度
    const impactV = contact.getImpactVelocityAlongNormal()
    // 小球body发生碰撞事件，播放音频
    //根据速度设置音量大小(0-1)
     // 碰撞越狠，声音越大
    // console.log(impactV)
    audio.volume = impactV / 15;
    audio.play();
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