import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { group } from './mesh';
// import {WaveMeshArr} from './HotNews.js'
import { flyArcGroup,flyArr,WaveMeshArr,ConeMesh} from './FlyArc'//绘制轨迹线、飞线、波动光圈

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
   // css3Renderer.setSize(width, height)
    renderer.setSize(width, height);
    camera.updateProjectionMatrix()
}

//requestAnimationFrame循环
renderer.setAnimationLoop(() => {
    // 批量设置所有飞线的运动动画
    flyArr.forEach((fly) => {
      fly.rotation.z += 0.02; //调节飞线速度
      if (fly.rotation.z >= fly.flyEndAngle) fly.rotation.z = fly.startAngle;
    });
    if (WaveMeshArr.length) {
        WaveMeshArr.forEach(function (mesh) {
          mesh._s += 0.007;
          mesh.scale.set(mesh.size*mesh._s,mesh.size*mesh._s,mesh.size*mesh._s);
          if (mesh._s <= 1.5) {
            mesh.material.opacity = (mesh._s-1) * 2;//2等于1/(1.5-1.0)，保证透明度在0~1之间变化
          } else if (mesh._s > 1.5 && mesh._s <= 2) {
            mesh.material.opacity =  1 - (mesh._s - 1.5)*2;//2等于1/(2.0-1.5) mesh缩放2倍对应0 缩放1.5被对应1
          } else {
            mesh._s = 1.0;
          }
        })
      }
        // 鼠标旋转地球表面热点Mesh，停止自转
   // css3Renderer.render(scene, camera)
   ConeMesh.rotateZ(-0.02);//棱锥自转
    renderer.render(scene, camera)
})

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0,0, 0)
controls.update()


export { scene, camera, renderer,directionalLight,directionalLight2,ambient}