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

const meshhelp = new THREE.GridHelper(500,10,0x00ffff,0x00ffff)
scene.add(meshhelp)

//灯光
const pointLight = new THREE.PointLight(0xffffff, 1, 0.0)
pointLight.position.set(300, 200, 100)
scene.add(pointLight)
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light)
// //生成二维二次贝塞尔曲线对象
// // p1、p2、p3表示三个点坐标
// // p1、p3是曲线起始点，p2是曲线的控制点
// const p1 = new THREE.Vector2(-80, 0);
// const p2 = new THREE.Vector2(20, 100);
// const p3 = new THREE.Vector2(80, 0);
// //生成二维二次贝塞尔曲线对象
// const curve = new THREE.QuadraticBezierCurve(p1,p2,p3)

//生成三维二次贝塞尔曲线对象
// p1、p2、p3表示三个点坐标
// const p1 = new THREE.Vector3(-80, 0, 0);
// const p2 = new THREE.Vector3(20, 100, 0);
// const p3 = new THREE.Vector3(80, 0, 100);
// // 三维二次贝赛尔曲线
// const curve = new THREE.QuadraticBezierCurve3(p1, p2, p3);

//生成二维三次贝塞尔曲线对象，实际上与二次的区别就是多了一个控制点CubicBezierCurve
// p1、p2、p3、p4表示4个点坐标
// p1、p4是曲线起始点，p2、p3是曲线的控制点
// const p1 = new THREE.Vector2(-80, 0);
// const p2 = new THREE.Vector2(-40, 50);
// const p3 = new THREE.Vector2(50, 50);
// const p4 = new THREE.Vector2(80, 0);
// // 二维三次贝赛尔曲线
// const curve = new THREE.CubicBezierCurve(p1, p2, p3, p4);

//生成三维三次贝塞尔曲线
const p1 = new THREE.Vector3(-80, 0, 0);
const p2 = new THREE.Vector3(-40, 50, 0);
const p3 = new THREE.Vector3(50, 50, 0);
const p4 = new THREE.Vector3(80, 0, 100);
// 三维三次贝赛尔曲线
const curve = new THREE.CubicBezierCurve3(p1, p2, p3, p4);


//获取点的坐标
const pointsArr = curve.getPoints(50)
//这样子就可以直接上设置点，而不用经过Bufferattribute
const geometry1 = new THREE.BufferGeometry()

geometry1.setFromPoints(pointsArr)
const material1 = new THREE.LineBasicMaterial({
    color:0xffff00,
})
const material2 = new THREE.PointsMaterial({
    color:0x00ffff,
    size:10.0
})
const line1 = new THREE.Line(geometry1,material1) 
const geometry2 = new THREE.BufferGeometry()
geometry2.setFromPoints([p1,p2,p3,p4])
const point = new THREE.Points(geometry2,material2)
const geometry3 = new THREE.BufferGeometry()
geometry3.setFromPoints([p1,p2,p3,p4])
const line2 = new THREE.Line(geometry2,new THREE.LineBasicMaterial({color:'white'}))
scene.add(line1,point,line2)


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