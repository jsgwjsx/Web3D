<template>
    <div id="container">
    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import path from 'path';


//创建一个3维场景scene
const scene = new THREE.Scene()
//添加一个三维坐标轴
const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);



//灯光
const pointLight = new THREE.PointLight(0xffffff, 1, 0.0)
pointLight.position.set(300, 200, 100)
scene.add(pointLight)
const light = new THREE.AmbientLight(0xffffff,0.5);
scene.add(light)

//根据轮廓坐标生成Shape轮廓对象(Vector2数组)
const shape = new THREE.Shape()//此时shape的currentPoint在xoy平面的(0,0)原点上
shape.lineTo(100,0)
shape.lineTo(100,100)
shape.lineTo(0,100)

//设置shape的内孔轮廓
const path1 = new THREE.Path()
path1.absarc(20,20,10);
const path2 = new THREE.Path()
path2.absarc(80,20,10)
const path3 = new THREE.Path()
path3.moveTo(50,50)
path3.lineTo(80,50)
path3.lineTo(80,80)
path3.lineTo(50,80)

//三个内孔轮廓分别插入到holes属性中
shape.holes.push(path1,path2,path3)

//通过shape挤压，形成一个有孔的3d几何体
const geometry = new THREE.ExtrudeGeometry(shape,{
    depth:20,
    bevelEnabled:false
})
const material = new THREE.MeshLambertMaterial({
    color:0x00ffff,
    side:THREE.DoubleSide
})
const mesh = new THREE.Mesh(geometry,material)
scene.add(mesh)

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