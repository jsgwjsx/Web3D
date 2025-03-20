<template>
    <div id="container">

    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// 引入dat.gui.js的一个类GUI
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';


let obj = {
    scale: 0,
    bool: true
}

//实例化一个gui对象
let gui = new GUI()
//创建一个3维场景scene
const scene = new THREE.Scene()
//添加一个三维坐标轴
const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);

const pointLight = new THREE.PointLight(0xffffff, 2, 0.0)
pointLight.position.set(300, 200, 100)
scene.add(pointLight)

const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light)
function initProgram(canvasid) {
    let container = document.getElementById(canvasid)
    const geometry = new THREE.BoxGeometry(100, 100, 100)
    const material = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(0, 0, 0)
    scene.add(mesh)



    //改变交互界面style属性
    gui.domElement.style.top = '80px'
    gui.domElement.style.right = '20px';
    gui.domElement.style.width = '300px';

    //创建一个关于坐标的折叠框(折叠框标题)
    const coord = gui.addFolder('坐标')
    //往里面add添加坐标,add(控制对象，对象具体要调试的属性，其他参数(参数调试的范围))
    coord.add(mesh.position, 'x', 0, 100)
    coord.add(mesh.position, 'y', 0, 100)
    coord.add(mesh.position, 'z', 0, 100)

    coord.add(obj, 'scale', [0, 33, 66, 100]).onChange((e) => {
        mesh.position.x = e
        mesh.position.y = e
        mesh.position.z = e
    })

    //添加颜色addColor(控制对象，对象具体属性)
    coord.addColor(material, 'color')

    //创建一个关于坐标的折叠框(折叠框标题)
    const ambientlight = gui.addFolder('光线强度')
    //step(步长)设置步长:每次改变属性值间隔是多少
    ambientlight.add(light, 'intensity', 0, 2).step(0.2)
    //对第二个使用重命名
    ambientlight.add(pointLight, 'intensity', 0, 2).name('pointlight_intensity')

    const ifRotate = gui.addFolder('是否旋转')
    ifRotate.add(obj, 'bool').name('Yes/No')

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

    //dom元素改变的时候执行事件监听
    // controls.addEventListener('change', () => {
    //     console.log(camera.position)
    //     renderer.render(scene, camera)//根据改变后的camera重新进行渲染
    // })

    let clock = new THREE.Clock();
    function render() {
        //clock.getDelta()单位是时间戳
        const spt = clock.getDelta() * 1000;//时间戳*1000 = 毫秒
        //让mesh绕y轴旋转，每次旋转0.01弧度
        obj.bool ? mesh.rotateY(0.01) : ''

        renderer.render(scene, camera)
        window.requestAnimationFrame(render)
    }
    render()

    return scene
}

onUnmounted(() => {
    gui.destroy()
})
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