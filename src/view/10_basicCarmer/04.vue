<template>
    <div id="container">

    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getTextOfJSDocComment } from 'typescript';


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

//加载曲线
const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-50, 20, 90),
    new THREE.Vector3(-10, 40, 40),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(60, -60, 0),
    new THREE.Vector3(90, -40, 60),
    new THREE.Vector3(120, 30, 30),
])
//创建管道
const geometry = new THREE.TubeGeometry(path, 200, 5, 30)

//加载纹理贴图并且设置管道方向阵列
const texloader = new THREE.TextureLoader()
const texture = texloader.load('/diffuse.jpg')
//设置x重复轴重复
texture.wrapS = THREE.RepeatWrapping
//设置重复次数
texture.repeat.x = 10

//纹理贴图映射给material
const material = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
    map: texture
})


const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

function initProgram(canvasid) {
    let container = document.getElementById(canvasid)

    //获取dom元素的宽高
    var box = container.getBoundingClientRect()

    //声明canvas画布的尺寸(单位:px)
    //声明canvas画布的尺寸(单位:px)
    var width = box.width;  //宽度
    var height = box.height;  //高度

    //创建透视投影相机对象(fov,aspect(width/height),near,far)
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(100, 100, 100);
    camera.lookAt(0, 0, 0)

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


    const pointArr = path.getSpacedPoints(1000)
    let i = 0

    function render() {
        if (i < pointArr.length - 1) {
            if(i%1 === 0){
           
            //获取运动轨迹，也就是曲线的点数组,要等距获取
            //获取曲线的第i个点,是一个vector3
            camera.position.copy(pointArr[i])

            // 相机观察目标：当前点的下一个点pointsArr[i + 1]
            camera.lookAt(pointArr[i + 1])
            //修改控制器观看目标
            // controls.target.copy(pointArr[i + 1]);
            // controls.update();
            }

            let highspeed = Math.floor(i)
            //设置速度，下坡快，上坡慢
             pointArr[highspeed].y>pointArr[highspeed+1].y? i+=1:i+=0.5
        } else {
            i = 0
        }


        renderer.render(scene, camera)
        window.requestAnimationFrame(render)
    }
    render()
    window.onresize = () => {
        //重新获取dom元素的宽高
        var box = container.getBoundingClientRect()
        var width = box.width;  //宽度
        var height = box.height;  //高度)
        //重新设置画布大小
        renderer.setSize(width, height)
        //重新设置相机宽高比
        camera.aspect = width / height
        //相机投影矩阵更新,相机有一点参数都需要调用这个函数
        camera.updateProjectionMatrix()
        //重新渲染
        renderer.render(scene, camera)
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