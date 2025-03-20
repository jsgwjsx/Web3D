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
const light = new THREE.AmbientLight(0xffffff,1);
scene.add(light)

const geometry = new THREE.BufferGeometry()
//设置位置数据
const positionArr=new Float32Array([
    0,0,0,
    50,0,0,
    0,25,0
])
//设置颜色
const colorArr = new Float32Array([
    1,0,0,
    0,1,0,
    0,0,1
])
//给geometry赋值点坐标与对应的点的颜色
geometry.attributes.position = new THREE.BufferAttribute(positionArr,3)
geometry.attributes.color = new THREE.BufferAttribute(colorArr,3)
const material = new THREE.MeshBasicMaterial({
    vertexColors:true,//使用顶点颜色着色
    side:THREE.DoubleSide
})
const mesh = new THREE.Mesh(geometry,material)
scene.add(mesh)


//接下来进行曲线颜色渐变,生成设置样条曲线
const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-50, 20, 90),
    new THREE.Vector3(-10, 40, 40),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(60, -60, 0),
    new THREE.Vector3(70, 0, 80)
])
//生成geometry并将canvas的点数据赋值给geometry对象
const geometry1 = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100))

//获取geometry的点数据的数量
const count = geometry1.attributes.position.count

//通过跳转颜色混合的比例，从而通过控制一条曲线的颜色渐变的两端颜色，来形成渐变颜色数组，
const color1 = new THREE.Color(0xff0000)//设置起点颜色
const color2 = new THREE.Color(0x0000ff)//设置终点颜色
//以此生成每个点对应的color属性值
const colorArr1 = []
for(var i = 0;i<count;i++){
    var percent = i/count
    //赋值color1对象，并且用这个对象和color2进行颜色混合
    var pointColors = color1.clone().lerp(color2,percent)
    
    colorArr1.push(pointColors.r,pointColors.g,pointColors.b)
}

//将color赋值给attributes.color
geometry1.attributes.color = new THREE.BufferAttribute(new Float32Array(colorArr1),3)


const material1 = new THREE.LineBasicMaterial({
    // color:0X00ffff,
    vertexColors:true,//启用顶点着色
})
const line = new THREE.Line(geometry1,material1)
scene.add(line)

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
    renderer.outputColorSpace =THREE.SRGBColorSpace
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