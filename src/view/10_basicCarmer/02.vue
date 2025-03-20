<template>
    <div id="container">

    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//导入gltf加载器
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



//创建一个3维场景scene
const scene = new THREE.Scene()
//添加一个三维坐标轴
const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);

//灯光
const pointLight = new THREE.PointLight(0xffffff, 2, 0.0)
pointLight.position.set(300, 200, 100)
scene.add(pointLight)
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light)

const loader =new GLTFLoader().load('/model/工厂.gltf',gltfSuccess)

function gltfSuccess(gltf){
    scene.add(gltf.scene)
    //创建包围盒包围gltf模型
    //创建包围盒对象
    const box3 = new THREE.Box3()//此时包围盒对象.max与.min都是未定义状态，这两个属性都是三维向量，用来表示包围盒的最大点与最小点
    console.log(box3)
    //计算模型的最小包围盒
    box3.expandByObject(gltf.scene)//将计算结果的最大点与最小点赋值给max与min
    //创建一个三维向量，来接收包围盒的大小(长，宽，高)
    const scale = new THREE.Vector3()
    //getSize()获取包围盒长宽高尺寸，结果保存在参数三维向量对象scale中
    box3.getSize(scale)
    //计算包围盒中心坐标并用vector3对象接收数据
    const center = new THREE.Vector3()
    box3.getCenter(center)
    console.log(scale,center)//这样就获取到了一个物体包围盒的相关信息
}

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
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(width, height)
    renderer.render(scene, camera)
    container.appendChild(renderer.domElement)
    const controls = new OrbitControls(camera, renderer.domElement);
    //禁止controls拖拽与缩放
    controls.enablePan=false
    controls.enableZoom = false



    let angle = 0 ;//角度
    let r= 100 //圆周运动半径
    function render() {
        angle+=0.01
        //相机的y不变，在xoz平面做圆周运动
        camera.position.x = r*Math.cos(angle)
        camera.position.z = r*Math.sin(angle)
        // .position改变，重新执行lookAt(0,0,0)计算相机视线方向
        camera.lookAt(0,0,0);

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