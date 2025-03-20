// 引入Three.js
import * as THREE from 'three';
// 创建地面插入场景
var GroundGrid = CreateGroundGrid(5795, 100, 0x004444, 5, 0x00aaaa)
GroundGrid.position.z = -0.1;
GroundGrid.rotateX(Math.PI/2)
// 封装一个函数，几何相关参数尽量参数化，方便快速调整尺寸改变渲染效果
// rangeSize：地面网格尺寸
// divisions:地面网格细分数
// color：网格线颜色
// R:圆点半径
// RColor：原点颜色
function CreateGroundGrid(rangeSize, divisions, color, R, RColor) {
  var group = new THREE.Group();
  var gridHelper = new THREE.GridHelper(rangeSize, divisions, color, color);
  group.add(gridHelper);
  // console.log('gridHelper',gridHelper)
  gridHelper.material.depthWrite = false;
  gridHelper.renderOrder = -2;
  // CircleGeometry圆形平面几何体
  var geometry = new THREE.CircleGeometry(R, 20, 20);
  geometry.rotateX(Math.PI / 2); //从XOY平面旋转到XOZ平面
  // 可以选择基础网格材质，基础网格材质不受光照影响，和其它场景配合，颜色更稳定，而且节约渲染资源
  var material = new THREE.MeshBasicMaterial({
    color: RColor,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  // 共享材质和几何体数据，批量创建圆点mesh
  var inter = rangeSize / divisions
  var range = rangeSize / 2
  for (let i = 0; i < divisions; i++) {
    for (let j = 0; j < divisions; j++) {
      var mesh = new THREE.Mesh(geometry, material);
      mesh.renderOrder = -1;
      mesh.translateX(-range + i * inter);
      mesh.translateZ(-range + j * inter);
      group.add(mesh)
    }
  }
  return group
}



export { GroundGrid }