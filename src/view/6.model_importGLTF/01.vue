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


//创建一个gltf模型加载器对象
const gltfloader = new GLTFLoader()
gltfloader.load('/model/工厂.gltf',function(gltf){
   
    //获取name为水面的模型对象
    var waterfall = gltf.scene.getObjectByName('水面')
    //删除水面模型对象
    gltf.scene.remove(waterfall)
    
    //获取一个gltf对象，将对象.scene加载进scene中
    scene.add(gltf.scene)
})




function initProgram(canvasid) {
    let container = document.getElementById(canvasid)
    
    //获取dom元素的宽高
    var box = container.getBoundingClientRect()

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
    renderer.outputEncoding = THREE.sRGBEncoding;//设置SRGB颜色空间
    renderer.setSize(width, height)
    renderer.render(scene, camera)
    container.appendChild(renderer.domElement)

    //创建controls对象，并将camera与canvas画布挂载到上面
    const controls = new OrbitControls(camera, renderer.domElement);

    //注意相机控件OrbitControls会影响lookAt设置，注意手动设置OrbitControls的目标参数
    //camera.lookAt(100,0,0)
    //在camera.lookAt的同时，设置控制器的看的目标点位置
    //controls.target.set(100,0,0)
    //更新控制器
    // controls.update()



    let clock = new THREE.Clock();
    function render() {
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