<template>
    <div id="container">

    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// 引入dat.gui.js的一个类GUI

//创建一个3维场景scene
const scene = new THREE.Scene()
//添加一个三维坐标轴
const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);

//灯光
// const pointLight = new THREE.PointLight(0xffffff, 1, 0.0)
// pointLight.position.set(300, 200, 100)
// scene.add(pointLight)
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light)

const geometry = new THREE.BoxGeometry(100,100,100)
const material = new THREE.MeshLambertMaterial({
    color:0x00ffff,
   // wireframe:true
})
//构建Color对象并赋予颜色值
var color = new THREE.Color('greenyellow')
//1.可以通过属性直接修改color值
color.r = 0
//2.通过set修改color值
color.set('#00aaff')
material.color = color

//创建一个欧拉对象(绕x轴旋转的度数，绕y轴旋转的度数，绕z轴旋转的度数)
const euler = new THREE.Euler(0,0,0)
//可以通过属性直接设置
euler.x = Math.PI/4;
//y,z以此类推

const mesh = new THREE.Mesh(geometry,material)
//改变mesh.rotation中的值，但是mesh.rotation本身是一个Object3D自带的可读对象，不能直接用一个欧拉对象进行替代
//1.属性直接设置
//绕y轴的角度设置为60度
mesh.rotation.y += Math.PI/3;
//2.rotateX函数设置
mesh.rotateX(Math.PI/180)

//可以通过rotateOnAxis绕着某个方向轴旋转
const axis = new THREE.Vector3(1,1,1)
axis.normalize()
mesh.rotateOnAxis(axis,Math.PI/8)

scene.add(mesh)
function initProgram(canvasid) {
    let container = document.getElementById(canvasid)
    
    const material = new THREE.MeshLambertMaterial({
        color:0x00ffff,
        side:THREE.DoubleSide,
        //wireframe:true,//线条模式渲染mesh对应的三角形
    })

    
    //获取dom元素的宽高
    var box = container.getBoundingClientRect()

    //声明canvas画布的尺寸(单位:px)
    var width = box.width;  //宽度
    var height = box.height;  //高度

    //创建透视投影相机对象(fov,aspect(width/height),near,far)
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(300, 300, 300);
    camera.lookAt(0, 0, 0)


    const renderer = new THREE.WebGLRenderer({
        antialias: true,//开启抗锯齿
    });
    renderer.setPixelRatio(window.devicePixelRatio)//传递设备像素比，防止模糊

    renderer.setSize(width, height)
    renderer.render(scene, camera)
    container.appendChild(renderer.domElement)

    //创建controls对象，并将camera与canvas画布挂载到上面
    const controls = new OrbitControls(camera, renderer.domElement);

    let clock = new THREE.Clock();
    function render() {
        //clock.getDelta()单位是时间戳
        const spt = clock.getDelta() * 1000;//时间戳*1000 = 毫秒
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