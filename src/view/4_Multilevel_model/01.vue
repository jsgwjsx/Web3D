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


const geometry = new THREE.PlaneGeometry( 100, 100 );

const group1 = new THREE.Group()
const group2 = new THREE.Group()
//为组对象进行命名，方便后面进行查询与操作
group1.name = 'group1'
group2.name = 'group2'
for(var i=0;i<5;i++){
    const material1 = new THREE.MeshLambertMaterial({
    color:'skyblue',
    side:THREE.DoubleSide
})
const material2 = new THREE.MeshLambertMaterial({
    color:0x000000,
    side:THREE.DoubleSide
})
    const plane1 = new THREE.Mesh(geometry,material1)
    const plane2 = new THREE.Mesh(geometry,material2)
    //为模型对象进行命名，方便后面进行查询与操作
    plane1.name = '1'+i
    plane2.name = '2'+i

    plane1.position.x = -100
    plane2.position.x = 100

    plane1.position.z = i*50
    plane2.position.z = i*50

    group1.add(plane1)
    group2.add(plane2)
}
//删除group1最后一个对象
group1.remove(group1.children[group1.children.length-1])
//隐藏group2最后一个对象
group2.children[group2.children.length-1].visible = false

scene.add(group1,group2)
console.log(scene.children)
//此时对group1,group2进行仿射变换，那么其中的所有模型都会做对应的仿射变换
group1.rotateX(90/180*Math.PI)

//通过traverse循环遍历scene下的模型树结构
var objs;
scene.traverse((obj)=>{
    //将name为13，并且是Mesh模型对象的模型对象改变颜色为红色
    if(obj.isMesh&&obj.name=='13')obj.material.color.set('red')
})


//通过getObjectByName('name值')查找指定name的模型对象
const nameNode = scene.getObjectByName('22')
nameNode.material.color.set('white');

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
    
    renderer.setClearColor('white')
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