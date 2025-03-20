<template>
    <div id="container">

    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//引入后处理对象
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// 引入渲染器通道RenderPass
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
// 引入OutlinePass通道
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
// 引入伽马校正后处理Shader
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';
// ShaderPass功能：使用后处理Shader创建后处理通道
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
// SMAA抗锯齿通道
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';

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

const geometry = new THREE.SphereGeometry(25, 50, 50);
const material = new THREE.MeshLambertMaterial({
    color: 0x009999,
});
const mesh1 = new THREE.Mesh(geometry, material);
const mesh2 = mesh1.clone();
mesh2.material = mesh1.material.clone()
mesh2.position.y = 100;
const mesh3 = mesh1.clone();
mesh3.material = mesh1.material.clone()
mesh3.position.x = 100;
console.log(mesh1.position, mesh2.position, mesh3.position)
const model = new THREE.Group();
// 三个网格模型mesh1,mesh2,mesh3用于射线拾取测试
model.add(mesh1, mesh2, mesh3);
//更新model物体及其后代的世界坐标
model.updateMatrixWorld(true)

scene.add(model)

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

    //添加点击事件来拾取模型
    container.addEventListener('click', (e) => {

        const px = e.offsetX
        const py = e.offsetY
        //屏幕坐标转WebGL标准设备坐标
        const x = (px / width) * 2 - 1;
        const y = -(py / height) * 2 + 1;

        //创建一个射线投射器`Raycaster`
        const raycaster = new THREE.Raycaster();
        //.setFromCamera()计算射线投射器`Raycaster`的射线属性.ray
        // 形象点说就是在点击位置创建一条射线，射线穿过的模型代表选中
        raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
        //.intersectObjects([mesh1, mesh2, mesh3])对参数中的网格模型对象进行射线交叉计算
        // 未选中对象返回空数组[],选中一个对象，数组1个元素，选中两个对象，数组两个元素
        const intersects = raycaster.intersectObjects([mesh1, mesh2, mesh3]);
        console.log("射线器返回的对象", intersects);
        // intersects.length大于0说明，说明选中了模型
        if (intersects.length > 0) {
            // 选中模型的第一个模型，设置为红色
            intersects[0].object.material.color.set(0xff0000);
        }
    })

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
</style>