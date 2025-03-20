<template>
    <div id="container">

    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

//实例化一个gui对象
let gui = new GUI()
const obj = {
    envMapIntensity: 1.0,//控制环境光强度
    angle: 0,//控制角度
    R: 100,//控制平行光于目标点的
    y: 60//控制平行光高度
}


//改变交互界面style属性
gui.domElement.style.top = '80px'
gui.domElement.style.right = '20px';
gui.domElement.style.width = '300px';
//创建一个3维场景scene
const scene = new THREE.Scene()
//添加一个三维坐标轴
const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);



const light = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(light)
//设置平行光
const DirectionLight = new THREE.DirectionalLight(0xffffff, 1.0, 0.0)
DirectionLight.position.set(100, 60, 0)
DirectionLight.castShadow = true //允许光源产生阴影
//设置DirectionLight.shadow.camera设置阴影渲染范围,实际就是一个正交投影相机所形成的一个盒子，在盒子里面的可以渲染出阴影，在外面的不行
DirectionLight.shadow.camera = new THREE.OrthographicCamera(-50, 50, 50, -50, 1, 100)
//设置阴影贴图尺寸属性,尺寸越大，渲染的阴影质量就越高,越清晰，反之越模糊，尺寸一般是2的n次方
DirectionLight.shadow.mapSize.set(1024, 1024)
//设置阴影半径，半径越大，则阴影边缘越模糊，越小越清晰
DirectionLight.shadow.radius = 5
scene.add(DirectionLight)

//添加环境贴图
const textureCube = new THREE.CubeTextureLoader()
    .setPath('/环境贴图1/')
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
//更改纹理编码
textureCube.encoding = THREE.sRGBEncoding;
//加载gltf模型并将允许他们产生于接收阴影
const gltfLoader = new GLTFLoader().load('/model/工厂.gltf', (gltf) => {
    scene.add(gltf.scene)
    gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
            obj.material.envMap = textureCube//设置环境贴图
            obj.material.envMapIntensity = 1.0;
            // 批量设置所有Mesh都可以产生阴影和接收阴影
            obj.castShadow = true;
            obj.receiveShadow = true;
        }
    })
    ambient.add(obj, 'envMapIntensity', 0, 10).onChange((value) => {
        gltf.scene.traverse((obj) => {
            if (obj.isMesh) {
                obj.material.envMapIntensity = value;
            }
        })
    })
})







//使用cameraHelper可视化正交投影相机的盒子
const helper = new THREE.CameraHelper(DirectionLight.shadow.camera, 0xffffff)
scene.add(helper)
//使用directionHelper可视化平行光
const dirhelper = new THREE.DirectionalLightHelper(DirectionLight, 0Xffffff)
scene.add(dirhelper)
//控制环境光
const ambient = gui.addFolder('环境光')
ambient.add(light, 'intensity', 0, 1)
//控制太阳光
const SunShine = gui.addFolder('太阳光')
SunShine.add(obj, 'y', 0, 1000).onChange((value) => {
    DirectionLight.position.setY(value)
    dirhelper.update()
})
SunShine.add(obj, 'R', 0, 300).onChange(function (value) {
    DirectionLight.position.x = value * Math.cos(obj.angle);
    DirectionLight.position.z = value * Math.sin(obj.angle);
    dirhelper.update()
});
SunShine.add(obj, 'angle', 0, Math.PI * 2).onChange(function (value) {
    DirectionLight.position.x = obj.R * Math.cos(value);
    DirectionLight.position.z = obj.R * Math.sin(value);
    dirhelper.update()
});
const shadowMaps = gui.addFolder('阴影')
const cam = DirectionLight.shadow.camera
// 相机left、right等属性变化执行.updateProjectionMatrix();
// 相机变化了，执行CameraHelper的更新方法.update();
shadowMaps.add(cam,'left',-500,0).onChange(function(v){
    cam.updateProjectionMatrix();//相机更新投影矩阵
    helper.update();//相机范围变化了，相机辅助对象更新
});
shadowMaps.add(cam,'right',0,500).onChange(function(v){
    cam.updateProjectionMatrix();
    helper.update();
});
shadowMaps.add(cam,'top',0,500).onChange(function(v){
    cam.updateProjectionMatrix();
    helper.update();
});
shadowMaps.add(cam,'bottom',-500,0).onChange(function(v){
    cam.updateProjectionMatrix();
    helper.update();
});
shadowMaps.add(cam,'far',0,1000).onChange(function(v){
    cam.updateProjectionMatrix();
    helper.update();
});

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

    //允许渲染器渲染阴影
    renderer.shadowMap.enabled = true;
    //设置render渲染器渲染阴影贴图的类型，来去除默认算法的条纹效果
    renderer.shadowMap.type = THREE.VSMShadowMap


    renderer.setPixelRatio(window.devicePixelRatio)//传递设备像素比，防止模糊
    //three默认加载gltf因为webgl默认的编码方式不同会造成颜色偏差，
    //修改webgl默认的编码方式，以此来解决three.js渲染结果颜色偏差
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(width, height)
    renderer.render(scene, camera)
    container.appendChild(renderer.domElement)
    const controls = new OrbitControls(camera, renderer.domElement);
    function render() {
        renderer.render(scene, camera)
        window.requestAnimationFrame(render)
    }
    render()
    window.onresize = () => {
        //获取dom元素的宽高
        var box = container.getBoundingClientRect()

        //声明canvas画布的尺寸(单位:px)
        var width = box.width;  //宽度
        var height = box.height;  //高度
        // 1. WebGL渲染器渲染的Cnavas画布尺寸更新
        renderer.setSize(width, height);
        // 2.1.更新相机参数
        const s = width / height;
        camera.aspect = s
        // 2.2.相机的left, right, top, bottom属性变化了，通知threejs系统
        camera.updateProjectionMatrix();
    }

    return scene

}
onUnmounted(()=>{
  gui.destroy()  
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
</style>