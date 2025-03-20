<template>

    <div id="camera">
        <div>
            <div style="height:1px;width:130px;background: #00ffff;margin-top:68px"></div>
        </div>
        <div id="message" style="width:350px;height:120px;">
            <div style="padding: 10px 4px;font-size:18px;">双摄像头</div>
            <div style="padding: 10px 24px;font-size:16px;">后置主摄像头——1300万像素(F/1.8光圈)</div>
            <div style="padding: 10px 24px;font-size:16px;">后置副摄像头——200万像素的</div>
        </div>
        <!-- 设置一个关闭按钮 -->
        <div style="position:relative;">
            <div style="position: absolute;left: -30px;top: 10px;">
                <img id="close" src="/model/example/Basic_04/关闭.png" alt="" width="18" style="cursor: pointer;"
                    v-on:click="close">
            </div>
        </div>
    </div>

    <div class="pos">
        <div class="bu" v-on:click="toggleColor('black')">
            <img src="/model/example/Basic_04/幻夜黑.png" alt="">
        </div>
        <div class="bu" v-on:click="toggleColor('blue')">
            <img src="/model/example/Basic_04/极光蓝.png" alt="">
        </div>
        <div class="bu" v-on:click="toggleColor('purple')">
            <img src="/model/example/Basic_04/极光紫.png" alt="">
        </div>
        <div class="bu" v-on:click="toggleColor('red')">
            <img src="/model/example/Basic_04/珊瑚红.png" alt="">
        </div>
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import * as THREE from 'three'
import { scene, camera, renderer } from './js'
import { group } from './js/mesh'
import { toggleColor } from './js/toggleColor'
import { choose } from './js/choose';
document.body.appendChild(renderer.domElement)

addEventListener('click', choose)

function close() {
    var dom = document.getElementById('camera');
    dom.style.visibility = 'hidden'
}
</script>
<style scoped>
#tag {
    width: 50px;
    height: 30px;
    text-align: center;
    font-size: 12px;
    color: white;
    font-weight: 700;
    line-height: 30px;
    background-image: url('/public/model/example/Basic_03/信息背景.png');
    background-size: 100% 100%;

}

.pos {
    position: absolute;
    left: 38%;

    bottom: 20px;
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
    text-align: center;
    margin: 0px 10px;
}

.bu>img {
    position: relative;
    width: 40px;
    height: 40px;
    top: 10px;
}

.bu:hover {
    cursor: pointer;

}

#camera {
    position: absolute;
    display: flex;
    /* row是flex-direction默认值,可以不设置，表示主轴为水平方向，从左向右排列*/
    flex-direction: row;
    /*space-between表示*/
    justify-content: space-between;
    visibility: hidden;
    backface-visibility: hidden;
}

#message {
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
    padding: 0px;
    /* 边框 */
    background: linear-gradient(#00ffff, #00ffff) left top,
        linear-gradient(#00ffff, #00ffff) left top,
        linear-gradient(#00ffff, #00ffff) right bottom,
        linear-gradient(#00ffff, #00ffff) right bottom;
    background-repeat: no-repeat;
    background-size: 2px 20px, 72px 2px;
    background-color: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    font-size: 18px;
    padding: 8px 12px;
}

#close {
    pointer-events: auto;
}
</style>