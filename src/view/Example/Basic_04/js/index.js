import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { group } from './mesh';
import { render } from 'vue';
import {css3Renderer} from './tag'


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
var ambient = new THREE.AmbientLight(0xffffff, 2.9);
scene.add(ambient);

scene.add(group)

var width = window.innerWidth
var height = window.innerHeight

const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000)
camera.position.set(200, 200, 200)
//lookAt必须在position.set后面
camera.lookAt(0, 0, 0)

const renderer = new THREE.WebGLRenderer({
    antialias: true
})
renderer.setSize(width, height)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.render(scene, camera)
// renderer.setClearColor(0xffffff, 1)
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

//requestAnimationFrame循环
renderer.setAnimationLoop(() => {
    css3Renderer.render(scene, camera)
    renderer.render(scene, camera)
})

const controls = new OrbitControls(camera, renderer.domElement)
//设置orbit约束
//设置缩放范围
controls.minDistance = 200;
controls.maxDistance = 500;

//左右旋转范围
// controls.minAzimuthAngle = -120/180 * Math.PI
// controls.maxAzimuthAngle = 120/180 * Math.PI

//上下旋转范围
// controls.minPolarAngle = 0;
// controls.maxPolarAngle = 120/180 * Math.PI


//禁止右键
controls.enablePan = false;


export { scene, camera, renderer}