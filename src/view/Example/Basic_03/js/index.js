import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { group } from './mesh';
import { render } from 'vue';
import {css2Renderer} from './tag';

const scene = new THREE.Scene()

//添加一个三维坐标轴
// const axesHelper = new THREE.AxesHelper(300);
// scene.add(axesHelper);

//设置音频
//const audio = new Audio('/碰撞声.wav');
scene.fog = new THREE.Fog(0x00ffff, 100, 1000)


const light = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(light)
//设置平行光
const DirectionLight = new THREE.DirectionalLight(0xffffff, 1.0, 0.0)
DirectionLight.position.set(100, 100, 60)
scene.add(DirectionLight)

scene.add(group)

var width = window.innerWidth
var height = window.innerHeight

const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000)
camera.position.set(200, 200, 200)
//lookAt必须在position.set后面
camera.lookAt(0, 0, 0)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.render(scene, camera)
renderer.setClearColor(0x00ffff, 1)
renderer.outputEncoding = THREE.sRGBEncoding;


//窗口自适应
window.onresize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    //声明canvas画布的尺寸(单位:px)
    width = window.innerWidth;  //宽度
    height = window.innerHeight;  //高度
    css2Renderer.setSize(width, height)
    renderer.setSize(width, height);
    camera.updateProjectionMatrix()
}

//requestAnimationFrame循环
renderer.setAnimationLoop(() => {
    css2Renderer.render(scene, camera)
    renderer.render(scene, camera)
})

const controls = new OrbitControls(camera, renderer.domElement)
export { scene, camera, renderer, css2Renderer }