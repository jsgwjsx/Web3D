<template>
    <!-- 标签HTML/CSS代码 -->
    <div id="tag"
        style="visibility:hidden;color:#ffffff;background:rgba(0,0,0,0.2);padding:6px 16px;border-radius:5px;position: absolute;">
        <div>
            <span>城市：</span>
            <span id="city" style="color:#00ffff">郑州</span>
        </div>
        <div style="height:1px;background:rgb(190,190,190);margin-top:4px;margin-bottom:4px;"></div>
        <div>
            <span>PM2.5：</span>
            <span id="pm" style="color:#00ffff">19</span>
        </div>
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import * as THREE from 'three'
import { scene, camera, renderer } from './js/index.js'
import { tag } from './js/tag'
import { cirGroup } from './js/mesh.js';

document.body.appendChild(renderer.domElement)
onMounted(() => {
    var chooseMesh = null
    var label = tag();
    scene.add(label);

    var pm = document.getElementById('pm');
    var city = document.getElementById('city');
    var div = document.getElementById('tag');

    addEventListener('mousemove', (event) => {
        if (chooseMesh) {
            chooseMesh.material.color.copy(chooseMesh.color);
        } else {
            label.element.style.visibility = 'hidden'
        }
        var Sx = event.clientX
        var Sy = event.clientY

        var x = (Sx / window.innerWidth) * 2 - 1 //webgl标注坐标系
        var y = -(Sy / window.innerHeight) * 2 + 1; //WebGL标准设备纵坐标

        var raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

        var intersect = raycaster.intersectObjects(cirGroup.children);
        if (intersect.length > 0) {
            chooseMesh = intersect[0].object;
            chooseMesh.material.color.set(0x00ffff);//选中改变颜色
            label.position.set(chooseMesh.lnglat[0], chooseMesh.lnglat[1], 0);
            pm.innerHTML = chooseMesh.pm25;
            city.innerHTML = chooseMesh.name;
            label.element.style.visibility = 'visible';
        } else {
            chooseMesh = null
        }
    })
})



</script>
<style scoped></style>