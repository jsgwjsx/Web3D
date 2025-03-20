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



//灯光
const pointLight = new THREE.PointLight(0xffffff, 1, 0.0)
pointLight.position.set(300, 200, 100)
scene.add(pointLight)
const light = new THREE.AmbientLight(0xffffff,1);
scene.add(light)

//创建一个几何体
//const geometry = new THREE.BoxGeometry(50,50,50)
const geometry = new THREE.CylinderGeometry(60,60,100,30)//360/30=12，也就是说法线的间距角度是12
const material = new THREE.MeshLambertMaterial({
    color:0x00ffff,
    transparent:true,
    opacity:0.5
})
const mesh = new THREE.Mesh(geometry,material)

//以geometry作为参数创建一个新的边缘几何体
//生成一个edgesGeometry对象(geometry,可供渲染的最小角度)
const edges = new THREE.EdgesGeometry(geometry,12);//大于12，渲染圆柱四周边，小于则不进行渲染
const edgesMaterial = new THREE.LineBasicMaterial({
    color:0x00ffff,
})

//edges几何体一般都是配合LineSegments使用才可以正确的显示出几何图形的edge
const line = new THREE.LineSegments(edges,edgesMaterial)
//将线框添加给mesh模型作为其children
mesh.add(line)
mesh.position.set(500,0,0)
scene.add(mesh)

//给模型也添加边缘线
const loader = new GLTFLoader()
loader.load('/model/建筑模型.gltf',(obj)=>{
    scene.add(obj.scene)
    obj.scene.traverse((gltf)=>{
        if(gltf.type=='Mesh'){
            gltf.material = new THREE.MeshLambertMaterial({
                color:0x004444,
                transparent:true,
                opacity:0.5
            })
            const edges1 = new THREE.EdgesGeometry(gltf.geometry)
            const line1 = new THREE.LineSegments(edges1,edgesMaterial)
            gltf.add(line1)
        }
    })
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
    camera.position.set(300, 300, 300);
    camera.lookAt(0, 0, 0)


    const renderer = new THREE.WebGLRenderer({
        antialias: true,//开启抗锯齿
    });
    renderer.outputColorSpace =THREE.SRGBColorSpace
    renderer.setPixelRatio(window.devicePixelRatio)//传递设备像素比，防止模糊
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