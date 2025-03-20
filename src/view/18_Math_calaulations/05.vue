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

const geometry = new THREE.BoxGeometry(10, 10, 10)
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff
})
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(0, 100, 0)
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
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 8000)
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

    //点乘获取角度
    const a = new THREE.Vector3(30,0,0)
    const b = new THREE.Vector3(30,30,0)
    //两个都变成单位向量计算cos角度值
    a.normalize()
    b.normalize()
    const cos = a.dot(b)
    //通过cos求出弧度
    const rad = Math.acos(cos)
    //通过弧度转为角度
    console.log(rad)
    const angle = THREE.MathUtils.radToDeg(rad)
    console.log(angle)

    

    //设置速度与方向
    const v = new THREE.Vector3(30, 30, 0)
    //设置重力加速度
    const g = new THREE.Vector3(0, -9.8, 0)
    let t = 0
    const time = new THREE.Clock()
    const pos0 = mesh.position.clone();//复制物体的初始位置
    function render() {
        if (mesh.position.y > 0) {
            const spt = time.getDelta()
            //求出这个时间段前的速度在这个时间内所走的路程
            t += spt
            // 在t时间内，以速度v运动的,以g为加速度经过的位移量
            //物理加速度位移公式x = vt + 1/2gt^2
            const dis = v.clone().multiplyScalar(t).add(g.clone().multiplyScalar(0.5 * t * t));
            const newPOS = pos0.clone().add(dis)
            mesh.position.copy(newPOS)
        }
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