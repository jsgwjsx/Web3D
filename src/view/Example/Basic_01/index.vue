<template>
    
</template>
<script setup>
import * as THREE from 'three'
import twin from './js/twin'
import { onUnmounted } from 'vue';

//加载gltf模型
twin.loader.load('/model/example/Basic_01/收费站Draco.glb', (gltf) => {
     twin.scene.add(gltf.scene)
})
twin.renderer.outputEncoding = THREE.sRGBEncoding

</script>
<style scoped>
#container {
    width: 100%;
    height: 100%;

}
</style>