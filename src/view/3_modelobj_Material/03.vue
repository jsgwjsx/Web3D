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

//灯光
const pointLight = new THREE.PointLight(0xffffff, 2, 0.0)
pointLight.position.set(300, 200, 100)
scene.add(pointLight)
const light = new THREE.AmbientLight(0xffffff, 0);
scene.add(light)

//准备一个几何与材质对象
const geometry = new THREE.BoxGeometry(100,100,100)
const material = new THREE.MeshLambertMaterial({
    color:0x00ffff,
   // wireframe:true
})
// const mesh1 = new THREE.Mesh(geometry,material)
// const mesh2 = new THREE.Mesh(geometry,material)
// mesh2.position.set(150,0,0)
// //添加两个模型到场景中
// scene.add(mesh1,mesh2)
// //一下三种修改颜色的方式实际上指向的是同一个对象
// mesh1.material.color = new THREE.Color('greenyellow')
// mesh2.material.color = new THREE.Color('blue')
// material.color = new THREE.Color('white')

//但是如果想让两个模型对象拥有独立的材质与几何对象
//那么此时就要使用clone与copy方法，复制clone与copy对象
const mesh1 = new THREE.Mesh(geometry,material)
//克隆mesh1,但是此时两个的材质与geometry依旧指向的是同一个对象，因此需要再克隆一下几何体与材质
const mesh2 = mesh1.clone()
mesh2.geometry = mesh1.geometry.clone()
mesh2.material = mesh1.material.clone()
//更改mesh2位置
mesh2.position.set(150,0,0)
//改变mesh2颜色，此时两个对象所指的material对象不同，mesh1颜色不改变
mesh2.material.color = new THREE.Color('yellow')

scene.add(mesh1,mesh2)

//当然也可以使用copy方法来  复制对象.copy(被复制的对象)
//相当于吧mesh2.position的vec3对象复制给了mesh1.position属性
mesh1.position.copy(mesh2.position)
mesh1.position.y+=150




function initProgram(canvasid) {
    let container = document.getElementById(canvasid)
    
    const material = new THREE.MeshLambertMaterial({
        color:0x00ffff,
        side:THREE.DoubleSide,
        //wireframe:true,//线条模式渲染mesh对应的三角形
    })

    
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
        //两个模型姿态同步
        mesh1.rotateY(0.01);
        mesh2.rotation.copy(mesh1.rotation)
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