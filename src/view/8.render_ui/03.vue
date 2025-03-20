<template>
    <div id="container">
        <div id="Percontainer">
            <!-- 进度条 -->
            <div id="per"> </div>
        </div>
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


//灯光
const pointLight = new THREE.PointLight(0xffffff, 1, 0.0)
pointLight.position.set(300, 200, 100)
scene.add(pointLight)
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light)


function initProgram(canvasid) {
    let container = document.getElementById(canvasid)

    //获取dom元素的宽高
    var box = container.getBoundingClientRect()

    //声明canvas画布的尺寸(单位:px)
    var width = box.width;  //宽度
    var height = box.height;  //高度

    //创建透视投影相机对象(fov,aspect(width/height),near,far)
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(300, 300, 300);
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

    //创建controls对象，并将camera与canvas画布挂载到上面
    const controls = new OrbitControls(camera, renderer.domElement);
    let clock = new THREE.Clock();
    function render() {
        const spt = clock.getDelta() * 1000;//时间戳*1000 = 毫秒
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

    const loader = new GLTFLoader()

const percentDiv = document.getElementById('per');// 获取进度条元素

//
loader.load('/model/工厂.gltf', (gltf) => {
    //.load()方法的参数2是一个函数，参数2函数是模型加载完成以后才会被调用执行。
    scene.add(gltf.scene)
    // 加载完成，删除进度条
    document.getElementById("Percontainer").style.display = 'none';
    //load()方法的参数3是一个函数，通过函数的参数获取模型加载信息,每当模型加载部分内容，该函数就会被调用，一次加载过程中一般会被调用多次，直到模型加载完成。
},function (xhr) {
    //通过xhr获取需要加载的数据量和已经加载的数据量，并计算出加载进度
    const percent = xhr.loaded / xhr.total;
    // console.log('加载进度' + percent);
    percentDiv.style.width = percent * 400 + "px"; //进度条元素长度
    percentDiv.style.textIndent = percent * 400 + 5 + "px"; //缩进元素中的首行文本
    // Math.floor:小数加载进度取整
    percentDiv.innerHTML = Math.floor(percent * 100) + '%'; //进度百分比
})



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

#Percontainer {
    position: absolute;
    width: 400px;
    height: 16px;
    top: 50%;
    left: 50%;
    margin-left: -200px;
    margin-top: -8px;
    border-radius: 8px;
    border: 1px solid #009999;
    overflow: hidden;
    background-color: red;
}

#per {
    height: 100%;
    width: 0px;
    background: #00ffff;
    color: #00ffff;
    line-height: 15px;
}
</style>