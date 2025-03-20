// 作者：冰哥
// 时间：2022.7.10


/**
 * 初始化shader
 * @param gl 
 * @param vshader 
 * @param fshader 
 * @return true
 */
function initShaders(gl, vshader, fshader) {
  var program = createProgram(gl, vshader, fshader);
  if (!program) {
    console.log('创建项目失败！');
    return false;
  }

  gl.useProgram(program);
  gl.program = program;

  return true;
}

/**
 * 创建项目
 * @param gl 
 * @param vshader 
 * @param fshader 
 * @return program
 */
function createProgram(gl, vshader, fshader) {

  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }


  var program = gl.createProgram();
  if (!program) {
    return null;
  }


  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);


  gl.linkProgram(program);


  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    var error = gl.getProgramInfoLog(program);
    console.log('Failed to link program: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
}

/**
 * 创建shader对象
 * @param gl
 * @param type 
 * @param source
 * @return shaderobj
 */
function loadShader(gl, type, source) {

  var shader = gl.createShader(type);
  if (shader == null) {
    console.log('unable to create shader');
    return null;
  }


  gl.shaderSource(shader, source);


  gl.compileShader(shader);

  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    var error = gl.getShaderInfoLog(shader);
    console.log('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/** 
 * 初始化webgl
 * @param canvas 
 * @param opt_debug
 * @return 
 */


function angleToRadian(angle) {
  return angle / 180 * Math.PI
}
function multiplyMVP(m1, m2, m3) {
  let mvpMatrix = glMatrix.mat4.create();
  let mvMatrix = glMatrix.mat4.create();
  glMatrix.mat4.multiply(mvpMatrix, m1, glMatrix.mat4.multiply(mvMatrix, m2, m3));
  return mvpMatrix;
}
/**
 * 屏幕坐标系转世界坐标系
 * @param {*} screenPosition 
 * @param {*} InverseMVPMatrix 
 * @param {*} viewWH 
 * @returns 
 */
function screenToWorld(screenPosition, InverseMVPMatrix, viewWH) {
  let worldPosition = glMatrix.vec4.create();
  screenPosition[0] = screenPosition[0] / viewWH[0];
  screenPosition[1] = (viewWH[1] - screenPosition[1]) / viewWH[1];
  screenPosition[2] = screenPosition[2];
  console.log(screenPosition.length);
  for (let i = 0; i < screenPosition.length; i++) {
    screenPosition[i] = screenPosition[i] * 2 - 1;
  }
  worldPosition = glMatrix.mat4.multiply(worldPosition, InverseMVPMatrix, screenPosition);
  worldPosition[0] /= worldPosition[3];
  worldPosition[1] /= worldPosition[3];
  worldPosition[2] /= worldPosition[3];
  worldPosition = worldPosition.slice(0, -1);
  return worldPosition;
}
/**
 * 世界坐标系转屏幕坐标系
 * @param {*} worldPosition  世界坐标
 * @param {*} MVPMatrix      MVP变换矩阵
 * @param {*} viewWH         视口宽高
 * @returns 
 */
function worldToScreen(worldPosition, MVPMatrix, viewWH) {
  let screenPosition = glMatrix.vec4.create();
  worldPosition = glMatrix.mat4.multiply(screenPosition, MVPMatrix, worldPosition);
  for (let i = 0; i < screenPosition.length; i++) {
    screenPosition[i] /= screenPosition[screenPosition.length];
    screenPosition[i] = screenPosition[i] * 0.5 + 0.5;
  }
  screenPosition[0] = screenPosition[0] * viewWH[0];
  screenPosition[1] = viewWH[1] - (screenPosition[1] * viewWH[1]);
  screenPosition = screenPosition.slice(0, -1);
  return screenPosition;
}


/**
 * 
 * @param {屏幕坐标系} screen 
 * @param {转职矩阵} inverseMVPMatrix 
 * @param {画布宽高} viewWH 
 * @returns 
 */
function getModelSelectPosition(screen, inverseMVPMatrix, viewWH) {
  var minWorld = glMatrix.vec4.create();
  var maxWorld = glMatrix.vec4.create();
  var screen1 = screen.slice(0)
  screen1[2] = screen1[2] + 1;

  minWorld = screenToWorld(screen, inverseMVPMatrix, viewWH);
  maxWorld = screenToWorld(screen1, inverseMVPMatrix, viewWH);
  var dir = glMatrix.vec3.create();
  glMatrix.vec3.subtract(dir, maxWorld, minWorld);
  glMatrix.vec3.normalize(dir, dir);
  var tm = Math.abs((minWorld[1]) / dir[1]);
  var target = new Float32Array(3);
  target[0] = minWorld[0] + tm * dir[0];
  target[1] = minWorld[1] + tm * dir[1];
  target[2] = minWorld[2] + tm * dir[2];
  return target;
}

/**
 * 
 * @param {*} 图片地址 
 * @returns 
 */
export function initTexture(gl, imageFile, name) {
  return new Promise((resolve, reject) => {
    var uniformTexture = gl.getUniformLocation(gl.program, name);
    var texture;
    texture = gl.createTexture();
    texture.image = new Image();
    texture.image.src = imageFile;
    texture.image.onload = function () {
      texture.uniformTexture = uniformTexture;
      handleLoadedTexture(gl, texture);
      resolve(texture);
      

    }
  })

}
/**
* 
* @param {*} 纹理
*/
function handleLoadedTexture(gl, texture) {
  gl.activeTexture(gl.TEXTURE0)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.uniform1i(texture.uniformTexture, 0)


}

/**
 *  创建顶点缓冲区
 * @param {*} gl 
 * @param {*} data 
 * @param {*} num 
 * @param {*} type 
 * @param {*} attribute 
 * @returns 
 */

function initArrayBuffer(gl, data, num, type, attribute) {
  let attributeobj = gl.getAttribLocation(gl.program, attribute);
  // 先创建一个缓冲区对象
  let buffer = gl.createBuffer();
  // 把数据写入到缓冲区中
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  // 将图元分配到图元装配空间中去，并存储起来
  gl.vertexAttribPointer(attributeobj, num, type, false, 0, 0);
  // 开启图元装配
  gl.enableVertexAttribArray(attributeobj);
  //赋值所需点位数与所占字节数
  buffer.itemSize = num;
  buffer.attributeobj = attributeobj;
  return buffer;
}
/**
 * 创建索引缓冲区
 * @param {*} gl 
 * @param {*} data 
 * @param {*} num 
 * @param {*} numberOfItems 
 * @returns 
 */
function initIndexArrayBuffer(gl, data, num) {
  // 先创建一个缓冲区对象
  let buffer = gl.createBuffer();
  // 把数据写入到缓冲区中
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
  //赋值所需点位数与所占字节数
  buffer.itemSize = num;
  buffer.numberOfItems = data.length;
  // 
  return buffer;
}
export async function importShader(shaderPath) {
  var result;
  await fetch(shaderPath).then(res => res.text())
    .then((res) => {
      result = res
    })
  return result
}
/**
 * 
 * @param {*} gl  webgl
 * @param {*} startPosition  开始点的坐标
 * @param {*} rectangle  长宽的范围
 * @returns 
 */
export function readPixelReturnFloat(gl, startPosition, rectangle) {
  //像素容器
  //startPosition这个参数的起始点也就是我们的左下角，rectangle表示矩形的宽高数组
  //下面的unit8Array是类型化数组，存贮8Byte的最大值，之所以是宽高乘以4是因为RGBA是四个，因此要有四个宽高
  let pixel = new Uint8Array(rectangle[0] * rectangle[1] * 4)
  //抓取像素
  gl.readPixels(
    startPosition[0], startPosition[1], rectangle[0], rectangle[1], gl.RGBA, gl.UNSIGNED_BYTE, pixel
  )
  //resarr由类型化数组转为普通数组
  let resarr = Array.from(pixel);
  //提高精度,将颜色值从0~255变成0~1范围内
  resarr = resarr.map(x => Number(Number(x / 255.0).toFixed(2)))
  return resarr;
}

/**
 * 
 * @param {*} gl  webgl
 * @param {*} startPosition  开始点的坐标
 * @param {*} rectangle  长宽的范围
 * @returns 
 */
export function readPixelReturnInt(gl, startPosition, rectangle) {
  //像素容器
  let pixel = new Uint8Array(rectangle[0] * rectangle[1] * 4);
  //抓取像素
  gl.readPixels(
    startPosition[0], startPosition[1], rectangle[0], rectangle[1], gl.RGBA, gl.UNSIGNED_BYTE, pixel
  )
  //resarr由类型化数组转为普通数组
  // let resarr = Array.from(pixel);
  // //提高精度,将颜色值从0~255变成0~1范围内
  //= resarr = resarr.map(x => Number(Number(x / 255.0).toFixed(2)))
  return pixel;
}