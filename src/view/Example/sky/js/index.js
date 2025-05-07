import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { stats } from './Stats.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Water } from './Water.js';
import Sky from './Sky.js'
import fragmentshader from '../shaders/skyFragment.frag.glsl'
import vertexshader from '../shaders/skyVertex.vert.glsl'

// 加载天空的 Shader
Sky.Shader.vertexShader = vertexshader;
Sky.Shader.fragmentShader = fragmentshader;

// //实例化一个gui对象
// let gui = new GUI()
// //改变交互界面style属性
// gui.domElement.style.top = '0px'
// gui.domElement.style.right = '0px';
// gui.domElement.style.width = '300px';

let water, sun, boxmesh, sky;
const skyscale = 6371.393;// 地球半径 6371.393km

const scene = new THREE.Scene()


// 平行光1
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(400, 200, 300);
scene.add(directionalLight);
// 平行光2
var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight2.position.set(-400, -200, -300);
scene.add(directionalLight2);
//环境光
var ambient = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambient);

sun = new THREE.Vector3();  //太阳位置

// 水
const waterGeometry = new THREE.PlaneGeometry(skyscale, skyscale);
water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load('/waternormals.jpg', function (texture) {
        texture.wrapT = THREE.RepeatWrapping;
        texture.wrapS = THREE.RepeatWrapping;
    }),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 0,   // 倒影失真率
    fog: scene.fog !== undefined
});
water.rotation.x = - Math.PI / 2;
scene.add(water)

// 天空盒
sky = new Sky();
sky.scale.setScalar(skyscale);
scene.add(sky);

// 参数列表
const parameters = {
    // 云
    uTime: 0.0,
    scale: 6371.393,
    mult: 0.2,// 位置变换系数，控制局部变化翻滚
    weaken: 0.15,// 采样衰减因子
    THICKNESS: 6,// 云厚度
    ABSORPTION: 0.45,// 云的光线吸收率
    N_MARCH_STEPS: 12,// 云采样迭代次数
    N_LIGHT_STEPS: 3,// 光照计算迭代次数
    coverage: 0.5,// 覆盖率
    sunSize: 1.0,// 太阳角半径
    skylineF: 0.2,// 云天际线因子
    curve: 0.3,// 坐标曲率
    // cloudDensity: 10,// 水滴密度（万个/cm^3）
    // cloudRadius: 50,// 水滴半径（nm）

    speed: 0.5,// 风速
    xfactor: 0.3,// x方向系数
    yfactor: 0.3,// y方向系数
    zfactor: 0.1,// z方向系数

    // 天空
    turbidity: 10.0,
    rayleigh: .4,
    mieCoefficient: 0.005,
    mieDirectionalG: 1.0,
    elevation: 45,
    azimuth: 180,
    //exposure: renderer.toneMappingExposure,

    // 水
    distortionScale: 3.7,
    size: 1.0,
};

const skyUniforms = sky.material.uniforms;
// 从环境生成 PMREM
// const pmremGenerator = new THREE.PMREMGenerator(renderer);
let renderTarget;

function updateSun() {
    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
    const theta = THREE.MathUtils.degToRad(parameters.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);

    skyUniforms['sunPosition'].value.copy(sun);

    let up = new THREE.Vector3(0, 1, 0);
    let sun_up = up.dot(sun.normalize());
    // parameters.turbidity = 10.*sun_up;// 0~10
    // parameters.rayleigh = 1. - .00001*sun_up;// .02~.08
    // float raylf = .2 + .8*sun_up;// .2~.1.
    // parameters.mieCoefficient = .1*sun_up;// 0~.03
    // parameters.mieDirectionalG = 0.49*sun_up + .5;// 0.5~0.99 影响亮度
    // parameters.mieDirectionalG = 1. - .00001*sun_up;// 0.5~0.99 影响亮度

    // float turbidity = 10.*sun_up;// 0~10， 接口
    // float mieG = 1. - .00001*sun_up;// .9992~1. 影响亮度，接口
    // float mieC = 0.1*sun_up;// 0~.02，接口

    skyUniforms['turbidity'].value = parameters.turbidity;
    skyUniforms['rayleigh'].value = parameters.rayleigh;
    skyUniforms['mieCoefficient'].value = parameters.mieCoefficient;
    skyUniforms['mieDirectionalG'].value = parameters.mieDirectionalG;
    skyUniforms['sunAngularDiameter'].value = parameters.sunSize * 0.505;
    skyUniforms['mult'].value = parameters.mult;
    skyUniforms['THICKNESS'].value = parameters.THICKNESS / parameters.scale;
    skyUniforms['ABSORPTION'].value = parameters.ABSORPTION;
    skyUniforms['N_MARCH_STEPS'].value = parameters.N_MARCH_STEPS;
    skyUniforms['N_LIGHT_STEPS'].value = parameters.N_LIGHT_STEPS;
    skyUniforms['weaken'].value = parameters.weaken;
    skyUniforms['coverage'].value = parameters.coverage;
    skyUniforms['speed'].value = parameters.speed / 10.0;
    skyUniforms['wind'].value = new THREE.Vector3(parameters.xfactor, parameters.yfactor, parameters.zfactor);
    skyUniforms['skylineF'].value = parameters.skylineF;
    skyUniforms['curve'].value = 1 - parameters.curve;
    // skyUniforms['cloudDensity'].value = parameters.cloudDensity*10000.0;
    // skyUniforms['cloudRadius'].value = parameters.cloudRadius*1.0E-6;
    sky.scale.setScalar(parameters.scale);

    if (renderTarget !== undefined) renderTarget.dispose();

    // renderTarget = pmremGenerator.fromScene(sky);

    // scene.environment = renderTarget.texture;
}


