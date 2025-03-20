// 引入three.js
import * as THREE from 'three';
import config from './config'
// R：地球半径
function createSphereMesh(R) {
  // TextureLoader创建一个纹理加载器对象，可以加载图片作为纹理贴图

  var geometry = new THREE.SphereGeometry(R, 40, 40); //创建一个球体几何对象
  //材质对象Material
  var material = new THREE.MeshBasicMaterial({
     color: 0x224444,
  });
  var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
  return mesh
}

// 创建地球mesh
var R = config.R;//地球半径
var earth = createSphereMesh(R);

function lon2xyz(R,longitude,latitude){
  var lon = longitude*Math.PI/180
  var lat = latitude*Math.PI/180
  lon = -lon

  var x = R *Math.cos(lat)*Math.cos(lon)
  var y = R*Math.sin(lat)
  var z = R * Math.cos(lat)*Math.sin(lon)

  return {
    x:x,
    y:y,
    z:z
  }
}

export { earth ,lon2xyz}