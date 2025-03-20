import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { group } from './mesh';
import {labelRenderer} from './tag'

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
var ambient = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambient);
scene.add(group)

const axes = new THREE.AxesHelper(200,0x00ffff)
scene.add(axes)


var width = window.innerWidth
var height = window.innerHeight



const camera = new THREE.PerspectiveCamera(45,width/height,0.1,1500)
camera.position.set(200,200,200);
//lookAt必须在position.set后面
camera.lookAt(0,0, 0)

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
    labelRenderer.setSize(width, height)
    renderer.setSize(width, height);
    camera.updateProjectionMatrix()
}

//requestAnimationFrame循环
renderer.setAnimationLoop(() => {
    labelRenderer.render(scene, camera)
    renderer.render(scene, camera)
})

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0,0, 0)
controls.update()


export { scene, camera, renderer,directionalLight,directionalLight2,ambient}