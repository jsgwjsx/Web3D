<template>
    <div id="container">

    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


//创建一个3维场景scene
const scene = new THREE.Scene()
//添加一个三维坐标轴
const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);

const geometry = new THREE.BoxGeometry(25, 100, 25);
const material = new THREE.MeshPhongMaterial({
    color: 0x00ffff
})
material.onBeforeCompile = function (Shader) {
    //获取到Shader对象
   // console.log(Shader.fragmentShader)//片元着色器代码
    //console.log(Shader.vertexShader)//顶点着色器代码
    //这样就可以获得这个材质对象的glsl代码

    //接下来时要修改glsl，在cpu中的glsl本质就是字符串，因此如果想要修改一个字符串，就可以使用replace进行替换
    //glsl中gl_FragColor可以重复赋值，因此如果要在原来的glsl基础上改变材质的话，最好的方法就是replace(最后一行，最后一行＋修改的glsl代码)
    //这样就可以在现有的基础上对材质的着色器代码进行修改
    //fragmentShader最后一行为#include <dithering_fragment>
    //vertexShader最后一行为#include <fog_vertex>
    //修改语法如下:

    Shader.fragmentShader = Shader.fragmentShader.replace('#include <dithering_fragment>', `#include <dithering_fragment>` +
    `
    if(vPosition.y > y && vPosition.y <y+w ){ //扫光上部分
        float per = (vPosition.y-y)/w;//范围0~1
        per = pow(per,0.5);//平方根
        gl_FragColor.rgb = mix(vec3(1.0,1.0,1.0),gl_FragColor.rgb,per); //自己定义的颜色与material自带的颜色线性融合
    }
     if(vPosition.y < y && vPosition.y > y-w ){ //扫光下部分
        float per = (y-vPosition.y)/w;//范围0~1
        per = pow(per,0.5);//从线性变换变成曲线变换
        gl_FragColor.rgb = mix(vec3(1.0,1.0,1.0),gl_FragColor.rgb,per); //自己定义的颜色与material自带的颜色线性融合
    }
        
    `
    )
    Shader.fragmentShader = Shader.fragmentShader.replace('void main() {', `
    varying vec3 vPosition;
    uniform float y;
    float w = 10.0;//光带宽度一半
    void main() {
        `
    )

    //在vertexShader想定义变量也可以这样写，道理都是一样的
    Shader.vertexShader = Shader.vertexShader.replace('void main() {', `
    varying vec3 vPosition;
    void main() {
        vPosition = position;
        `
    )

    //修改后的glsl
    console.log(Shader.fragmentShader)
    console.log(Shader.vertexShader)
    
    //给glsl传值
    Shader.uniforms.y = {value:-50.0}
    mesh.shader = Shader
}



const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const light = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(light)
//设置平行光
// const DirectionLight = new THREE.DirectionalLight(0xffffff, 1.0, 0.0)
// DirectionLight.position.set(100, 100, 60)
// scene.add(DirectionLight)


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


    renderer.setPixelRatio(window.devicePixelRatio)//传递设备像素比，防止模糊
    //three默认加载gltf因为webgl默认的编码方式不同会造成颜色偏差，
    //修改webgl默认的编码方式，以此来解决three.js渲染结果颜色偏差
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(width, height)
    renderer.render(scene, camera)
    // renderer.setClearColor(0xffffff)

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


    var clock = new THREE.Clock()
    function render() {
        var Datedelta = clock.getDelta()
        mesh.shader.uniforms.y.value += 30*Datedelta
        if (mesh.shader.uniforms.y.value > 49) mesh.shader.uniforms.y.value = -50;
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

#tag {
    overflow: hidden;
    color: white;
    width: 100px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border-radius: 10px;
    background-color: red;
    display: 'none';
}
</style>