<template>
    <div id="container">

    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


//创建一个3维场景scene
const scene = new THREE.Scene()
//添加一个三维坐标轴
const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);

const pointLight = new THREE.PointLight(0xffffff, 2, 0.0)
pointLight.position.set(300, 200, 100)
scene.add(pointLight)

function initProgram(canvasid) {
    let container = document.getElementById(canvasid)

    //创建圆环TorusGeometry(环面的半径(radius),管道的半径(tube)，管道横截面分段数(radialSegments),管道的分段数(tublularSegments))
    const geometry1 = new THREE.TorusGeometry(25, 5, 16, 100)

    const material = new THREE.MeshLambertMaterial({
        color:0xffff00,//设置材质颜色
    })
    const mesh1 = new THREE.Mesh(geometry1, material)
    mesh1.position.set(0, 0, 0)
    //旋转圆环(弧度)
    mesh1.rotateX(90 / 180 * Math.PI)
    scene.add(mesh1)

    //创建球,DodecahedronGeometry十二缓冲集合体
    const geometry2 = new THREE.DodecahedronGeometry(20, 10)
    const mesh2= new THREE.Mesh(geometry2, material)
    mesh2.position.set(0, 0, 0)
    scene.add(mesh2)

    //创建柱体new THREE.CylinderGeometry(上圆的半径，下圆的半径，高)
    const geometry3 = new THREE.CylinderGeometry(50,20,50)
    const mesh3= new THREE.Mesh(geometry3, material)
    mesh3.position.set(0, 50, 0)
    scene.add(mesh3)

    const geometry4 = new THREE.CylinderGeometry(20,50,50)
    const mesh4= new THREE.Mesh(geometry4, material)
    mesh4.position.set(0, -50, 0)
    scene.add(mesh4)

    //常见圆形平面CircleGeometry(半径，分段数量)
    //设置高光材质
    const material1 = new THREE.MeshPhongMaterial({
        color:0xffff00,
        side:THREE.DoubleSide,
        shininess:100,//高亮的程度，越高的值越闪亮
        specular:0xffffff,//高光颜色
    })
    const geometry5 = new THREE.CircleGeometry(50,20)
    const mesh5= new THREE.Mesh(geometry5, material1)
    mesh5.position.set(0, 20, 0)
    mesh5.rotateX(90/180*Math.PI)
    scene.add(mesh5)

    const geometry6 = new THREE.CircleGeometry(50,20)
    const mesh6= new THREE.Mesh(geometry6, material1)
    mesh6.position.set(0, -20, 0)
    mesh6.rotateX(90/180*Math.PI)
    scene.add(mesh6)


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
        antialias:true,//开启抗锯齿
    });
    renderer.setPixelRatio(window.devicePixelRatio)//传递设备像素比，防止模糊
    renderer.setClearColor(0xffffff,1)//设置画布背景颜色以及透明度

    renderer.setSize(width, height)
    renderer.render(scene, camera)
    container.appendChild(renderer.domElement)

    //创建controls对象，并将camera与canvas画布挂载到上面
    const controls = new OrbitControls(camera, renderer.domElement);

    //dom元素改变的时候执行事件监听
    // controls.addEventListener('change', () => {
    //     console.log(camera.position)
    //     renderer.render(scene, camera)//根据改变后的camera重新进行渲染
    // })

    let clock = new THREE.Clock();
    function render() {
        //clock.getDelta()单位是时间戳
        const spt = clock.getDelta() * 1000;//时间戳*1000 = 毫秒
        //让mesh绕y轴旋转，每次旋转0.01弧度
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