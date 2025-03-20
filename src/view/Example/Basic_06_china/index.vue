<template>

</template>
<script setup>
import { onMounted } from 'vue';
import * as THREE from 'three'
import { scene, camera, renderer } from './js/index.js'
import { choose } from './js/choose.js';

document.body.appendChild(renderer.domElement)

addEventListener('mousemove',choose)


</script>
<style scoped>
  
</style>