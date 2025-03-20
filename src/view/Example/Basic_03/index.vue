<template>
    <div id="messageTag"
        style="visibility:hidden;width:500px;height:400px;position: absolute;color: #fff;z-index: 2;font-size: 16px;">
        <div style="position:relative;">
            <div style="position: absolute;left: 0px;top: 0px;">
                <img src="/model/example/Basic_03/信息背景.png" alt="" style="width:400px;opacity: 1.0;">
            </div>
            <div id="granaryName" style="position:absolute;left:25px;top:40px;font-size:16px">平房仓 P_01</div>
            <div style="position:absolute;left:290px;top:25px">
                <img src="/model/example/Basic_03/温度.png" alt="" style="width:50px;">
            </div>

            <div style="position:absolute;left:330px;top:40px">
                <span id="temperature">19</span>℃
            </div>
            <div id="grain" style="position:absolute;left:170px;top:50px">
                <span id="grain">红豆</span>(吨)
            </div>
            <div style="position:absolute;left:80px;top:85px;font-size:60px;color:#00ffff;vertical-align:middle">
                <img id="grainImg" src="/model/example/Basic_03/豆子/红豆.png" alt="" style="width:60px;">
            </div>
            <div style="position:absolute;left:155px;top:80px;font-size:60px;color:#00ffff;vertical-align:middle">
                <span id="weight">3600</span>t
            </div>
            <div
                style="position:absolute;left:70px;top:170px;padding:8px 25px;border-radius:30px;border:1px solid #00ffff;">
                仓高—<span id="granaryHeight">12</span>m</div>
            <div style="position:absolute;left:225px;top:170px;padding:8px 25px;">
                粮高— <span id="grainHeight">5</span> m
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import * as THREE from 'three'
import { scene, camera, renderer, css2Renderer } from './js'
document.body.appendChild(renderer.domElement)
import { choose,chooseMesh } from './js/choose'
import { tag } from './js/tag';
import messageData from './js/messageData'
var messageTag;
onMounted(() => {
    messageTag = tag("messageTag");//创建粮仓标注的标签
    scene.add(messageTag)
})
// 内容需要改变的HTML元素对应的id
var idArr = ["granaryName", "temperature","grain", "grainImg", "weight", "granaryHeight", "grainHeight"];


addEventListener('click', (event) => {
    if (chooseMesh) {
        messageTag.element.style.visibility = 'hidden';//隐藏标签
      }
      choose(event, messageTag);//执行射线拾取的代码

      // 选中不同粮仓，HTML标签信息跟着改变
      if (chooseMesh) {
        //批量更新粮仓chooseMesh的标签信息
        idArr.forEach(function (id) {
          var dom = document.getElementById(id);
          if(id==="grainImg"){
            dom.src = messageData[chooseMesh.name][id];
          }else{
            dom.innerHTML = messageData[chooseMesh.name][id];
          }
         
        })
        messageTag.element.style.visibility = 'visible';//显示标签        
        // messageTag.position.copy(chooseMesh.getWorldPosition());//通过粮仓世界坐标设置标签位置
        messageTag.position.copy(chooseMesh.position);//射线在粮仓表面拾取坐标
      }
})
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
</style>