<template>
    <div id="container">
    </div>
</template>
<script setup>
import { h, onMounted, onUnmounted } from 'vue';
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

//添加模型
const loader = new GLTFLoader()
loader.load('/model/地形.glb', (obj) => {
    //获取山体模型的几何体坐标
    const mesh = obj.scene.children[0]
    const count = mesh.geometry.attributes.position.count
    const heightArr = []
    for(var i =0;i<count;i++){
        //获取模型中每个点的Y
        const h = mesh.geometry.attributes.position.getY(i)
        heightArr.push(h)
    }

    //获取最高的h   
    const arr = heightArr.sort()
    const maxH = Math.max(...heightArr)
    const minH = Math.min(...heightArr)

    //通过跳转颜色混合的比例，从而通过控制一条曲线的颜色渐变的两端颜色，来形成渐变颜色数组，
    const color1 = new THREE.Color(0x0000ff)//设置起点颜色
    const color2 = new THREE.Color(0x00ff00)//设置中间颜色
    const color3 = new THREE.Color(0xff0000)//设置终点颜色
    const colorArr = []
    for (var i = 0; i < count; i++) {
        const h = mesh.geometry.attributes.position.getY(i)
        const percent = (h-minH)/maxH
        var pointColors = null;
        if(percent<=0.5){
            //第一阶段，蓝0-绿色1
            pointColors= color1.clone().lerp(color2, percent*2)
        }else{
            //第二阶段,绿0-红1
            pointColors = color2.clone().lerp(color3, (percent-0.5)*2)
        }
        colorArr.push(pointColors.r,pointColors.g,pointColors.b)
    }

    mesh.geometry.attributes.color = new THREE.BufferAttribute(new Float32Array(colorArr), 3)
    mesh.material = new THREE.MeshLambertMaterial({
        vertexColors: true,//启用点颜色
    })
    scene.add(obj.scene)
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
    renderer.outputEncoding = THREE.sRGBEncoding;
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