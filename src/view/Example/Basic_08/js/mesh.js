import * as THREE from 'three'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { scene } from './index'
import { FileLoader } from 'three'
import { ExtrudeMesh } from './ExtrudeMesh.js';
import { WaterShapeMesh } from './ShapeMesh.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createWall } from './Wall.js'
import { lon2xy } from './math.js';
import {getCenter} from './getCenter.js'
import {GroundGrid} from './GroundGrid.js'
import { flyGroup } from './flyGroup.js';
import {ConeGroup} from './ConeGeometry.js'
import { tag } from './tag.js';
import { createFlame } from './flame.js';
import ouputFragment from './output_fragment2.glsl.js'
// MeshBasicMaterial:不受光照影响
// MeshLambertMaterial：几何体表面和光线角度不同，明暗不同
var material = new THREE.MeshLambertMaterial({
  color: 0xffffff,
}); //材质对象
var materialShader1 = null;
material.onBeforeCompile = function(shader){
     materialShader1 = shader 
    shader.uniforms.time = {value:0.0}
    shader.vertexShader = shader.vertexShader.replace('void main() {',`
          varying vec3 vposition;
          void main() {
              vposition = position;
          `)
      shader.fragmentShader = shader.fragmentShader.replace('void main() {',`
              varying vec3 vposition;
              uniform float time;
              void main() {
          `)
      shader.fragmentShader = shader.fragmentShader.replace('	#include <output_fragment>', ouputFragment)
}
const group = new THREE.Group()
var loader = new THREE.FileLoader();
loader.setResponseType('json')
group.add(flyGroup)
loader.load('/model/example/Basic_08/上海外滩.json', function (data) {
  var buildGroup= ExtrudeMesh(data)
  group.add(buildGroup);
  //球中心点
  getCenter(buildGroup)
});
// 黄浦江
loader.load('./model/example/Basic_08/黄浦江.json', function (data) {
  var buildGroup = new THREE.Group(); //作为所有每栋楼Mesh的父对象
  data.features.forEach(build => {
    if (build.geometry) {
      // build.geometry.type === "Polygon"表示建筑物底部包含一个多边形轮廓
      //build.geometry.type === "MultiPolygon"表示建筑物底部包含多个多边形轮廓
      if (build.geometry.type === "Polygon") {
        // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
        build.geometry.coordinates = [build.geometry.coordinates];
      }
      buildGroup.add(WaterShapeMesh(build.geometry.coordinates));
    }
  });

  group.add(buildGroup);
});
var loader = new GLTFLoader(); //创建一个GLTF加载器
//设置线框模型
loader.load("/model/example/Basic_08/上海外滩.glb", function (gltf) { //gltf加载成功后返回一个对象
       // 单独设置东方明珠材质
  var dongfang = gltf.scene.getObjectByName('东方明珠');
  dongfang.position.set(13524900.5,  3664000.375,  0.1)
  var label = tag('东方明珠',13524900.5,  3664000.375,  450)
  group.add(label)
  dongfang.material = new THREE.MeshLambertMaterial({
    color: 0x1A92C6, //需要突出的模型可以更加亮一些
    // color: 0x001111,//场景大可以暗一些  要不然整个屏幕太亮
    transparent: true, //允许透明计算
    opacity: 0.7, //半透明设置
  });
  // 设置模型边线
  var edges = new THREE.EdgesGeometry(dongfang.geometry, 1);
  var edgesMaterial = new THREE.LineBasicMaterial({
    color: 0x31DEEF,
    // color: 0x006666,
  });
  var line = new THREE.LineSegments(edges, edgesMaterial);
  dongfang.add(line);
  dongfang.rotateX(Math.PI/2)
  group.add(dongfang)
})
var ground = GroundGrid
GroundGrid.position.set( 13524750.5, 3664234.375,0.1)
group.add(ground)

var pointsArr = [
  13527648, 3666923.5,
  13527648,3661545.25,
  13521853,3661545.25,
  13521853,3666923.5,
  13527648, 3666923.5,
]
group.add(createWall(pointsArr))

//添加愣住
group.add(ConeGroup)

//创建火焰
var flame = createFlame()
flame.position.set( 13524800, 3664234.375,200)
flame.rotateX(Math.PI/2)
group.add(flame)

export { group}