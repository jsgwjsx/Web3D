<template>

</template>
<script setup>
import * as THREE from 'three'
import { scene, camera, renderer,gui} from './js/index.js'
import {stats} from './js/Stats.js'
import { onUnmounted } from 'vue'

document.body.appendChild(renderer.domElement)
document.body.appendChild(stats.domElement)
onUnmounted(() => {
    gui.destroy()
})
</script>
<style scoped>
 @import './css/main.css';

</style>