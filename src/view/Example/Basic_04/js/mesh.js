import * as THREE from 'three'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { scene } from './index'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { CreatePointsTag } from './Sprite'
import { tag } from '../js/tag'

const group = new THREE.Group()

const draco = new DRACOLoader()
//DRACOLoader依赖examples\jsm\libs\draco\gltf里面多个解压文件
draco.setDecoderPath('/draco/')
const loader = new GLTFLoader()
loader.setDRACOLoader(draco)

var sprite ;

var textureCube = new THREE.CubeTextureLoader()
  .setPath('/model/example/Basic_04/Park3Med/')
  .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg',])

var mesh;

loader.load('/model/example/Basic_04/手机.gltf', (gltf) => {
  group.add(gltf.scene)
  mesh = gltf.scene.getObjectByName('手机');//找到手机Mesh
  // console.log('mesh', mesh);
  var texLoader = new THREE.TextureLoader();//纹理贴图加载器
  // mesh.material：设置手机Mesh材质
  mesh.material = new THREE.MeshStandardMaterial({
    // color:0xffffff,
    metalness: 1.0,//Mesh表面金属度，默认值0.5
    roughness: 1.0,//Mesh表面粗糙度，默认值0.5
    map: texLoader.load("/model/example/Basic_04/basecolor.png"), //颜色贴图
    // 金属度、粗糙度贴图表示的值会和金属度、粗糙度分别相乘
    roughnessMap: texLoader.load("/model/example/Basic_04/roughness.png"), //粗糙度贴图
    metalnessMap: texLoader.load("/model/example/Basic_04/metallic.png"), //金属度贴图
    normalMap: texLoader.load("/model/example/Basic_04/normal.png"), //法线贴图
    // 相机镜头等位置需要设置半透明效果(设置alphaMap和transparent属性)
    alphaMap: texLoader.load("/model/example/Basic_04/opacity.png"),//alpha贴图
    transparent: true, //使用alphaMap，注意开启透明计算
    envMap: textureCube,
    envMapIntensity: 0.9
  })
  // 注意：纹理朝向texture.flipY设置
  mesh.material.map.flipY = false;
  mesh.material.normalMap.flipY = false;
  mesh.material.metalnessMap.flipY = false;
  mesh.material.roughnessMap.flipY = false;
  mesh.material.alphaMap.flipY = false;


  var frontObject3D = gltf.scene.getObjectByName();
  sprite = CreatePointsTag(frontObject3D)
  sprite.position.x = 20;//向右侧稍微偏移，不要叠加在相机上
  sprite.position.z = -7;//根据sprite大小平移，避免任意观察角度精灵插入到相机内
  sprite.position.y = 63
  group.add(sprite);


  // 多个半透明对象叠加，three.js渲染的时候很可能出现问题，可以尝试手动排序解决
  mesh.renderOrder = 0; //renderOrder小的先渲染
  sprite.renderOrder = 1;

  //设置精灵模型波动
  var s = 0
  function DrnamicChanage() {
    s += 0.01
    if (s < 0.5) {
      sprite.scale.x = 6 * (1 + s)
      sprite.scale.y = 6 * (1 + s)
    } else if (s >= 0.5 && s < 1.0) {
      sprite.scale.x = 6 * (2 - s)
      sprite.scale.y = 6 * (2 - s)
    } else {
      s = 0.0
    }
    requestAnimationFrame(DrnamicChanage)
  }
  DrnamicChanage()

  const label = tag('camera')
  group.add(label)
  label.position.copy(sprite.position)
  label.scale.set(0.22,0.22,1.0)
  label.rotateY(Math.PI)
  label.position.x = label.position.x -55
})


//创建圆弧线条模型
var geometry = new THREE.BufferGeometry()
var R = 60 //半径
var arc = new THREE.ArcCurve(0, 0, R, Math.PI / 2 + Math.PI / 6, Math.PI / 2 - Math.PI / 6)
geometry.setFromPoints(arc.getPoints(50))
var material = new THREE.LineBasicMaterial({
  color: 0xffffff,
})
var line = new THREE.Line(geometry, material)
group.add(line)
line.rotateX(Math.PI / 2)
line.position.set(0, -85, 0)

//字体mesh的材质
var material = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide
})
//设置字体
var fontloader = new FontLoader()
fontloader.load('../../../../../node_modules/three/examples/fonts/helvetiker_bold.typeface.json', (font) => {
  //fontloader加载返回一个font字体对象
  console.log(font)
  //根据这个字体对象的generateShapes(text,size)来生成特定字体的shape对象
  var shapes = font.generateShapes('720°', 10)
  var geometry = new THREE.ShapeGeometry(shapes)
  var textMesh = new THREE.Mesh(geometry, material)
  textMesh.position.z = R
  textMesh.position.setY(-85)
  textMesh.position.x = -12
  group.add(textMesh)

})

export { group, mesh,sprite }