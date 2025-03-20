<template>
    <div id="container">

    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
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
    //创建一个几何体(长宽高)
    const geometry = new THREE.BoxGeometry(100, 100, 100);

    //创建
    const material = new THREE.MeshLambertMaterial({
        color: 0xffff00,
    })
    //创建一个Mesh网格模型(相当于gis中的graphic)：表示生活中的物体
    const mesh = new THREE.Mesh(geometry, material)
    //定义网格模型的位置
    mesh.position.set(0, 0, 0)
    //将物体添加到scene中
    scene.add(mesh)



    //获取dom元素的宽高
    var box = container.getBoundingClientRect()

    //声明canvas画布的尺寸(单位:px)
    var width = box.width;  //宽度
    var height = box.height;  //高度

    //创建透视投影相机对象(fov,aspect(width/height),near,far)
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(300, 300, 300);
    camera.lookAt(mesh.position)


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
    let clock = new THREE.Clock();
    function render() {
        //clock.getDelta()单位是时间戳
        const spt = clock.getDelta()*1000;//时间戳*1000 = 毫秒
        // console.log('时间间隔为(秒)',spt)
        // console.log('fps',1000/spt)
        //让mesh绕y轴旋转，每次旋转0.01弧度
        mesh.rotateY(0.01);
        renderer.render(scene, camera)
        window.requestAnimationFrame(render)
    }


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
}
</style>