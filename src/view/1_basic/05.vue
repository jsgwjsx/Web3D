<template>
    <div id="container">

    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//创建一个3维场景scene
const scene = new THREE.Scene()
//添加一个三维坐标轴
const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);
//创建点光源并设置点光源位置(光的颜色(color)，光照距离范围/光照强度(intensity)，光照衰减强度(decay))
// const pointLight1 = new THREE.PointLight(0xffffff, 1.0);
// pointLight1.decay = 0.0;
// pointLight1.position.set(200, 100, 150);
// scene.add(pointLight1);

//创建出点光源辅助工具，使点光源可以可视化
//可视化出的点光源大小
// const sphereSize = 10;
// //生成点光源辅助对象
// const pointLightHelper = new THREE.PointLightHelper( pointLight1, sphereSize );
// //加载到scene中
// scene.add(pointLightHelper)


//环境光
const ambient = new THREE.AmbientLight(0xfffff,0.4)
scene.add(ambient)

//平行光
//平行光,默认是从正上方射来
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
//这个position主要用来设置光照的位置，通过再相机的camera.lookat来确定平行光的方向
directionalLight.position.set(200,200,200)
scene.add( directionalLight );

//构建平行光可视化辅助对象
const helper = new THREE.DirectionalLightHelper( directionalLight,10,0xffffff);
scene.add( helper );

function initProgram(canvasid) {
    let container = document.getElementById(canvasid)
    //创建一个几何体(长宽高)
    const geometry = new THREE.BoxGeometry(100, 100, 100);

    //创建
    const material = new THREE.MeshLambertMaterial({
        color: 0xff00ff,//红色材质 0x表示16位数
    })
    //创建一个Mesh网格模型(相当于gis中的graphic)：表示生活中的物体
    const mesh = new THREE.Mesh(geometry, material)
    //定义网格模型的位置
    mesh.position.set(0, 0, 0)
    //将物体添加到scene中
    scene.add(mesh)



    //获取dom元素的宽高
    var box = container.getBoundingClientRect()

    //声明canvas画布的尺寸(单位:px)
    var width = box.width;  //宽度
    var height = box.height;  //高度

    //创建透视投影相机对象(fov,aspect(width/height),near,far)
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(300, 300, 300);
    camera.lookAt(mesh.position)


    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height)
    renderer.render(scene, camera)
    container.appendChild(renderer.domElement)

    //创建controls对象，并将camera与canvas画布挂载到上面
    const controls = new OrbitControls(camera, renderer.domElement);
 
    //dom元素改变的时候执行事件监听
    controls.addEventListener('change',()=>{
        console.log(camera.position)
        renderer.render(scene, camera)//根据改变后的camera重新进行渲染
    })

  

    
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
}
</style>