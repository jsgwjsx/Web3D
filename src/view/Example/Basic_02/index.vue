<template>

</template>
<script setup>
import * as THREE from 'three'
import twin from './js/twin'
import { onUnmounted, reactive, watch } from 'vue';
import { keysOf } from 'element-plus/es/utils/objects.mjs';
// 用三维向量表示玩家角色(人)运动漫游速度
//人物当前运动速度，会不断变换
let v = new THREE.Vector3(0, 0, 0);
//人物加速度
let a = 10;//加速度：调节按键加速快慢
//人物最高速度
const vMax = 5;//限制玩家角色最大速度
//人物运动方向，默认w是0,0,1,也就是往人物的正前方
let front = new THREE.Vector3(0, 0, 1);
//阻力系数，自带的减速
const damping = -0.03;
//设置状态用来拖拉移动视角
let leftButtonBool = false;//记录鼠标左键状态
// 上下俯仰角度范围
const angleMin = THREE.MathUtils.degToRad(-15);//角度转弧度
const angleMax = THREE.MathUtils.degToRad(15);
//人的上方向
const up = new THREE.Vector3(0, 1, 0)
let viewBool = true;//true表示第三人称，false表示第一人称
let currentAction;//当前的action
const actionObj = {};//包含所有动作action

//加载gltf模型
twin.loader.load('/model/example/Basic_02/人.glb', (gltf) => {
    twin.scene.add(gltf.scene)
    const mixer = new THREE.AnimationMixer(gltf.scene);
    processClip(gltf, mixer)

    Runing(gltf, mixer, actionObj)
})
twin.renderer.outputEncoding = THREE.sRGBEncoding
const gridHelper = new THREE.GridHelper(50, 100, 0x00ffff, 0x00ffff);
twin.scene.add(gridHelper);
const axesHelper = new THREE.AxesHelper(500);
twin.scene.add(axesHelper);
//设置一个对像来记录键盘事件状态
const keyStates = reactive({
    W: false,
    A: false,
    S: false,
    D: false,
})




function Runing(gltf, mixer, actionObj) {
    const player = gltf.scene
    const cameraGroup = new THREE.Group()
    cameraGroup.add(twin.camera)
    player.add(cameraGroup)
    twin.camera.position.set(0, 1.6, -5.5);//玩家角色后面一点
    twin.camera.lookAt(0, 1.6, 0);//对着人身上某个点  视线大致沿着人的正前方 
    // 当某个键盘按下设置对应属性设置为true
    document.addEventListener('keydown', (event) => {
        if (event.code === 'KeyW') keyStates.W = true;
        if (event.code === 'KeyA') keyStates.A = true;
        if (event.code === 'KeyS') keyStates.S = true;
        if (event.code === 'KeyD') keyStates.D = true;
        if (event.code === 'Escape') document.exitPointerLock();
        if (event.code === 'KeyV') {
            if (viewBool) {
                // 切换到第一人称
                twin.camera.position.z = 1;//相机在人前面一点 看不到人模型即可
            } else {
                // 切换到第三人称
                twin.camera.position.z = -5.5;//相机在人后面一点
            }
            viewBool = !viewBool;
        }

    });
    // 当某个键盘抬起设置对应属性设置为false
    document.addEventListener('keyup', (event) => {
        if (event.code === 'KeyW') keyStates.W = false;
        if (event.code === 'KeyA') keyStates.A = false;
        if (event.code === 'KeyS') keyStates.S = false;
        if (event.code === 'KeyD') keyStates.D = false;
    });
    document.addEventListener('mousedown', () => {
        //body页面指针锁定
        document.body.requestPointerLock()
    });

    document.addEventListener('mousemove', (event) => {
        if (document.pointerLockElement == document.body) {
            player.rotation.y -= event.movementX / 600;
            // 相机父对象cameraGroup绕着x轴旋转,camera跟着转动
            cameraGroup.rotation.x += event.movementY / 600;
            if (cameraGroup.rotation.x < angleMin) {
                cameraGroup.rotation.x = angleMin;
            }
            if (cameraGroup.rotation.x > angleMax) {
                cameraGroup.rotation.x = angleMax;
            };
        }
    });

    // 渲染循环
    const clock = new THREE.Clock();
    function render() {
        const deltaTime = clock.getDelta();
        //获取模型z轴正方向在世界坐标中的方向
        player.getWorldDirection(front)
        if (keyStates.W) {
            //先假设W键对应运动方向为z
            if (v.length() < 5) {//限制最高速度
                // W键按下时候，速度随着时间增加
                v.add(front.clone().multiplyScalar(a * deltaTime));
            }
        }
        if (keyStates.S) {
            let b = -a
            //先假设W键对应运动方向为z
            if (v.length() < 5) {//限制最高速度
                // W键按下时候，速度随着时间增加
                v.add(front.clone().multiplyScalar(b * deltaTime));
            }
        }
        if (keyStates.A) {
            //当前正方向
            const left = up.clone().cross(front.clone())
            if (v.length() < 5) {//限制最高速度
                v.add(left.multiplyScalar(a * deltaTime));
            }
        }
        if (keyStates.D) {
            const left = front.clone().cross(up.clone())
            if (v.length() < 5) {//限制最高速度
                v.add(left.multiplyScalar(a * deltaTime));
            }
        }
        //更新玩家角色的位置  当v是0的时候，位置更新也不会变化
        if (v.length() > 0.001) {
            // 阻尼减速
            v.addScaledVector(v, damping);
        }
        const deltaPos = v.clone().multiplyScalar(deltaTime);
        //更新动画
        playerUpdate(actionObj)
        player.position.add(deltaPos);
        mixer.update(deltaTime);
        window.requestAnimationFrame(render)
    }
    render()
}

function playerUpdate(actionObj) {
    const vL = v.length();
    if (vL < 0.3) {//速度小于0.2切换到站着休息状态
        // 如果当前就是Idle状态，不需要再次执行changeAction
        if (currentAction.name != 'Idle') changeAction('Idle', actionObj);
    } else if (2 > vL > 0.3) {
        if (currentAction.name != 'Walk') changeAction('Walk', actionObj);
    } else {//步行状态
        if (currentAction.name != 'Run') changeAction('Run', actionObj);
    }

}
function changeAction(name, actionObj) {
    currentAction.weight = 0.0;//原来动作权重为0，不播放
    actionObj[name].weight = 1.0
    currentAction = actionObj[name]
}

function processClip(gltf, mixer) {
    //循环遍历模型动画，并添加到actionObj中
    const clipArr = gltf.animations;//所有骨骼动画
    for (let i = 0; i < clipArr.length; i++) {
        const clip = clipArr[i];//休息、步行、跑步等动画的clip数据
        const action = mixer.clipAction(clip);//clip生成action
        action.name = clip.name;//action命名name
        // 批量设置所有动画动作的权重
        if (action.name === 'Idle') {
            action.weight = 1.0;//这样默认播放Idle对应的休息动画
        } else {
            action.weight = 0.0;
        }
        action.play();
        // action动画动作名字作为actionObj的属性
        actionObj[action.name] = action;
    }
    currentAction = actionObj['Idle'];//记录当前播放的动作
}
</script>
<style scoped>
#container {
    width: 100%;
    height: 100%;

}
</style>