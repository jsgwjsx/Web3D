<template>
    <div id="container">
    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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

const R = 100//圆弧的半径
const N = 50//分段数量，越多，圆弧就越平滑
const angle =  2*Math.PI/N //每一段的角度间隔
let arr = []
//设置圆心位置，这里再geometry中是在局部坐标系中进行偏移
const x_position = 100
const y_position = 100
for(var i=0;i<N;i++){
    let angles = angle*i//来获取当前角度值
    let x = x_position+R*Math.cos(angles)
    let y = y_position+R*Math.sin(angles)
    arr.push(x,y,0)
}
const attribute = new THREE.BufferAttribute(new Float32Array(arr),3)
const geometry = new THREE.BufferGeometry()
geometry.attributes.position = attribute
const material = new THREE.LineBasicMaterial({
    color:0xff0000
})
const mesh = new THREE.LineLoop(geometry,material)
scene.add(mesh)

//也可以通过setfromPoints设置Buffergeometry.attributes.position
//setFromPoints对数据有所要求，需要设置顶点数据数组，数组中的元素是矢量对象
//设置三维矢量点数据(x,y,z)
const pointsArr = [
    // 三维向量Vector3表示的坐标值
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(0,100,0),
    new THREE.Vector3(0,100,100),
    new THREE.Vector3(0,0,100),
];
//也可以用二维的矢量数据(x,y)
// const pointsArr = [
//     // 三维向量Vector2表示的坐标值
//     new THREE.Vector2(0,0),
//     new THREE.Vector2(100,0),
//     new THREE.Vector2(100,100),
//     new THREE.Vector2(0,100),
// ];
//这样子就可以直接上设置点，而不用经过Bufferattribute
const geometry1 = new THREE.BufferGeometry()

geometry1.setFromPoints(pointsArr)
const material1 = new THREE.PointsMaterial({
    color:'yellow',
    size:10.0//设置点的大小
})
const point = new THREE.Points(geometry1,material1) 
scene.add(point)


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