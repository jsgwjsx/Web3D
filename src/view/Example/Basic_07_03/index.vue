<template>

</template>
<script setup>
import { onMounted } from 'vue';
import * as THREE from 'three'
import { scene, camera, renderer } from './js/index.js'
import {chooseCountry} from './js/chooseCountry.js'
addEventListener('click', chooseCountry); 
document.body.appendChild(renderer.domElement)




</script>
<style scoped>
  
</style>