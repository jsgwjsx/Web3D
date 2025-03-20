<template>
    <div id="container">
        <div class="pos">
            <div class="bu" v-on:click="downLoad()">下载</div>
        </div>
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

var renderer;

//灯光
const pointLight = new THREE.PointLight(0xffffff, 1, 0.0)
pointLight.position.set(300, 200, 100)
scene.add(pointLight)
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light)

const geometry = new THREE.BoxGeometry(100, 100, 100)
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff
})
const mesh = new THREE.Mesh(geometry, material)
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


    renderer = new THREE.WebGLRenderer({
        antialias: true,//开启抗锯齿
        //alpha:true,//单独开启画布背景透明
       // preserveDrawingBuffer:true//允许下载
    });
    renderer.setPixelRatio(window.devicePixelRatio)//传递设备像素比，防止模糊
    //three默认加载gltf因为webgl默认的编码方式不同会造成颜色偏差，

    renderer.setSize(width, height)
    renderer.render(scene, camera)
    //设置画布背景透明度
    // renderer.setClearAlpha(0.0)
    //设置画布颜色与透明度
    //renderer.setClearColor('red',0.0)
    container.appendChild(renderer.domElement)

    //创建controls对象，并将camera与canvas画布挂载到上面
    const controls = new OrbitControls(camera, renderer.domElement);
    let clock = new THREE.Clock();
    function render() {
        mesh.rotateY(0.01)
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

function downLoad() {
        //创建一个a超链接元素，用来下载保存数据的文件
        const link = document.createElement('a')
        //通过超链接herf属性，设置要保存的文件的数据
        link.href = renderer.domElement.toDataURL('image/png')//通过canvas对象.toDataURL('数据文件类型')来获取three此时的渲染结果图像
        link.download = 'threejs.png';//下载文件名称
        link.click()//js触发超链接的鼠标点击事件，开始下载
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

.pos {
    position: absolute;
    left: 50%;
    margin-left: -45px;
    bottom: 100px;
}

.bu {
    background: rgba(0, 0, 0, 0.1);
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #fff;
    display: inline-block;
    border-radius: 30px;

}

.bu:hover {
    cursor: pointer;
    background: grey;
}
</style>