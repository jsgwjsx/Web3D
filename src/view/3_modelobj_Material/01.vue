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

// const pointLight = new THREE.PointLight(0xffffff, 2, 0.0)
// pointLight.position.set(300, 200, 100)
// scene.add(pointLight)

const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light)


//创建三维矢量对象(x,y,z)
const vec3 = new THREE.Vector3(1,1,1)
//position本质也是Vector3，所以可以通过set直接修改值
//两者方法改变向量的值
//1.通过set方法
vec3.set(100,100,100)

//2.通过属性，直接更改
vec3.x = 200




function initProgram(canvasid) {
    let container = document.getElementById(canvasid)
    //创建一个空的几何体对象
    const geometry = new THREE.BufferGeometry(); 
    //设置点的坐标数据
    const vertices = new Float32Array([
        0,0,0,
        80,0,0,
        80,80,0,
        0,80,0
    ])
    const index = new Uint16Array([
        0,1,2,
        0,2,3,
    ])
    //设置法线
    const normal = new Float32Array([
        0,0,1,
        0,0,1,
        0,0,1,
        0,0,1
    ])
    //创建索引的BufferAttribute
    const indexAttribute = new THREE.BufferAttribute(index,1)
    //创建数据的BufferAttribute
    const attribute = new THREE.BufferAttribute(vertices,3)
    //创建法线的BufferAttribute
    const normals = new THREE.BufferAttribute(normal,3)
    //设置几何体的顶点位置属性
    geometry.attributes.position = attribute
    //设置几何体点的索引值
    geometry.index = indexAttribute
    //设置顶点法相量
    geometry.attributes.normal = normals
    //使用线用来渲染
    //设置线的材质
    console.log(geometry)
    const material = new THREE.MeshLambertMaterial({
        color:0x00ffff,
        side:THREE.DoubleSide,
        //wireframe:true,//线条模式渲染mesh对应的三角形
    })
    const mesh = new THREE.Mesh(geometry,material)
 
    //mesh.rotateX(45/180*Math.PI)
    mesh.translateZ(100)
    mesh.scale.set(2,2,2)
    console.log(mesh)
    //定义一个单位向量，并用于模型translateOnAxis的方向平移
    const axis = new THREE.Vector3(0,0,1)
    //向量归一化
    axis.normalize()
    console.log(axis)
    //按照向量方向平移指定距离(单位向量(表示平移方向),平移距离)
    mesh.translateOnAxis(axis,-100)

    scene.add(mesh)
    
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