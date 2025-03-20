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

//加载立方体纹理CubeTextureLoader(环境贴图)(实际上CubeTextureLoader就是六张贴图，以此来模拟环境对物体的光照反射等等)
const texture = new THREE.CubeTextureLoader().setPath('/环境贴图1/')
.load(['px.jpg','nx.jpg','py.jpg','ny.jpg','pz.jpg','nz.jpg',])
texture.encoding=THREE.sRGBEncoding;  //纹理和渲染器颜色空间一致
//创建一个gltf模型加载器对象
const gltfloader = new GLTFLoader()
gltfloader.load('/model/金属.glb',function(gltf){
    //设置模型金属度与粗糙度
    gltf.scene.traverse((obj)=>{
        if(obj.isMesh){
            //设置金属度(默认0.0)(0-1)
            obj.material.metalness = 1
         //设置粗糙度（默认0.5)(0-1)
            obj.material.roughness = 0.5
            //设置环境贴图
          obj.material.envMap = texture
            //设置物体受环境贴图影响的系数(0-1)
            obj.material.envMapIntensity=1
        }
    })
    //获取一个gltf对象，将对象.scene加载进scene中
    scene.add(gltf.scene)
})

//也可以直接给scene设置环境贴图，这样scene中的3d模型都会受到该环境贴图的影响

scene.environment = texture


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
    window.onresize=()=>{
        //重新获取dom元素的宽高
        var box = container.getBoundingClientRect()
        var width = box.width;  //宽度
        var height = box.height;  //高度)
        //重新设置画布大小
        renderer.setSize(width,height)
        //重新设置相机宽高比
        camera.aspect=width/height
        //相机投影矩阵更新,相机有一点参数都需要调用这个函数
        camera.updateProjectionMatrix()
        //重新渲染
        renderer.render(scene,camera)
    }
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