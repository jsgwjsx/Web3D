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
// const pointLight = new THREE.PointLight(0xffffff, 2, 0.0)
// pointLight.position.set(300, 200, 100)
// scene.add(pointLight)
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light)

//创建贴图加载器对象
const loader = new THREE.TextureLoader()
//根据路径加载贴图
const texture = loader.load('/瓷砖.jpg')
//设置texture阵列
//在水平(s)与垂直(t)方向上允许重复
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
//设置重复的次数
texture.repeat.set(10,10)

const geometry = new THREE.PlaneGeometry(2000,2000);
//目前没有设置uv坐标，是使用的geometry默认的贴图方式进行的贴图
const material = new THREE.MeshLambertMaterial({
    color:0xffffff,//map与color不能同时使用，除非color是白色，否则颜色贴图和color属性颜色值会混合
    map:texture//设置贴图
})
const mesh = new THREE.Mesh(geometry,material)
//设置uv坐标,uv要与position坐标一一对应
let uv = new Float32Array([
    0.0,1.0,//左上
    1.0,1.0,//右上
    0.0,0.0,//左下
    1.0,0.0,//右下  
])
//将uv坐标处理成BufferAttribute对象 
let uvxArrtribute = new THREE.BufferAttribute(uv,2)
console.log(geometry.attributes)
//将uv坐标加入到geometry.attributes对象下的uv属性就可以

geometry.attributes.uv = uvxArrtribute
//旋转平面，形成地面
mesh.rotateX(-90/180*Math.PI)
scene.add(mesh)

//加载辅助格网
const MeshHelp = new THREE.GridHelper(2000, 50, 0x004444, 0x00ffff)
MeshHelp.position.y = 1
scene.add(MeshHelp)

//加载透明图片
const loader1 = new THREE.TextureLoader()
const texture1 = loader1.load('/指南针.png')
const material1 = new THREE.MeshLambertMaterial({
    map:texture1,
    transparent:true,//开启透明计算，让图片的透明背景自动透明
})
const geometry1 = new THREE.PlaneGeometry(60, 60);
const Mesh1 = new THREE.Mesh(geometry1,material1)
Mesh1.translateY(1)
Mesh1.rotateX(-90/180*Math.PI)

scene.add(Mesh1)


function initProgram(canvasid) {
    let container = document.getElementById(canvasid)
    
    //获取dom元素的宽高
    var box = container.getBoundingClientRect()

    //声明canvas画布的尺寸(单位:px)
    var width = box.width;  //宽度
    var height = box.height;  //高度

    //创建透视投影相机对象(fov,aspect(width/height),near,far)
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
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