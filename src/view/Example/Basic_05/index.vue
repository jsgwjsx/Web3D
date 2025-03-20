<template>
 <div style="position: absolute;right: 10px;top:10px;">
    <a class="gou" style="" href="https://www.bydauto.com.cn/news-id-2775.html">
      <img src="/model/example/Basic_05/购买.png" alt="" width="24" style="vertical-align: middle;">
      <span>购买</span>
    </a>

    <a class="gou" style="margin-top:10px;" href="https://www.bydauto.com.cn/news-id-2775.html">
      <img src="/model/example/Basic_05/试驾.png" alt="" width="24" style="vertical-align: middle;">
      <span>试驾</span>
    </a>

  </div>

  <div id="color" style="">
    <div class="colorChoose" id="color1"><img src="/model/example/Basic_05/绿.jpg"></div>
    <div class="colorChoose" id="color2"><img src="/model/example/Basic_05/灰.jpg"></div>
    <div class="colorChoose" id="color3"><img src="/model/example/Basic_05/红.jpg"></div>
    <div class="colorChoose" id="color4"><img src="/model/example/Basic_05/黑.jpg"></div>
    <div class="colorChoose" id="color5"><img src="/model/example/Basic_05/白.jpg"></div>
  </div>
  <div id="changeColor">
    <img src="/model/example/Basic_05/变色.png" alt="" width="24" style="vertical-align: middle;">
    <span id="changeColorText">停止变色</span>
  </div>

  <div id="rotateAudio">
    <div id="rotate">
      <img id="rotateimg" src="/model/example/Basic_05/旋转.png" alt="" width="24" style="vertical-align: middle;">
    </div>
    <div id="audio" style="margin-top: 20px;">
      <img id="audioimg" src="/model/example/Basic_05/关闭声音.png" alt="" width="24" style="vertical-align: middle;">
    </div>
    <div style="margin-top: 20px;">
      <img id="light" src="/model/example/Basic_05/开车灯.png" alt="" width="24" style="vertical-align: middle;">
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
import {backgroundAudio} from './js/backgroundAudio'
import { colorTween } from './js/colorTween.js'
import { openCarLight,closeCarLight } from './js/openCarLight.js'
document.body.appendChild(renderer.domElement)

onMounted(()=>{
    // 背景音乐开关
    var audio = false;
    document.getElementById('audio').onclick = function () {
      if (audio) {
        backgroundAudio.pause();
        audio = false;
        document.getElementById('audioimg').src = '/model/example/Basic_05/关闭声音.png';
      } else {
        backgroundAudio.play();
        audio = true;
        document.getElementById('audioimg').src = '/model/example/Basic_05/打开声音.png';
      }
    }

    var colorArr = [0x023911, 0x222222, 0x6a030a, 0x000000, 0xffffff];
    colorArr.forEach(function (value, i) {
      var dom = document.getElementById('color' + (i + 1));
      // 单击按钮切换颜色
      dom.onclick = function(){
        setColor(value)
      }
    })

    var open = true;
    // 颜色变化动画开关
    document.getElementById('changeColor').onclick = function () {
      if (open) {
        colorTween.stop();//停止动画
        open = false;
        document.getElementById('changeColorText').innerHTML = '开始变色';
        setColor(0x023911);//动画停止，颜色回到最初的状态
      }else {
        colorTween.start();//开始动画
        open = true;
        document.getElementById('changeColorText').innerHTML = '停止变色';
      }
    }

    // 模型旋转动画
    var rotateAnimation = null;
    function loop() {
      rotateAnimation = requestAnimationFrame(loop);
      scene.rotateY(0.001);
    }
    loop();
    var rotate = true;
    document.getElementById('rotate').onclick = function () {
      if (rotate) {
        cancelAnimationFrame(rotateAnimation);
        rotate = false;
        document.getElementById('rotateimg').src = '/model/example/Basic_05/停止旋转.png';
      } else {
        loop();
        rotate = true;
        document.getElementById('rotateimg').src = '/model/example/Basic_05/旋转.png';
      }
      
    }
    //车灯
    var light = false;
    document.getElementById('light').onclick = function () {
      if (light) {
        closeCarLight(); 
        light = false;
        document.getElementById('light').src = '/model/example/Basic_05/开车灯.png';
      } else {
        openCarLight();
        light = true;
        document.getElementById('light').src = '/model/example/Basic_05/关车灯.png';
      }
    }

})

//设置颜色
function setColor(color) {
      scene.traverse(function (object) {
        if (object.type === 'Mesh') {
          if (object.name.slice(0, 2) == "外壳") { //外壳颜色设置
            object.material.color.set(color);
          }
        }
      })
    }



</script>
<style scoped>
    .colorChoose {
      display: inline-block;
      margin-left: 20px;
      cursor: pointer;
    }

    .colorChoose img {
      width: 50px;
      border-radius: 25px;
    }

    #color {
      width: 380px;
      position: absolute;
      background: rgba(0, 0, 0, 0.4);
      padding: 10px 16px;
      border-radius: 6px;
      left: 50%;
      margin-left: -190px;
      top: 100%;
      margin-top: -80px;
    }

    .gou {
      color: #ffffff;
      text-decoration: none;
      font-size: 16px;
      display: block;
      padding: 8px 16px;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 30px;
      height: 28px;
      line-height: 28px;
    }

    #changeColor {
      color: #ffffff;
      font-size: 16px;
      padding: 8px 16px;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 30px;
      height: 28px;
      line-height: 28px;

      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 50%;
      margin-top: -22px;
    }

    #rotateAudio {
      position: absolute;
      left: 10px;
      top: 50%;
      margin-top: -88px;
    }

    #rotateAudio div {
      padding: 10px 10px;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 22px;
      cursor: pointer;
    }
</style>