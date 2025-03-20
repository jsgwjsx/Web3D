<template>
    <div id="container">

    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import * as THREE from 'three';
//创建一个3维场景scene
const scene = new THREE.Scene()

function initProgram(canvasid) {
    let container = document.getElementById(canvasid)
    //创建一个集合体
    const geometry = new THREE.BoxGeometry(100, 100, 100);

    //创建
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ffff,//红色材质 0x表示16位数
        transparent:true,//允许材质透明
        opacity:0.5,//透明程度
    })

    //创建一个Mesh网格模型(相当于gis中的graphic)：表示生活中的物体
    const mesh = new THREE.Mesh(geometry, material)
    //定义网格模型的位置
    mesh.position.set(100, 100, 100)
    //将物体添加到scene中
    scene.add(mesh)


    //获取dom元素的宽高
    var box = container.getBoundingClientRect()

    //声明canvas画布的尺寸(单位:px)
    var width = box.width;  //宽度
    var height = box.height;  //高度

    //创建透视投影相机对象(fov,aspect(width/height),near,far)
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    //设置相机位置
    camera.position.set(1000, 1000, 1000);
    //1.相机视点，定义相机的观察目标点的坐标
    //camera.lookAt(0,10,0)
    //2.也可以直接指向物体位置
    camera.lookAt(0,0,0)

    //创建WebGL渲染器(画布)
    const renderer = new THREE.WebGLRenderer();
    //设置画布尺寸
    renderer.setSize(width, height)
    //执行渲染方法,类比相机的拍照动作，相当于gl.drawArrays
    renderer.render(scene, camera)
    //添加到页面中,renderer.domElement返回一个canvas画布
    //吧渲染结果，也就是画布，添加到网页页面中
    container.appendChild(renderer.domElement)
    return scene
}

onMounted(()=>{
  initProgram('container')
 
})
</script>
<style scoped>
#container {
    width: 100%;
    height: 100%;
}
</style>