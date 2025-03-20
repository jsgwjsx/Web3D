import * as THREE from 'three'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { scene } from './index'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { CreatePointsTag } from './Sprite'
import {SetCarMaterial} from './SetCarMaterial'
import {CreateCarTags} from './PointsTags.js'; //创建热点
import { open } from './open.js'
import {
  lensflare1,
  lensflare2,
} from './openCarLight.js'; //轿车前灯发光模拟


const group = new THREE.Group()

const draco = new DRACOLoader()
//DRACOLoader依赖examples\jsm\libs\draco\gltf里面多个解压文件
draco.setDecoderPath('/draco/')
const loader = new GLTFLoader()
loader.setDRACOLoader(draco)

var sprite ;


var mesh;

loader.load('/model/example/Basic_05/轿车.glb', (gltf) => {
  group.add(gltf.scene)
  
  SetCarMaterial(gltf)

  //标注热点
  CreateCarTags(gltf.scene)
  //设置开关门
  open(gltf.scene)

  //添加车灯光晕
  // glrt模型中用来给车灯定位的空物体,获取坐标，用来在openCarLight.js文件中生成发光效果
  var light1 = gltf.scene.getObjectByName('镜头光晕1');
  var light2 = gltf.scene.getObjectByName('镜头光晕2');
  light1.add(lensflare1);
  light2.add(lensflare2);
 
})

//设置地面
var geometry = new THREE.PlaneGeometry(6000,6000)//矩形平面
var texture = new THREE.TextureLoader().load('/model/example/Basic_05/瓷砖.jpg')
texture.encoding = THREE.sRGBEncoding;

//设置阵列
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;

//设置uv重复数量
texture.repeat.set(12,12)
const material = new THREE.MeshLambertMaterial({
  map:texture
})
const ground = new THREE.Mesh(geometry,material)
ground.rotateX(-Math.PI/2)
group.add(ground)

//设置隧道
var sphereGroup = new THREE.Group();
var R = 550;
// 创建一个圆柱表示隧道
//参数6设置true，不创建圆柱的两个底面
var geometry1 = new THREE.CylinderGeometry(R * 1.01, R * 1.01, R * 9, 32,1,true);
var material1 = new THREE.MeshPhongMaterial({
    color: 0x222222,
    side: THREE.BackSide, //背面可见，相机和车都在隧道里面
});
var spheremesh = new THREE.Mesh(geometry1, material1);
sphereGroup.add(spheremesh);
sphereGroup.rotateZ(Math.PI / 2);
group.add(sphereGroup);


//设置灯
//隧道圆柱面上设置一些装饰圆点
var sphereGeo = new THREE.CylinderGeometry(R, R, R * 8, 32, 50,true);
var pos = sphereGeo.attributes.position;
var cirGeo = new THREE.CircleGeometry(8, 15, 15);
for (let i = 0; i < pos.count; i++) {
    var cirMaterial = new THREE.MeshLambertMaterial({
        color: 0xaaaa66,
        side: THREE.BackSide,
    }); //材质对象Material
    cirMaterial.color.r = Math.random() * 0.7 + 0.3;
    cirMaterial.color.g = cirMaterial.color.r;
    cirMaterial.color.b = cirMaterial.color.r;
    var x = pos.getX(i);
    var y = pos.getY(i);
    var z = pos.getZ(i);
    let V1 = new THREE.Vector3(0, 0, 1); //垂直屏幕的方向  z轴方向
    let V2 = new THREE.Vector3(x, 0, z).normalize(); //圆柱y设置为0
    let q = new THREE.Quaternion();
    q.setFromUnitVectors(V1, V2);
    let M = new THREE.Matrix4();
    M.makeRotationFromQuaternion(q);
    var planeMesh = new THREE.Mesh(cirGeo, cirMaterial); //网格模型对象Mesh
    planeMesh.applyMatrix4(M)
    planeMesh.position.set(x, y, z);
    sphereGroup.add(planeMesh);
}
sphereGroup.position.y = -10;
const helper = new THREE.AxesHelper(1000)
sphereGroup.add(helper)

export { group, mesh,sprite }