<template>
    <div id="container">

    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//引入Stats模块
import Stats from 'three/addons/libs/stats.module.js';

//创建一个3维场景scene
const scene = new THREE.Scene()
//添加一个三维坐标轴
const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);

const pointLight = new THREE.PointLight(0xffffff, 1, 0.0)
pointLight.position.set(300, 200, 100)
scene.add(pointLight)

function initProgram(canvasid) {
    let container = document.getElementById(canvasid)
   //批量创建正方体
   const num = 1000
   for(let i =0;i<num;i++){
    const geometry = new THREE.BoxGeometry(10,10,10)
    const material = new THREE.MeshLambertMaterial({
        color:0x00ffff,//设置材质颜色
    })
    const mesh = new THREE.Mesh(geometry,material)
    const x = (Math.random()-0.5)*200;
    const y = (Math.random()-0.5)*200;
    const z = (Math.random()-0.5)*200;
    mesh.position.set(x,y,z)
    scene.add(mesh)
   }
   


    //获取dom元素的宽高
    var box = container.getBoundingClientRect()

    //声明canvas画布的尺寸(单位:px)
    var width = box.width;  //宽度
    var height = box.height;  //高度

    //创建透视投影相机对象(fov,aspect(width/height),near,far)
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(300, 300, 300);
    camera.lookAt(0,0,0)


    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height)
    renderer.render(scene, camera)
    container.appendChild(renderer.domElement)

    //创建controls对象，并将camera与canvas画布挂载到上面
    const controls = new OrbitControls(camera, renderer.domElement);

    //dom元素改变的时候执行事件监听
    // controls.addEventListener('change', () => {
    //     console.log(camera.position)
    //     renderer.render(scene, camera)//根据改变后的camera重新进行渲染
    // })

    //创建stats对象，用来显示帧数
    var stats = new Stats()
    //设置监视器位置
    stats.domElement.style.position = 'absolute'
    stats.domElement.style.left = '0px'
    stats.domElement.style.top = '0px'
    //在页面中输出status的canvas
    container.appendChild(stats.domElement)

    let clock = new THREE.Clock();
    function render() {
        //clock.getDelta()单位是时间戳
        const spt = clock.getDelta() * 1000;//时间戳*1000 = 毫秒
        //让mesh绕y轴旋转，每次旋转0.01弧度
        renderer.render(scene, camera)
        window.requestAnimationFrame(render)
        //更新帧数
        stats.update()
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
</style>