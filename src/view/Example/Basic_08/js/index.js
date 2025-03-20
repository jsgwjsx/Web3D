import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { group } from './mesh';
import { lon2xy } from './math';
import {materialShader1} from './ExtrudeMesh.js'
import { materialShader2} from './ShapeMesh.js'
import { css2Renderer } from './tag.js';
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

const axes = new THREE.AxesHelper(200, 0x00ffff)
scene.add(axes)

scene.fog = new THREE.Fog(0x002222, 1000, 15000)

var width = window.innerWidth
var height = window.innerHeight

var E = 121.49526536464691;//东方明珠经纬度坐标
var N = 31.24189350905988;
var xy = lon2xy(E, N);
var x = xy.x;
var y = xy.y;

const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 30000)
camera.position.set(13524889, 3657486, 5465);
camera.lookAt(x, y, 0);
// camera.position.set(200,200,200)
// camera.lookAt(0,0,0)

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    logarithmicDepthBuffer: true,
})
renderer.setSize(width, height)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.render(scene, camera)
renderer.setClearColor(0x002222)
//renderer.outputEncoding = THREE.sRGBEncoding;


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
var clock = new THREE.Clock(); // 创建一个时钟对象Clock
//requestAnimationFrame循环
renderer.setAnimationLoop(() => {
    // 获得两次scanAnimation执行的时间间隔deltaTime
    var deltaTime = clock.getDelta();
     // 更新uniforms中时间，这样就可以更新着色器中time变量的值
  if (materialShader1&&materialShader2) {
    materialShader1.uniforms.time.value += deltaTime;
    materialShader2.uniforms.time.value += deltaTime;
    if (materialShader1.uniforms.time.value > 6) {
      materialShader1.uniforms.time.value = 0;
      materialShader2.uniforms.time.value = 0;
    }
  }
    css2Renderer.render(scene, camera)
    renderer.render(scene, camera)
})

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(x, y, 0);
//controls.target.set(0,0,0)
controls.update()


export { scene, camera, renderer, directionalLight, directionalLight2, ambient }