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



const light = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(light)
//设置平行光
const DirectionLight = new THREE.DirectionalLight(0xffffff, 1.0, 0.0)
DirectionLight.position.set(100, 100, 60)
scene.add(DirectionLight)



const A = new THREE.Vector3(100, 30, 0);//A点
const B = new THREE.Vector3(80, 100, 0);//B点

// 绿色小球可视化A点位置
const AMesh = createSphereMesh(0x00ff00,2);
AMesh.position.copy(A);
// 红色小球可视化B点位置
const BMesh = createSphereMesh(0xff0000,2);
BMesh.position.copy(B);

const group = new THREE.Group();
group.add(AMesh,BMesh);


//可视化向量对象
//ArrowHelper(向量方向(单位向量),起点(A),(长度AB.length()))
const AB = B.clone().sub(A)
const dir = AB.clone().normalize()
const le = AB.length()
const helper = new THREE.ArrowHelper(dir,A,le)
scene.add(helper)

function createSphereMesh(color,R) {
    const geometry = new THREE.SphereGeometry(R);
    const material = new THREE.MeshLambertMaterial({
        color: color,
    });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

scene.add(group)

const geometry = new THREE.BoxGeometry(50, 50, 50);
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
});
const mesh = new THREE.Mesh(geometry, material);

const p = mesh.geometry.attributes.position;
console.log(p)
const n = mesh.geometry.attributes.normal;
const count = p.count;//顶点数量
for (let i = 0; i < count; i++) {
    // 顶点位置O
    const O = new THREE.Vector3(p.getX(i), p.getY(i), p.getZ(i));
    // 顶点位置O对应的顶点法线
    const dir = new THREE.Vector3(n.getX(i), n.getY(i), n.getZ(i));
    // 箭头可视化顶点法线
    const arrowHelper = new THREE.ArrowHelper(dir, O, 20);
    mesh.add(arrowHelper);
}
scene.add(mesh)

function initProgram(canvasid) {
    let container = document.getElementById(canvasid)

    //获取dom元素的宽高
    var box = container.getBoundingClientRect()

    //声明canvas画布的尺寸(单位:px)
    var width = box.width;  //宽度
    var height = box.height;  //高度
    var s = width / height //设置宽高比
    var k = 600; //设置参数控制大小,相当于二分之一投影矩形的高度
    //创建正交投影相机对象(左，右，上，下，前，后)
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 8000)
    camera.position.set(200, 200, 200)
    camera.lookAt(0, 0, 0);//指向坐标原点

    const renderer = new THREE.WebGLRenderer({
        antialias: true,//开启抗锯齿
    });
  

    renderer.setPixelRatio(window.devicePixelRatio)//传递设备像素比，防止模糊
    //three默认加载gltf因为webgl默认的编码方式不同会造成颜色偏差，
    //修改webgl默认的编码方式，以此来解决three.js渲染结果颜色偏差
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setSize(width, height)
    renderer.render(scene, camera)

    container.appendChild(renderer.domElement)
    const controls = new OrbitControls(camera, renderer.domElement);

    window.onresize = () => {
        //获取dom元素的宽高
        var box = container.getBoundingClientRect()

        //声明canvas画布的尺寸(单位:px)
        width = box.width;  //宽度
        height = box.height;  //高度
        // 1. WebGL渲染器渲染的Cnavas画布尺寸更新
        renderer.setSize(width, height);
        // 2.1.更新相机参数
        const s = width / height;
        camera.aspect = s
        // 2.2.相机的left, right, top, bottom属性变化了，通知threejs系统
        camera.updateProjectionMatrix();
    }



    function render() {
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

#tag {
    overflow: hidden;
    color: white;
    width: 100px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border-radius: 10px;
    background-color: red;
    display:'none';
}
</style>