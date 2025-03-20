<template>
    <div id="container">

    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CalculateAngle } from '../../lib/MathFun'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { SphereCreate } from '../../lib/CreateGeometry'




//创建一个3维场景scene
const scene = new THREE.Scene()
//添加一个三维坐标轴
const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);



const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light)
//设置平行光
const DirectionLight = new THREE.DirectionalLight(0xffffff, 1.0, 0.0)
DirectionLight.position.set(100, 100, 60)
scene.add(DirectionLight)

const H = 50//设置飞机高度
let angle = 0 //设置飞行角度
const R = 100 //设置飞机旋转的圆周半径
const Target = new THREE.Vector3(0, H, 0)//设置无人机看向的方向


//物体.quaternion.copy(四元数对象)，来实现四元数改变物体姿态
//补充:three.js模型对象的角度.rotation和四元数.quaternion属性都是用来表示物体姿态角度的，只是表达形式不同而已，.rotation和.quaternion两个属性的值，一个改变，另一个也会同步改变。
const loader1 = new GLTFLoader().load('/model/工厂.glb', (gltf) => {
    scene.add(gltf.scene)
})

const loader2 = new GLTFLoader().load('/model/无人机.glb', (gltf) => {
    scene.add(gltf.scene)
    const fly = gltf.scene
    fly.position.setY(50)
    console.log(gltf)
    //保持无人机姿态角度初始值
    const q0 = fly.quaternion.clone()
    //保持无人机的正前方向向量
    const a = new THREE.Vector3(0, 0, 1)

    //播放无人机动画
    //包含帧动画的模型作为参数创建一个播放器
    const mixer = new THREE.AnimationMixer(gltf.scene);
    //  获取gltf.animations[0]的第一个clip动画对象
    const clipAction = mixer.clipAction(gltf.animations[0]);//创建动画clipAction对象,如果有多种动画模型，修改索引值就可以
    clipAction.play();//播放动画
    console.log(clipAction)
    clipAction.timeScale=100.0
    const clock = new THREE.Clock()
    clock.start()//开始时钟
    function loop() {
        mixer.update(clock.getDelta())
        //无人机绕圆周飞行
        const x = R * Math.cos(angle)
        const z = R * Math.sin(angle)
        angle += 0.001
        fly.position.x = x
        fly.position.z = z

        //无人机姿态方向对着前方
        //无人机下一刻的位置
        const x1 = R * Math.cos(angle + 0.001)
        const z1 = R * Math.sin(angle + 0.001)


        //无人机对准中间
        // const b = Target.clone().sub(fly.position).normalize()//表示无人机指向目标点的向量
        //无人机对准前方
        const b = new THREE.Vector3(x1 - x, 0, z1 - z).normalize()
        const q = new THREE.Quaternion()
        q.setFromUnitVectors(a, b)
        fly.quaternion.copy(q0.clone().multiply(q))
        window.requestAnimationFrame(loop)
    }
    loop()
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
    renderer.setClearColor(0xffffff)

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
    display: 'none';
}
</style>