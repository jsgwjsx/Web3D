<template>
    <div id="container">
        <!-- CSS布局方式写法很多，不一定和课程一致 -->
        <div id="tag" style="display: none;"></div>
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
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 引入CSS2渲染器CSS2DRenderer和CSS2模型对象CSS2DObject
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';



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

const loader = new GLTFLoader().load('/model/工厂.glb', (gltf) => {
    scene.add(gltf.scene)
    console.log(gltf)
    const arr = ['设备A标注', '设备B标注']
    for (var i = 0; i < arr.length; i++) {
        //注意是多个标签，需要用cloneNode()克隆标签
        const div = document.getElementById('tag').cloneNode()
        //设置名称
        div.innerHTML = arr[i]
        const tag = new CSS3DObject(div)
        // div.style.pointerEvents = 'none' //避免标签遮挡canvas鼠标事件
        const obj = gltf.scene.getObjectByName(arr[i])
        obj.add(tag)

        tag.scale.set(0.1, 0.1, 1);//适当缩放模型标签
        tag.position.y = 40 / 2 * 0.1;//标签底部箭头和空对象标注点重合：偏移高度像素值一半*缩放比例
    }

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
    camera.position.set(200, 200, 200)
    camera.lookAt(0, 0, 0);//指向坐标原点

    const renderer = new THREE.WebGLRenderer({
        antialias: true,//开启抗锯齿
    });

    //设置css2渲染器
    const cssRenderer = new CSS3DRenderer()
    cssRenderer.setSize(width, height)
    cssRenderer.render(scene, camera)
    //将css2rRenderer的canvas画布与，renderer的画布重合，方便标签渲染计算
    cssRenderer.domElement.style.position = 'absolute'
    cssRenderer.domElement.style.top = '0px'
    //指定在什么情况下 (如果有) 某个特定的图形元素可以成为鼠标事件的 target
    cssRenderer.domElement.style.pointerEvents = 'none'

    container.appendChild(cssRenderer.domElement)


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

    window.onresize = () => {
        //获取dom元素的宽高
        var box = container.getBoundingClientRect()

        //声明canvas画布的尺寸(单位:px)
        width = box.width;  //宽度
        height = box.height;  //高度
        cssRenderer.setSize(width, height)
        // 1. WebGL渲染器渲染的Cnavas画布尺寸更新
        renderer.setSize(width, height);
        // 2.1.更新相机参数
        const s = width / height;
        camera.aspect = s
        // 2.2.相机的left, right, top, bottom属性变化了，通知threejs系统
        camera.updateProjectionMatrix();
    }

    //设置后处理管道
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    // 设置renderPass通道
    composer.addPass(renderPass);

    const outline = new OutlinePass(new THREE.Vector2(width, height), scene, camera)

    //设置后处理样式
    //模型描边颜色，默认白色         
    outline.visibleEdgeColor.set(0x00ffff);
    //高亮发光描边厚度
    outline.edgeThickness = 4;
    //高亮描边发光强度
    outline.edgeStrength = 6;
    //模型闪烁频率控制，默认0不闪烁
    outline.pulsePeriod = 2;

    composer.addPass(outline)

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
        cssRenderer.render(scene, camera)
        composer.render(scene, camera)
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
    width: 100px;
    height: 40px;
    line-height: 32px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    background-image: url('/标签箭头背景.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    pointer-events: none;
}

</style>