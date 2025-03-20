<template>
    <div width="100%" height="100%" class="container">
        <canvas id='webDIV' ></canvas>
    </div>
</template>
<script setup>
import initShaders from '../../lib/webgl/initShader.js'
import { importShader, readPixelReturnInt, initTexture } from '../../lib/webgl/ice-utils.js'
import { vec2, mat4 } from '../../lib/webgl/esm/index.js'
import { onMounted } from 'vue';
import fragmentShader from './shader/clamp.frag.glsl'
import vertexShader from './shader/vertex.vert.glsl'
import { min } from '../../lib/webgl/esm/vec3.js';
var webDIV;
var gl;
var resolution = [];
var texture0;
var index;
var mousePosition = [0, 0];
var startTime = 0;
var width;
var height;
onMounted(()=>{
    init()
})

function init() {
    startTime = new Date().getTime();
    initWebgl()
    initEvent()
    initShader()

}
function initEvent() {
    webDIV.addEventListener('mousemove', mouseMove, true)
}
function mouseMove(e) {
    let mx = e.offsetX
    let my = -e.offsetY+height
    mousePosition = [mx, my];
}
function initWebgl() {
    webDIV = document.getElementById('webDIV')
    let container = document.getElementsByClassName('container')[0]
    //获取dom元素的宽高

    var box = container.getBoundingClientRect()
    //声明canvas画布的尺寸(单位:px)
    width = box.width;  //宽度
    height = box.height;  //高度
    webDIV.width = width
    webDIV.height = height
    gl = webDIV.getContext('webgl')
}
async function initShader() {
    var Vertex = vertexShader
    var Fragment = fragmentShader

    await initShaders(gl, Vertex, Fragment)
    initBuffer()
    render()
}
function initBuffer() {
    //positions+uvs
    let verticesTexCoords = new Float32Array([
        -1, 1, 0,
        1, 1, 0,
        -1, -1, 0,
        1, -1, 0,
    ]);
    // let verticesTexCoords = new Float32Array([
    //     -0.1,0.1,0,0,1,
    //     0.1,0.1,0,1,1,
    //     -0.1,-0.1,0,0,0,
    //     0.1,-0.1,0,1,0,
    // ]);
    index = [
        0.0, 2.0, 1.0,
        1.0, 2.0, 3.0
    ]
    let FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    //positions
    let vertexTexCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 3, 0);
    gl.enableVertexAttribArray(a_Position)


    //width与height
    let u_Resolution = gl.getUniformLocation(gl.program, 'u_resolution');
    resolution[0] = parseFloat(width)
    resolution[1] = parseFloat(height)
    gl.uniform2fv(u_Resolution, resolution)
    //index
    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);

}
function render() {
    window.requestAnimationFrame(() => {
        draw()
        window.requestAnimationFrame(render)
    })
}
function draw() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    let time = (new Date().getTime() - startTime) * 0.001;
    let u_time = gl.getUniformLocation(gl.program, 'u_time');
    let u_Mouse = gl.getUniformLocation(gl.program, 'u_mouse');
    gl.uniform1f(u_time, time)
    gl.uniform2fv(u_Mouse, mousePosition);

    gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0)


}


</script>
<style>
* {
    margin: 0px;
    padding: 0px;
}

html,
body {
    width: 100%;
    height: 100%;
}

.container {
    width: 100%;
    height: 100%;
}

#webDIV {
    width: 100%;
    height: 100%;
    position: absolute;
}
.el-main{
    padding: 0px;
}
</style>