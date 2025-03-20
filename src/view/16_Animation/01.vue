<template>
    <div id="container">
        <div class="pos">
            <div id="Idle" class="bu">休息</div>
            <div id="Run" class="bu" style="margin-left: 10px;">跑步</div>
            <div id="Walk" class="bu" style="margin-left: 10px;">走路</div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
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

const geometry = new THREE.BoxGeometry(50, 50, 50)
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
//设置模型名称
mesh.name = 'Box'
const times = [0, 3, 6]//时间轴上设置三个时刻0,3,6
const value = [0, 0, 0, 100, 0, 0, 0, 0, 100] //设置三个times时刻对应的position坐标
//生成一个关键帧数据(轨道)对象KeyframeTrack(名称，time，value)
//补充:这个KeyframeTrack对象的名称是不能够随便自定义的，必须是object3d对象名称.属性，以此来与改变的属性值建立联系
const posKF = new THREE.KeyframeTrack('Box.position', times, value)
const colorKF = new THREE.KeyframeTrack('Box.material.color', [2, 5], [1, 0, 0, 0, 0, 1])
//基于关键帧数据，创建一个Clip关键帧动画对象(关键帧轨道集)AnimationClip(名称,持续时间,KeyframeTrack对象数组)
const clip = new THREE.AnimationClip('test', 6, [posKF, colorKF])
//创建一个动画播放器对象AnimationMixer(受动画影响的object3d),用来播放控制关键帧动画对象Animation.clip
const mixer = new THREE.AnimationMixer(mesh)
//使用动画播放器对象.clipAction(AnimationClip对象)函数，返回一个AnimationAction对象，使用这个对象，就可以调度存储在AnimationClips中的动画
const clipAction = mixer.clipAction(clip)
clipAction.play()//播放动画,默认循环播放,但此时只是允许播放
//动画开始播放，但是由于mixer动画播放器的时间没动，所以看起来动画就没有播放
//为了让动画成功的显示出效果，需要不断更新mixer的时间
console.log(mixer)
//控制动画Action
//不允许循环播放，执行以此后默认回到动画开头
clipAction.loop = THREE.LoopOnce
//动画结束后物体状态应留在动画结束的时候
clipAction.clampWhenFinished = true
//设置ClipAction.time属性，把动画定位在任意时刻
clipAction.time = 0;
//设置clip.duration属性，设置动画持续时间，配合time，就可以控制动画播放特定时间段
clip.duration = 6

//设置播放倍速timeScale
const Action = gui.addFolder('动作')
Action.add(clipAction, 'timeScale', 0, 2)



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



    //为了更新mixer动画播放器的时间，就需要使用clock对象
    const time = new THREE.Clock()
    //开始计算时间
    time.start()
    function render() {
        //获取oldtime设置后到当前的秒数，并将oldTime设置为当前时间,其实就是上一次执行getDelta到现在的时间间隔(s)
        const times = time.getDelta()
        mixer.update(times)//动画播放器也更新对应的时间
        renderer.render(scene, camera)
        window.requestAnimationFrame(render)
    }
    render()

    document.getElementById('stop').addEventListener('click', function () {
        clipAction.stop();//动画停止结束，回到开始状态
    })
    document.getElementById('play').addEventListener('click', function () {
        clipAction.reset()//重置，动画结束后，如果想重新播放，必须先reset重置，才能播放 
        clipAction.play();//播放动画
    })
    const bu = document.getElementById('bu');
    bu.addEventListener('click', function () {
        // AnimationAction.paused默认值false，设置为true，可以临时暂停动画
        if (clipAction.paused) {//暂停状态
            clipAction.paused = false;//切换为播放状态
            bu.innerHTML = '暂停';// 如果改变为播放状态，按钮文字设置为“暂停”
        } else {//播放状态
            clipAction.paused = true;//切换为暂停状态
            bu.innerHTML = '继续';// 如果改变为暂停状态，按钮文字设置为“继续”
        }
    })
    Action.add(clipAction, 'time', 0, 6).step(0.1).onChange(() => {
        clipAction.paused = true;
        bu.innerHTML = '继续'
    })

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

.pos {
    position: absolute;
    left: 50%;
    margin-left: -65px;
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
    margin: 3px;
}

.bu:hover {
    cursor: pointer;
    background: grey;
}
</style>