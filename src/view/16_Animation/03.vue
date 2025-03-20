<template>
    <div id="container">
    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//实例化一个gui对象
let gui = new GUI()
//改变交互界面style属性
gui.domElement.style.top = '80px'
gui.domElement.style.right = '20px';
gui.domElement.style.width = '300px';
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

//几何体两组顶点一一对应，位置不同，然后通过权重系数，可以控制模型形状在两组顶点之间变化
const geometry = new THREE.BoxGeometry(50, 50, 50);
// 为geometry提供变形目标的顶点数据(注意和原始geometry顶点数量一致)
const target1 = new THREE.BoxGeometry(50, 200, 50).attributes.position;//变高
const target2 = new THREE.BoxGeometry(10, 50, 10).attributes.position;//变细
// 几何体顶点变形目标数据，可以设置1组或多组,这里面设置的只是一种变形的最终目标
geometry.morphAttributes.position = [target1, target2];//bufferGeometry对象数组
console.log(target1)
const material = new THREE.MeshLambertMaterial({
    color:0x00ffff
})
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh)
//mesh.morphTargetInfluences,设置变形的权重系数(0~1)
//注意:变形数据是存在mesh.geometry.morphAttributes.position中的，这个morphAttributes就和geometry对象一样，存的对象属性值都是buffergeometry
//而变形权重全是在mesh.morphTargetInfluences中存的，注意区分
const obj = {
    t1: 0,
    t2: 0,
}
gui.add(obj, 't1', 0, 1).name('变形目标1').onChange(function (v) {
    // 变形目标1对物体形状影响权重
    mesh.morphTargetInfluences[0] = v;
});
gui.add(obj, 't2', 0, 1).name('变形目标2').onChange(function (v) {
    // 变形目标2对物体形状影响权重
    mesh.morphTargetInfluences[1] = v;
});
//设置物体变形动画
// 创建变形动画权重系数的关键帧数据
mesh.name = "Box";//关键帧动画控制的模型对象命名
// 设置变形目标1对应权重随着时间的变化
const KF1 = new THREE.KeyframeTrack('Box.morphTargetInfluences[0]', [0, 5], [0, 1]);
// 设置变形目标2对应权重随着时间的变化
const KF2 = new THREE.KeyframeTrack('Box.morphTargetInfluences[1]', [5, 10], [0, 1]);
// 创建一个剪辑clip对象
const clip = new THREE.AnimationClip("t", 10, [KF1, KF2]);
// 播放变形动画
const mixer = new THREE.AnimationMixer(mesh);
const clipAction = mixer.clipAction(clip);
clipAction.play();
clipAction.loop = THREE.LoopOnce; //不循环播放
clipAction.clampWhenFinished = true // 物体状态停留在动画结束的时候

const clock = new THREE.Clock();

function loop() {
    requestAnimationFrame(loop);
    const frameT = clock.getDelta();
    // 更新播放器时间
    mixer.update(frameT);
}
loop();



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
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.setPixelRatio(window.devicePixelRatio)//传递设备像素比，防止模糊
    // renderer.outputColorSpace = THREE.SRGBColorSpace
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
        renderer.setSize(width, height)
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

</style>