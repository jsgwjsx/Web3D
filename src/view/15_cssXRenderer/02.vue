<template>
    <div id="container">
        <!-- CSS布局方式写法很多，不一定和课程一致 -->
        <div id="tag" style="display: none;">
            <div style="position:absolute;left:350px;top:20px;">
                <img id="close" src="/关闭.png" width="32" style="pointer-events: auto;">
            </div>
            <!-- position:relative;约束子元素绝对定位参照点 -->
            <div style="position:relative;width:400px;height:322px;color: #fff;">
                <!-- 图片绝对定位100%填充父元素，作为标签的背景 -->
                <img src="/信息背景.png" alt="" style="width:100%;position: absolute;left: 0px;top: 0px;">
                <!-- 名称、存储量、设备状态、等信息叠加到背景图上即可 -->
                <div style="position:absolute;left:48px;top:36px;font-size:16px;">
                    <div style="font-size:20px;font-weight: 400;">
                        <span id="name">设备A</span>
                    </div>
                    <div style="margin-top: 30px;">
                        <span style="font-weight: 400;margin-left: 80px;font-size: 40px;color: #00ffff;">276559 L</span>
                    </div>
                    <div style="margin-top: 20px;">
                        <span style="color: #ccc;font-weight: 300;">管理</span><span
                            style="font-weight: 400;margin-left: 30px;">郭老师</span>
                    </div>
                    <div style="margin-top: 10px;">
                        <span style="color: #ccc;font-weight: 300;">工号</span><span
                            style="font-weight: 400;margin-left: 30px;">webgl3d.cn</span>
                    </div>
                </div>
                <div style="position:absolute;left:285px;top:35px;">
                    <span style="color: #ffff00;">异常</span>
                </div>
            </div>
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
// 引入伽马校正后处理Shader
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';
// ShaderPass功能：使用后处理Shader创建后处理通道
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
// SMAA抗锯齿通道
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 引入CSS2渲染器CSS2DRenderer和CSS2模型对象CSS2DObject
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';


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
    const css2Renderer = new CSS2DRenderer()
    css2Renderer.setSize(width, height)
    css2Renderer.render(scene, camera)
    //将css2rRenderer的canvas画布与，renderer的画布重合，方便标签渲染计算
    css2Renderer.domElement.style.position = 'absolute'
    css2Renderer.domElement.style.top = '0px'
    //指定在什么情况下 (如果有) 某个特定的图形元素可以成为鼠标事件的 target
    css2Renderer.domElement.style.pointerEvents = 'none'

    container.appendChild(css2Renderer.domElement)


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
        css2Renderer.setSize(width, height)
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


    //设置标签
    const div = document.getElementById('tag')
    div.style.top = '-161px'; //指示线端点和标注点重合
    // HTML元素转化为threejs的CSS2模型对象
    const tag = new CSS2DObject(div)

    // 获取设备名称标签
    const span = document.getElementById('name');
    let chooseObj = null;
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
        const cunchu = scene.getObjectByName('存储罐');
        //.intersectObjects([mesh1, mesh2, mesh3])对参数中的网格模型对象进行射线交叉计算
        // 未选中对象返回空数组[],选中一个对象，数组1个元素，选中两个对象，数组两个元素
        const intersects = raycaster.intersectObjects(cunchu.children);
        // intersects.length大于0说明，说明选中了模型
        if (intersects.length > 0) {
            outline.selectedObjects = [intersects[0].object.parent]
            const obj = scene.getObjectByName(intersects[0].object.parent.name + '标注');
            //tag会标注在intersects[0].object.ancestors模型的局部坐标系原点位置
            obj.add(tag);
            chooseObj = obj;
        } else {
            if (chooseObj) {//把原来选中模型对应的标签和发光描边隐藏
                outline.selectedObjects = [];//无发光描边
                chooseObj.remove(tag);//从场景移除
            }
        }
    })

    // 鼠标单击按钮，关闭HTML标签
    document.getElementById('close').addEventListener('click', function () {
        if (chooseObj) {//把原来选中模型对应的标签和发光描边隐藏
            outline.selectedObjects = []; //无发光描边
            chooseObj.remove(tag); //从场景移除
        }
    })

    function render() {
        css2Renderer.render(scene, camera)
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

#close:hover {
    cursor: pointer;
}
</style>