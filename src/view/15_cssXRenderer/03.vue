<template>
    <div id="container">
        <div id="tag">标签内容</div>
    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 引入CSS3渲染器CSS3DRenderer,CSS3DObject,CSS3DSprite
import {CSS3DRenderer,CSS3DObject,CSS3DSprite} from 'three/addons/renderers/CSS3DRenderer.js';





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

const geometry = new THREE.BoxGeometry(50, 100, 50)
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff
})
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(50, 0, 50)
scene.add(mesh)


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
    const css3Renderer = new CSS3DRenderer()
    css3Renderer.setSize(width, height)
    css3Renderer.render(scene, camera)
    //将css2rRenderer的canvas画布与，renderer的画布重合，方便标签渲染计算
    css3Renderer.domElement.style.position = 'absolute'
    css3Renderer.domElement.style.top = '0px'
    //指定在什么情况下 (如果有) 某个特定的图形元素可以成为鼠标事件的 target
    css3Renderer.domElement.style.pointerEvents = 'none'

    container.appendChild(css3Renderer.domElement)


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
        css3Renderer.setSize(width, height)
        renderer.setSize(width, height);
        // 2.1.更新相机参数
        const s = width / height;
        camera.aspect = s
        // 2.2.相机的left, right, top, bottom属性变化了，通知threejs系统
        camera.updateProjectionMatrix();
    }



    function render() {
        css3Renderer.render(scene, camera)
        renderer.render(scene, camera)
        window.requestAnimationFrame(render)
    }
    render()

    //设置标签
    const div = document.getElementById('tag')

    //也可以通过控制标签dom的css进行标签偏移设置
    // div.style.top = '-100px'
    //默认是可以看到背面的，可以通过设置实现标签的背面剔除
    div.style.backfaceVisibility = 'hidden'

    // HTML元素转化为threejs的CSS3D模型对象
    //使用CSS3DObject
    const tag = new CSS3DObject(div)
    //使用CSS3DSprite
    //const tag = new CSS3DSprite(div)

    //下面是第一中设置标签的方法:吧标签作为一个mesh模型对象来看待
    //标签的大小不固定的，会随着视角变换而变换，你可以把HTML标签对象想象为一个矩形平面网格模型Mesh，HTML标签对象在threejs中的尺寸来源是HTML元素的像素尺寸值，比如HTML像素高度40px，那么HTML标签对象在threejs中的数字相当于高度为40的矩形平面网格模型。
    //设置tag坐标并添加到scene中
    // tag.position.set(50,0,50)
    // scene.add(tag)

    //当然，也可以直接将标签绑定一个mesh对象作为其children,这样随着mesh对象移动，标签也会随之移动
    mesh.add(tag)
    mesh.position.set(0, 50, 0)
    //也可以对mesh模型的某个顶点进行标注
    const pos = geometry.attributes.position;
    // 获取几何体顶点1的xyz坐标，设置标签局部坐标.position属性
    //tag.position.set(pos.getX(0), pos.getY(0), pos.getZ(0));
    //用scale尝试影响标签大小有效，能控制标签大小的不但通过dom元素的css样式，也可以通过scale缩放
     tag.scale.set(1, 2, 1)


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
    overflow: hidden;
    color: white;
    width: 100px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border-radius: 10px;
    background-color: red;
    
}
</style>