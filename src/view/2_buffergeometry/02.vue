<template>
    <div id="container">

    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// 引入dat.gui.js的一个类GUI

//创建一个3维场景scene
const scene = new THREE.Scene()
//添加一个三维坐标轴
const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);

const pointLight = new THREE.PointLight(0xffffff, 2, 0.0)
pointLight.position.set(300, 200, 100)
scene.add(pointLight)

const light = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(light)

function initProgram(canvasid) {
    let container = document.getElementById(canvasid)
    // const geometry = new THREE.BoxGeometry(100, 100, 100)
    // const material = new THREE.MeshPhongMaterial({
    //     color: 0x00ffff,
    // })
    // const mesh = new THREE.Mesh(geometry, material)
    // mesh.position.set(0, 0, 0)
    // scene.add(mesh)

    //创建一个空的几何体对象
    const geometry = new THREE.BufferGeometry(); 
    //设置点的坐标数据
    const vertices = new Float32Array([
        0,0,0,
        50,0,0,
        0,100,0,
        0,0,10,
        0,0,100,
        50,0,10,
    ])
    //创建一个BufferAttribute属性对象并传入数据(坐标数据，一个顶点的数据长度)
    const attribute = new THREE.BufferAttribute(vertices,3)

    //设置几何体的顶点位置属性
    geometry.attributes.position = attribute
    //使用线用来渲染
    //设置线的材质

    const material = new THREE.LineBasicMaterial({
        color:0xffff00,
        linewidth:10.0,//线的宽度
        linecap:'square',//线两端的样式
        linejoin:'bevel'//定义线连接节点的样式
    })

    //设置Line几何体
    //一条线
    // const Line =new THREE.Line( geometry, material );
    // scene.add(Line)
    //闭合线
    // const Line =new THREE.LineLoop( geometry, material );
    // scene.add(Line)
    //断断续续的线
    const Line =new THREE.LineSegments( geometry, material );
    scene.add(Line)
    

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
        //clock.getDelta()单位是时间戳
        const spt = clock.getDelta() * 1000;//时间戳*1000 = 毫秒
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
</style>