<template>
    <div id="container">
        <div class="pos">
            <div class="bu" v-on:click="toggle('设备A')">A</div>
            <div class="bu" v-on:click="toggle('设备B')">B</div>
       </div>
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
// 引入UnrealBloomPass通道
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
// 引入GlitchPass通道
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
// 引入伽马校正后处理Shader
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';
// ShaderPass功能：使用后处理Shader创建后处理通道
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
// SMAA抗锯齿通道
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


let outlinePass;

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

const loader = new GLTFLoader().load('/model/工厂.gltf',(gltf)=>{
    scene.add(gltf.scene)
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
    camera.position.set(1.1, 11.8, 62.4);
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

    //EffectComposer后处理对象
    // 创建后处理对象EffectComposer，WebGL渲染器作为参数
    const composer = new EffectComposer(renderer);
    // 创建一个渲染器通道，场景和相机作为参数
    const renderPass = new RenderPass(scene, camera);
    // 设置renderPass通道
    composer.addPass(renderPass);

    // OutlinePass第一个参数v2的尺寸和canvas画布保持一致
    const v2 = new THREE.Vector2(width, height);
    outlinePass = new OutlinePass(v2, scene, camera);

    //设置后处理样式
    //模型描边颜色，默认白色         
    outlinePass.visibleEdgeColor.set(0x00ffff);
    //高亮发光描边厚度
    outlinePass.edgeThickness = 4;
    //高亮描边发光强度
    outlinePass.edgeStrength = 6;
    //模型闪烁频率控制，默认0不闪烁
    outlinePass.pulsePeriod = 2;


    // 旋转接收OutlinePass管道处理的object3D模型对象
    // outlinePass.selectedObjects = [mesh1];
    //将OutlinePass管道添加给后处理对象Composer
    composer.addPass(outlinePass)

    // // canvas画布宽高度尺寸是800, 600
    // const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height));
    // //bloom发光强度
    // bloomPass.strength = 2.0;
    // composer.addPass(bloomPass)

    // const glitchPass = new GlitchPass();
    // // 设置glitchPass通道
    // composer.addPass(glitchPass);

    // 创建伽马校正通道
    const gammaPass = new ShaderPass(GammaCorrectionShader);
    composer.addPass(gammaPass);

    //SMAA抗锯齿
    //获取.setPixelRatio()设置的设备像素比
    const pixelRatio = renderer.getPixelRatio();
    // width、height是canva画布的宽高度
    const smaaPass = new SMAAPass(width * pixelRatio, height * pixelRatio);
    composer.addPass(smaaPass);

    function render() {
        composer.render(scene, camera)
        window.requestAnimationFrame(render)
    }
    render()

    return scene

}

function toggle(s){
    const model = scene.getObjectByName (s);
    outlinePass.selectedObjects = [model];
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
.pos{
    position: absolute;
    left: 50%;
    margin-left: -65px;
    bottom: 100px;
}
.bu{
    background: rgba(0, 0, 0, 0.1);
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #fff;
    display: inline-block;
    border-radius: 30px;
    margin: 3px;
}
.bu:hover{
    cursor: pointer;
    background: grey;
}
</style>