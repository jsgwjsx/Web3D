<template>
    <button  v-on:click="exportModel" id="exportGLTF">导出模型</button>
</template>
<script setup>
import { onMounted } from 'vue';
import * as THREE from 'three'
import { scene, camera, renderer } from './js/index.js'
import {exportGLTF} from './js/exporGLTF.js'
import {group} from './js/mesh.js'

document.body.appendChild(renderer.domElement)

function exportModel(){
    exportGLTF(group)
}



</script>
<style scoped>
  #exportGLTF{
    position: absolute;
  }
</style>