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


// 创建多段线条的顶点数据
const p1 = new THREE.Vector3(0, 0,100)
const p2 = new THREE.Vector3(0, 0,30);
const p3 = new THREE.Vector3(0, 0,0);
const p4 = new THREE.Vector3(30, 0, 0);
const p5 = new THREE.Vector3(100, 0, 0);
//设置直线1和2,注意点顺序，第一部分线的终点要对应第二部分线的起点
const line1 = new THREE.LineCurve3(p1,p2)
const line2 = new THREE.LineCurve3(p4,p5)

const Bezier = new THREE.QuadraticBezierCurve3(p2,p3,p4)
//CanvaPath创建一个组合曲线对象
const path = new THREE.CurvePath();
//line1, arc, line2拼接出来一个U型轮廓曲线，注意顺序
path.curves.push(line1,Bezier,line2)

//生成一个管线对象TubeGeometry(Curve对象，路径方向细分数，管道半径，管道圆弧细分数，是否闭合)
const geometry = new THREE.TubeGeometry(path, 40, 10, 25);
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