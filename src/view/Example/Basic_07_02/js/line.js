// 引入three.js
import * as THREE from 'three';
// 引入lon2xyz,经纬度转球面坐标
import { lon2xyz } from './earth.js'
// R:球面半径
function countryLine(R) {
  var loader = new THREE.FileLoader();//three.js文件加载类FileLoader：封装了XMLHttpRequest
  loader.setResponseType('json');
  var group = new THREE.Group();// 组对象mapGroup是所有国家边界父对象
  // 异步加载包含世界各个国家边界坐标的GeoJSON文件：world.json
  loader.load('/model/example/Basic_07/world.json', function (data) {
    var allPointArr = []
    // 访问所有国家边界坐标数据：data.features
    data.features.forEach(function (country) {
      if (country.geometry.type === "Polygon") {
        country.geometry.coordinates = [country.geometry.coordinates];
      }
      country.geometry.coordinates.forEach(polygon => { 
        var pointArr = [];
        polygon[0].forEach(elem => {
          var coord = lon2xyz(R, elem[0], elem[1])
          pointArr.push(coord.x, coord.y, coord.z);
        });
        //将多条线模型合并成为一个并加载出来
        //本质就是通过复用多个顶点与LineSegments来配合使用
        //以此来减少模型对象数量，提高性能
        //缺点:会多使用相较于原来一倍的顶点
        allPointArr.push(pointArr[0],pointArr[1],pointArr[2])
        for(var i = 3;i<pointArr.length;i+=3){
          allPointArr.push(pointArr[i],pointArr[i+1],pointArr[i+2],pointArr[i],pointArr[i+1],pointArr[i+2])
        }
        allPointArr.push(pointArr[0],pointArr[1],pointArr[2])
      });
    });
    var LineSegments = line(allPointArr)
    group.add(LineSegments); 
  })
  return group;
}


// pointArr：行政区一个多边形轮廓边界坐标(2个元素为一组，分别表示一个顶点x、y值)
function line(pointArr) {
  /**
   * 通过BufferGeometry构建一个几何体，传入顶点数据
   * 通过Line模型渲染几何体，连点成线
   * LineLoop和Line功能一样，区别在于首尾顶点相连，轮廓闭合
   */
  var geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象
  //类型数组创建顶点数据
  var vertices = new Float32Array(pointArr);
  // 创建属性缓冲区对象
  var attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组，表示一个顶点的xyz坐标
  // 设置几何体attributes属性的位置属性
  geometry.attributes.position = attribue;
  // 线条渲染几何体顶点数据
  var material = new THREE.LineBasicMaterial({
    color: 0x00aaaa //线条颜色
  });//材质对象
  // var line = new THREE.Line(geometry, material);//线条模型对象
  var line = new THREE.LineSegments(geometry, material);//首尾顶点连线，轮廓闭合
  return line;
}



export { countryLine };