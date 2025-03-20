import { pointInPolygon } from './pointInPolygon.js'//判断点是否在多边形中
import config from '../config.js'
// polygon:一个表示平面多边形轮廓的数组  菽粟元素结构[x,y](x,y表示经纬度)
function gridPoint(polygon) {
  var lonArr = [];//polygon的所有经度坐标
  var latArr = [];//polygon的所有纬度坐标
  polygon.forEach(elem => {
    lonArr.push(elem[0])
    latArr.push(elem[1])
  });
  // minMax()计算polygon所有经纬度返回的极大值、极小值
  var [lonMin, lonMax] = minMax(lonArr);
  var [latMin, latMax] = minMax(latArr);
  // 经纬度极小值和极大值构成一个矩形范围，可以包裹多边形polygon，在矩形范围内生成等间距顶点
  //  设置均匀填充点的间距
  var interval = 3; //polygon轮廓内填充顶点的经纬度间隔距离，选择一个合适的值，太小，计算量大，太大，国家球面不够光滑
  var row = Math.ceil((lonMax - lonMin) / interval);//经度方向填充多少行的顶点
  var col = Math.ceil((latMax - latMin) / interval)//纬度方向填充多少列的顶点
  var rectPointsArr = [];//polygon对应的矩形轮廓内生成均匀间隔的矩形网格数据rectPointsArr
  for (var i = 0; i < row + 1; i++) {
    for (var j = 0; j < col + 1; j++) {
      //两层for循环在矩形范围内批量生成等间距的网格顶点数据
      rectPointsArr.push([lonMin + i * interval, latMin + j * interval])
    }
  }
  // 处理矩形网格顶点数据rectPointsArr，仅仅保留多边形轮廓polygon内的顶点数据
  var polygonPointsArr = [];//polygon轮廓内的网格顶点数据
  rectPointsArr.forEach(function (coord) {//coord:点经纬度坐标
    if (pointInPolygon(coord, polygon)) {//判断点coord是否位于多边形中
      polygonPointsArr.push(coord)
    }
  })
  //polygon：多边形轮廓边界顶点数据
  // polygonPointsArr：polygon内部的等间距顶点数据
  // 多边形polygon边界坐标和polygon内等间距顶点坐标合并返回
  return [...polygon, ...polygonPointsArr];
}
function gridPoint2(worldData) {
  var interval = config.interval
  var row = Math.ceil(360/interval)
  var col = Math.ceil(180/interval)
  var rectPointsArr=[]

  for(var i = 0;i<row-1;i++){
    for(var j=0;j<col-1;j++){
      rectPointsArr.push([-180+i*interval,-90+j*interval])
    }
  }
  var landPointsArr = [];//处理所有网格数据，仅保留位于国家轮廓内部的数据，也就是保留和陆地重合的网格点阵数据
  // 访问所有国家边界坐标数据：worldData.features
  worldData.features.forEach(function (country) {
    // "Polygon"：国家country有一个封闭轮廓
    //"MultiPolygon"：国家country有多个封闭轮廓
    if (country.geometry.type === "Polygon") {
      // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
      country.geometry.coordinates = [country.geometry.coordinates];
    }
    // 一个国家包含多个多边形轮廓polygon(>=1)
    country.geometry.coordinates.forEach(function (polygon) {
      polygon = polygon[0];
      rectPointsArr.forEach(function (point) {
        //  pointInPolygon(point,polygon)：判断点point是否位于多边形polygon内
        if (pointInPolygon(point, polygon)) {
          landPointsArr.push(point);//保存陆地网格数据
        }
      })
    });
  });
  return landPointsArr;
}
//   经纬度坐标进行排序
function minMax(arr) {
  // 数组元素排序
  arr.sort(compareNum);
  // 通过向两侧取整，把经纬度的方位稍微扩大
  return [Math.floor(arr[0]), Math.ceil(arr[arr.length - 1])]
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


export { gridPoint,gridPoint2};