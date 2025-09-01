<template>
    <div width="100%" height="100%" class="container">
        <div id="ggk">谢谢惠顾</div>
        <canvas id="canvas" width="1280" height="720"></canvas>
    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
var resizeBoud
onUnmounted(() => {
    window.removeEventListener('resize', resizeBoud)
})
onMounted(() => {
    //获取canvas对象
    var cl = document.getElementById('canvas')
    //2.获取上下文对象
    //判断是否有getContext
    if (!cl.getContext) {
        //浏览器不支持canvas，刺死canvas会识别成正常的div
        console.log('浏览器不支持canvas')
    }
    var ctx = cl.getContext('2d')
    var boud = cl.getBoundingClientRect()
    resizeBoud =() => {
        boud = cl.getBoundingClientRect()
    }
    window.addEventListener('resize', resizeBoud)
    let img = new Image()
    img.src = "/static/13.jpg"
    img.onload = function () {
        ctx.drawImage(img, 0, 0, cl.width, cl.height)
    }
    var isDraw = false;
    cl.onmousedown = function (e) {
        isDraw = true
    }
    cl.onmouseup = function () {
        isDraw = false
    }
    cl.onmousemove = function (e) {
        if (isDraw) {
            let x = e.x - boud.left
            let y = e.y - boud.top
            ctx.beginPath()
            ctx.globalCompositeOperation = 'destination-out'
            ctx.arc(x, y, 20, 0, 2 * Math.PI);
            ctx.fill()
            ctx.closePath()
        }
    }
    let random = Math.random();
    if (random < 0.1) {
        var ggkDiv = document.querySelector("#ggk")
        ggkDiv.innerHTML = '中奖'
    }
})

</script>
<style>
* {
    margin: 0;
    padding: 0;
}

.container {
    width: 100%;
    height: 100%;
}

#ggk {
    width: 1280px;
    height: 720px;
    font-size: 72px;
    font-weight: 900;
    text-align: center;
    line-height: 720px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

#canvas {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    border: 1px solid black;
}
</style>