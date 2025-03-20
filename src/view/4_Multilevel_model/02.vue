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
// const pointLight = new THREE.PointLight(0xffffff, 2, 0.0)
// pointLight.position.set(300, 200, 100)
// scene.add(pointLight)
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light)


const geometry = new THREE.BoxGeometry( 100, 100,100 );
const material = new THREE.MeshLambertMaterial({
    color:0x00ffff,
})
// mesh的世界坐标就是mesh.position与group.position的累加
const group = new THREE.Group()
//设置组对象的位置
group.position.set(100,0,0)
const mesh = new THREE.Mesh(geometry,material)
group.add(mesh)
//相对于组对象的局部坐标系进行偏移
mesh.position.set(100,0,0)
//给组对象添加一个坐标系
group.add(new THREE.AxesHelper(50))
scene.add(group)
//相对于geometry的局部坐标系进行再次偏移
geometry.translate(100,0,0)

//获取模型的世界坐标.getWorldPosition(vec3),会将一个模型的世界坐标的结构复制给vec3这个矢量对象
const vec3 = new THREE.Vector3()
mesh.getWorldPosition(vec3)
console.log(vec3)//200,表示mesh模型的世界坐标
group.getWorldPosition(vec3)
console.log(vec3)//100，表示group组对象的世界坐标

function initProgram(canvasid) {
    let container = document.getElementById(canvasid)
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
        mesh.rotateY(0.01)
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