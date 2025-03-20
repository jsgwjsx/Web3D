import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { group } from './mesh';
import { mapgroup } from './mesh';
import { Conemesh } from './ConeGeometry';
import {css3Renderer } from './tag';
import { flyGroup,updateFlyGeo } from './fly';
const scene = new THREE.Scene()

//添加一个三维坐标轴
// const axesHelper = new THREE.AxesHelper(300);
// scene.add(axesHelper);

//设置音频
//const audio = new Audio('/碰撞声.wav');
// scene.fog = new THREE.Fog(0x00ffff, 100, 1000)

// 平行光1
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(400, 200, 300);
scene.add(directionalLight);
// 平行光2
var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight2.position.set(-400, -200, -300);
scene.add(directionalLight2);
//环境光
var ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);
scene.add(group)

const axes = new THREE.AxesHelper(200,0x00ffff)
scene.add(axes)


var width = window.innerWidth
var height = window.innerHeight

const camera = new THREE.PerspectiveCamera(30, width / height, 1, 4000)
camera.position.set(104.28,35.83,100);
//lookAt必须在position.set后面
camera.lookAt(104.28,35.83,200)

const renderer = new THREE.WebGLRenderer({
    antialias: true
})
renderer.setSize(width, height)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.render(scene, camera)
 
//renderer.outputEncoding = THREE.sRGBEncoding;



//窗口自适应
window.onresize = () => {

    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    //声明canvas画布的尺寸(单位:px)
    width = window.innerWidth;  //宽度
    height = window.innerHeight;  //高度
    css3Renderer.setSize(width, height)
    renderer.setSize(width, height);
    camera.updateProjectionMatrix()
}

//光圈大小在1-2.5之间变换
var _s = 2.6
//requestAnimationFrame循环
renderer.setAnimationLoop(() => {
    mapgroup.children.forEach((cirMesh, i) => {
        if (cirMesh.s <= 1) {
          cirMesh.s += 0.01;
          cirMesh.scale.set(cirMesh.s, cirMesh.s, cirMesh.s)
          cirMesh.material.opacity = (cirMesh.s - 0.7) * 3.3;
        } else if (cirMesh.s > 1 && cirMesh.s <= _s + 1) {
          cirMesh.s += 0.01;
          cirMesh.scale.set(cirMesh.s, cirMesh.s, cirMesh.s)
          cirMesh.material.opacity = 1 - (cirMesh.s - 1) / _s;
        } else {
          cirMesh.s = 0.7;
        }
      });
    Conemesh.rotateY(0.01)
    css3Renderer.render(scene, camera)
    renderer.render(scene, camera)
    //飞线动画
    if(flyGroup){
        flyGroup.children.forEach((flyTrack, i) => {
            // 获取飞线轨迹线上的顶点坐标，用于飞线段绘制
            var points = flyTrack.flyTrackPoints;
            var flyline = flyTrack.children[0];
            var indexMax = points.length - flyline.num; //飞线取点索引范围
            if (flyline.index < indexMax) {
              flyline.index += 1
            } else {
              flyline.index = 0
            }
            updateFlyGeo(flyline, flyline.index, points); //更新飞线的位置，生成飞行动画
    
          });
    }
    
    
})

const controls = new OrbitControls(camera, renderer.domElement)
//controls.position = (104.28225326538086,  35.83740043640137,0)
controls.target=new THREE.Vector3(104.28,35.83,0)
controls.update()

export { scene, camera, renderer,directionalLight,directionalLight2,ambient,_s}