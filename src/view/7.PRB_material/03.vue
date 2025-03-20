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
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';


const gui = new GUI()
//改变交互界面style属性
gui.domElement.style.top = '80px'
gui.domElement.style.right = '20px';
gui.domElement.style.width = '300px';

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

const fold3 = gui.addFolder('灯光')

fold3.add(pointLight,'intensity',0,1).name('点光源')
fold3.add(light,'intensity',0,1).name('环境光')

const textureCube = new THREE.CubeTextureLoader().setPath('/环境贴图1/')
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg',])

//创建一个gltf模型加载器对象
const gltfloader = new GLTFLoader()
gltfloader.load('/model/车pbr.glb', function (gltf) {
    //设置模型
    //获取车身模型
    const mesh1 = gltf.scene.getObjectByName('外壳01')
    mesh1.material.envMap = textureCube
    mesh1.material.envMapIntensity = 1.0
    //获取玻璃模型
    const mesh2 = gltf.scene.getObjectByName('玻璃01')
    mesh2.material.envMap = textureCube
    mesh2.material.envMapIntensity = 1.0
    console.log('外壳',mesh1.material);
    console.log('玻璃',mesh2.material);
    const obj = {
        color1:mesh1.material.color.getHex(),
        color2:mesh2.material.color.getHex(),
    }
    const fold1 = gui.addFolder('车身')
    fold1.addColor(obj,'color1').name('color').onChange(function (value) {
        mesh1.material.color.set(value);
    });
    fold1.add(mesh1.material, 'metalness', 0, 1);
    fold1.add(mesh1.material, 'roughness', 0, 1);
    fold1.add(mesh1.material, 'clearcoat', 0, 1);//油漆层厚度
    fold1.add(mesh1.material, 'clearcoatRoughness', 0, 1);//油漆层粗糙度
    fold1.add(mesh1.material, 'envMapIntensity', 0, 10);
    //获取一个gltf对象，将对象.scene加载进scene中
    const fold2 = gui.addFolder('玻璃')
    fold2.addColor(obj, 'color2').onChange(function (value) {
        mesh2.material.color.set(value);
    });
    fold2.add(mesh2.material, 'metalness', 0, 1);
    fold2.add(mesh2.material, 'roughness', 0, 1);
    fold2.add(mesh2.material, 'transmission', 0, 1);
    fold2.add(mesh2.material, 'ior', 1, 2.333);
    fold2.add(mesh2.material, 'envMapIntensity', 0, 10);

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
    camera.position.set(500, 500, 500);
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
    return scene
}

onUnmounted(() => {
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