updateSun();
// 立方体
const boxgeometry = new THREE.BoxGeometry(30, 30, 30);
const boxmaterial = new THREE.MeshStandardMaterial({ roughness: 0 });
boxmesh = new THREE.Mesh(boxgeometry, boxmaterial);
scene.add(boxmesh);


var width = window.innerWidth
var height = window.innerHeight

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000)
camera.position.set(0, 100, 300)

var renderer = new THREE.WebGLRenderer({
    antialias: true,
    logarithmicDepthBuffer: true,
})
renderer.setSize(width, height)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.render(scene, camera)
renderer.setClearColor(0x002222)
renderer.toneMapping = THREE.ACESFilmicToneMapping;

//requestAnimationFrame循环
renderer.setAnimationLoop(() => {
    const time = performance.now() * 0.001;

    boxmesh.position.y = Math.sin(time) * 20 + 5;
    boxmesh.rotation.x = time * 0.5;
    boxmesh.rotation.z = time * 0.51;

    water.material.uniforms['time'].value += 1.0 / 60.0;
    sky.material.uniforms['uTime'].value = time;
    renderer.render(scene, camera)
    stats.update()
})

const controls = new OrbitControls(camera, renderer.domElement)
controls.maxPolarAngle = Math.PI * 1.2;
controls.target.set(0, 10, 0);
//controls.target.set(0,0,0)
controls.update()

   // GUI
   const gui = new GUI({ title: '控件' });

   const folderSky = gui.addFolder('天空');
   folderSky.add(parameters, 'scale', 0, 10000, 1).onChange(updateSun).name('缩放');
   folderSky.add(parameters, 'turbidity', 0, 20, 1).onChange(updateSun).name('浊度');
   folderSky.add(parameters, 'rayleigh', 0.0, 4, 0.001).onChange(updateSun).name('瑞利系数');
   folderSky.add(parameters, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(updateSun).name('米氏系数');
   folderSky.add(parameters, 'mieDirectionalG', 0.0, 0.99999999999, 0.001).onChange(updateSun).name('米氏方向因子');
   // folderSky.add( parameters, 'exposure', 0, 1, 0.0001 ).onChange( updateSun ).name('曝光');
   // folderSky.open();

   const folderSun = gui.addFolder('太阳');
   folderSun.add(parameters, 'elevation', 0, 90, 0.1).onChange(updateSun).name('太阳高度');
   folderSun.add(parameters, 'azimuth', - 180, 180, 0.1).onChange(updateSun).name('方位角');
   folderSun.add(parameters, 'sunSize', 0, 10, 1).onChange(updateSun).name('大小');

   const folderCloud = gui.addFolder('云');
   folderCloud.add(parameters, 'mult', 0, 5, 0.01).onChange(updateSun).name('局部翻滚');
   folderCloud.add(parameters, 'weaken', 0, 1, 0.01).onChange(updateSun).name('云量');
   folderCloud.add(parameters, 'THICKNESS', 0, 20, 0.001).onChange(updateSun).name('厚度');
   folderCloud.add(parameters, 'ABSORPTION', 0, 1, 0.01).onChange(updateSun).name('吸光率');
   folderCloud.add(parameters, 'N_MARCH_STEPS', 0, 30, 1).onChange(updateSun).name('采样次数');
   folderCloud.add(parameters, 'N_LIGHT_STEPS', 0, 10, 1).onChange(updateSun).name('阴影');
   folderCloud.add(parameters, 'coverage', 0, 1.0, 0.01).onChange(updateSun).name('覆盖率');
   folderCloud.add(parameters, 'speed', 0, 10, 0.1).onChange(updateSun).name('风速');
   folderCloud.add(parameters, 'xfactor', -1, 1, 0.01).onChange(updateSun).name('风向X');
   folderCloud.add(parameters, 'yfactor', -1, 1, 0.01).onChange(updateSun).name('风向Y');
   folderCloud.add(parameters, 'zfactor', -1, 1, 0.01).onChange(updateSun).name('风向Z');
   folderCloud.add(parameters, 'skylineF', 0, 1, 0.01).onChange(updateSun).name('天际线');
   folderCloud.add(parameters, 'curve', 0.1, 0.6, 0.01).onChange(updateSun).name('高度');
   // folderCloud.add(parameters, 'cloudDensity', 1, 100, 1).onChange(updateSun).name('水滴密度');
   // folderCloud.add(parameters, 'cloudRadius', 1, 500, 1).onChange(updateSun).name('水滴半径');
   


//窗口自适应
window.onresize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    //声明canvas画布的尺寸(单位:px)
    width = window.innerWidth;  //宽度
    height = window.innerHeight;  //高度
    //css2Renderer.setSize(width, height)
    renderer.setSize(width, height);
    camera.updateProjectionMatrix()
}

export { scene, camera, renderer, gui }