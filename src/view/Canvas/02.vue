<template>
    <div width="100%" height="100%" class="container">
        <canvas id="canvas" width="1200" height="700"></canvas>
        <button id="boldBtn" type="button">粗线条</button>
        <button id="thinBtn" type="button">细线条</button>
        <button id="saveBtn" type="button">保存签名</button>
        <input type="color" name="" id="color" value="#000000">
        <button id="clearBtn" type="button">橡皮擦</button>
        <button id="nullBtn" type="button">清空画布</button>
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
    var boud = cl.getBoundingClientRect()
    resizeBoud = () => {
        boud = cl.getBoundingClientRect()
    }
    window.addEventListener('resize',resizeBoud)
    if (!cl.getContext) {
        //浏览器不支持canvas，刺死canvas会识别成正常的div
        console.log('浏览器不支持canvas')
    }
    var ctx = cl.getContext('2d');//ctx画笔对象
    //连接，开头与结束都是圆润的,并且设置lineWidth为5
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.lineWidth = 5
    //2.获取输入框与按钮
    //设置画笔粗细
    var boldBtn = document.querySelector('#boldBtn')
    boldBtn.onclick = function () {
        ctx.globalCompositeOperation = 'source-over'
        ctx.lineWidth = 10
    }
    var thinBtn = document.querySelector('#thinBtn')
    thinBtn.onclick = function () {
        ctx.globalCompositeOperation = 'source-over'
        ctx.lineWidth = 5
    }
    //设置颜色
    var inputColor = document.querySelector('#color')
    inputColor.onchange = function (e) {
        ctx.strokeStyle = e.target.value
    }
    //保存签名
    var saveBtn = document.querySelector('#saveBtn')
    saveBtn.onclick = function () {
        var urlData = cl.toDataURL()
        // var img = new Image()
        // img.src = urlData
        // document.body.appendChild(img)
        var download = document.createElement('a')
        download.setAttribute('download', '签名')
        download.href = urlData;
        download.click()
    }
    //橡皮擦
    var clearBtn = document.querySelector('#clearBtn')
    clearBtn.onclick = function () {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.lineWidth = 30;
    }
    //清空画布
    var nullBtn = document.querySelector('#nullBtn')
    nullBtn.onclick = function (e) {
        ctx.clearRect(0, 0, cl.width, cl.height)
    }
    //设置绘图开关
    var isDraw = false
    cl.onmousedown = function (e) {
        isDraw = true
        ctx.beginPath()
        var x = e.x - boud.left
        var y = e.y - boud.top;
        ctx.moveTo(x, y)
    }
    cl.onmouseleave = function () {
        isDraw = false
        ctx.closePath()
    }
    cl.onmouseup = function (e) {
        isDraw = false
        ctx.closePath()
    }
    cl.onmousemove = function (e) {
        if (isDraw) {
            var x = e.x- boud.left
            var y = e.y - boud.top;
            ctx.lineTo(x, y)
            ctx.stroke()
        }
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