// 引入three.js
import * as THREE from 'three';
import {lon2xy} from './math.js';
import  output_fragment from './output_fragment3.glsl.js'
// 水面颜色贴图
var texture = new THREE.TextureLoader().load('/model/example/Basic_08/水面.jpg');
// 水面法线贴图
var normalTexture = new THREE.TextureLoader().load('/model/example/Basic_08/normal.jpg');
// 设置阵列模式为 RepeatWrapping
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping
// 水面区域比较大的话，纹理贴图不能无限大，一般可以通过阵列解决。
texture.repeat.set(10, 10); // x和y方向阵列纹理贴图
normalTexture.wrapS = THREE.RepeatWrapping
normalTexture.wrapT = THREE.RepeatWrapping
normalTexture.repeat.set(10, 10);
// 流动动画 最简单方式就是使用texture的offset属性实现  也可以用更麻烦的shader实现
var t = 0;

function flowAnimation() {
  requestAnimationFrame(flowAnimation);
  t += 0.02;
  var y = 0.05 * t;
  texture.offset.x = y;
  texture.offset.y = y;
}
flowAnimation();
// lambert不支持法线 使用高光材质Phong
var material = new THREE.MeshLambertMaterial({
  // color: 0x0099ff,
  map: texture,
  normalMap: normalTexture,
  normalScale: new THREE.Vector2(5, 5)
}); //材质对象
var materialShader2 = null;
material.onBeforeCompile = function (shader) {
  materialShader2 = shader;
  shader.uniforms.time = {
    value: 0.0,
  };
  // 顶点位置坐标position类似uv坐标进行插值计算，用于在片元着色器中控制片元像素
  shader.vertexShader = shader.vertexShader.replace(
    'void main() {',
    ['varying vec3 vposition;',
      'void main() {',
      'vposition = position;',
    ].join('\n') // .join()把数组元素合成字符串
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    'void main() {',
    ['varying vec3 vposition;',
      'uniform float time;',
      'void main() {',
    ].join('\n')
  );

  shader.fragmentShader = shader.fragmentShader.replace('#include <output_fragment>', output_fragment);
};


// pointsArrs：多个多边形轮廓
function WaterShapeMesh(pointsArrs) {
  var shapeArr = []; //轮廓形状Shape集合
  pointsArrs.forEach(pointsArr => {
    var vector2Arr = [];
    // 转化为Vector2构成的顶点数组
    pointsArr[0].forEach(elem => {
      var xy = lon2xy(elem[0], elem[1]); //经纬度转墨卡托坐标
      vector2Arr.push(new THREE.Vector2(xy.x, xy.y));
    });
    var shape = new THREE.Shape(vector2Arr);
    shapeArr.push(shape);
  });
  var geometry = new THREE.ShapeGeometry( //填充多边形
    shapeArr,
  );
  // 把UV坐标范围控制在[0,1]范围

  var pos = geometry.attributes.position; //顶点位置坐标
  var uv = geometry.attributes.uv; //顶点UV坐标
  var count = pos.count; //顶点数量
  var xArr = []; //多边形polygon的所有x坐标
  var yArr = []; //多边形polygon的所有y坐标
  for (var i = 0; i < count; i++) {
    xArr.push(pos.getX(i));
    yArr.push(pos.getY(i));
  }
  // minMax()计算polygon所有坐标,返回的极大值、极小值
  var [xMin, xMax] = minMax(xArr);
  var [yMin, yMax] = minMax(yArr);
  var xL = xMax - xMin;
  var yL = yMax - yMin;
  // 根据多边形顶点坐标与最小值差值占最大值百分比，设置UV坐标大小 把UV坐标范围控制在[0,1]范围
  for (var i = 0; i < count; i++) {
    var uvx = (pos.getX(i) - xMin) / xL;
    var uvy = (pos.getY(i) - yMin) / yL;
    uv.setXY(i, uvx, uvy)
  }

  //   多边形坐标进行排序
  function minMax(arr) {
    // 数组元素排序
    arr.sort(compareNum);
    // 返回极小值和极大值
    return [arr[0], arr[arr.length - 1]]
  }
  // 数组排序规则
  function compareNum(num1, num2) {
    if (num1 < num2) {
      return -1;
    } else if (num1 > num2) {
      return 1;
    } else {
      return 0;
    }
  }


  var mesh = new THREE.Mesh(geometry, material); //网格模型对象

  return mesh;
}
export {
  WaterShapeMesh,
  materialShader2
};