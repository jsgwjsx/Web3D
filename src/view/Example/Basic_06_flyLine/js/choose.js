import * as THREE from 'three'
import { camera, scene } from './index'
import { shapegroup } from './mesh';
import { tag } from './tag';
import {updateFly} from './fly'
import {ChildrenNum } from './mesh'
var chooseMesh = null
var label = tag();
scene.add(label);

function choose(event) {
    if (chooseMesh) {
        chooseMesh.material.color.set(0x004444)
        label.element.style.visibility = 'hidden'
        chooseMesh.currguation.position.z = 2.3
    }
    var Sx = event.clientX
    var Sy = event.clientY

    var x = (Sx / window.innerWidth) * 2 - 1 //webgl标注坐标系
    var y = -(Sy / window.innerHeight) * 2 + 1; //WebGL标准设备纵坐标

    var raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    var intersect = raycaster.intersectObjects(shapegroup.children);
    if (intersect.length > 0) {
        chooseMesh = intersect[0].object
        chooseMesh.material.color.set(0x008888)
        //固定标签位置在行政区省会城市重合
        //label.position.set(chooseMesh.lnglat[0], chooseMesh.lnglat[1], 0);
        //固定标签位置跟随相交点移动
        label.position.set(intersect[0].point.x,intersect[0].point.y, 5);
        label.element.innerHTML = chooseMesh.name;
        label.element.style.visibility = 'visible';
        chooseMesh.currguation.position.z = 5.0
        chooseMesh.currguation.s = 1.0
        updateFly(chooseMesh.name,ChildrenNum )
    }else{
        chooseMesh = null
    }
}

export { choose, chooseMesh }