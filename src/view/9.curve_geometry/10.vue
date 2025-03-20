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
const light = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(light)

//通过一堆二维向量表示一个多边形的轮廓坐标
const pointsArr = [
    // 按照特定顺序，依次书写多边形顶点坐标
    new THREE.Vector2(-50, -50), //多边形起点
    new THREE.Vector2(-50, 50),
    new THREE.Vector2(50, 50),
    new THREE.Vector2(50, -50),
]
//设置轮廓线，来设置，方便进行扫描拉伸shape
const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-50,0,50),new THREE.Vector3(0,100,0),new THREE.Vector3(50,0,-50))
//根据轮廓坐标生成Shape轮廓对象(Vector2数组)
const shape = new THREE.Shape(pointsArr)
//通过shape构建拉伸几何体ExtrudeGeometry(shape对象，参数)
const geometry = new THREE.ExtrudeGeometry(shape,{
    //拉伸shape
    // depth: 20,//拉伸长度，默认拉伸方向是正z轴
    // bevelEnabled:false,//是否倒角,默认为true
    // bevelThickness:5,//倒角尺寸:拉伸方向
    // bevelSize: 5, //倒角尺寸:垂直拉伸方向
    // bevelSegments:20,///倒圆角：倒角细分精度，默认3
    //扫描shape
    extrudePath:curve,//扫描轨迹，通过是否设置这个来判断是拉伸shape还是扫描shape
    steps:100,//沿着路径细分精度，默认为1，通常与extrudePath配合使用
})
const material = new THREE.MeshLambertMaterial({
    color:0x00ffff
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