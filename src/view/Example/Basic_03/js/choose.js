import * as THREE from 'three'
import { camera, scene } from './index'
import { granaryArr } from './mesh';
import { tag } from './tag';
import { onMounted } from 'vue';


var chooseMesh = null

function choose(event) {
    if (chooseMesh) {
        chooseMesh.material.color.set(0xffffff);
    }
    var Sx = event.clientX
    var Sy = event.clientY

    var x = (Sx / window.innerWidth) * 2 - 1 //webgl标注坐标系
    var y = -(Sy / window.innerHeight) * 2 + 1; //WebGL标准设备纵坐标

    var raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    var intersect = raycaster.intersectObjects(granaryArr);
    if (intersect.length > 0) {
        chooseMesh = intersect[0].object
        chooseMesh.material.color.set(0x00ffff)
    }
}

export { choose, chooseMesh }