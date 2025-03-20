import * as THREE from 'three'
import { camera } from './index'
import { sprite} from './mesh';


function choose(event) {

    var Sx = event.clientX
    var Sy = event.clientY

    var x = (Sx / window.innerWidth) * 2 - 1 //webgl标注坐标系
    var y = -(Sy / window.innerHeight) * 2 + 1; //WebGL标准设备纵坐标

    var raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    var intersect = raycaster.intersectObjects([sprite]);
    if (intersect.length > 0) {
        var dom = document.getElementById('camera');
        dom.style.visibility = 'visible'
    }
}

export { choose}