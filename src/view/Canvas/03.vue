<template>
    <div width="100%" height="100%" class="container">
        <canvas id="canv"></canvas>
        <h1>ANIMPEN</h1>
        <div class="button">
            <span id="reload">刷新</span>
        </div>
    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
onMounted(() => {
    var c = document.getElementById("canv");
    var $ = c.getContext("2d");
    var boud = c.getBoundingClientRect()
    c.width = boud.width;
    c.height = boud.height;

    var x = 0
    var y = 0
    var bleed = 100
    function draw(x, y, r, col) {

        $.fillStyle = 'rgba(' + col.r + ', ' + col.g + ', ' + col.b + ', ' + col.a + ')';
        $.beginPath()
        $.arc(x, y, r, 0, Math.PI * 2, false)
        $.closePath()
        $.fill()
    }

    function blood(x, y, r, pcol) {
        var px = x
        var py = y
        var pr = r
        var i = 0
        var col = pcol
        function ace() {
            requestAnimationFrame(ace)
            draw(px, py, pr * (i / bleed), col)
            i == bleed ? window.cancelAnimationFrame(ace) : ''
            i++
        }
        ace()
    }

    function anim() {
        requestAnimationFrame(anim)
        var radx = Math.random() * c.width
        var rady = Math.random() * c.height
        var radr = Math.random() * 50
        var color = {
            r: Math.random() * 255.0,
            g: Math.random() * 255.0,
            b: Math.random() * 255.0,
            a: 1 / bleed,
        }
        blood(radx, rady, radr, color)
    }
    anim()


    document.querySelector('#reload').onclick = function () {
        document.location.href = document.location.href;
    }


    window.addEventListener('touchstart', function (e) {
        e.preventDefault();
        document.location.href = document.location.href;
    }, false);
    document.querySelector('#reload').onclick = function () {
        document.location.href = document.location.href;
    }
    /*___Resize___*/
    window.addEventListener('resize', function () {
        boud = c.getBoundingClientRect()
        c.width = boud.width;
        c.height = boud.height;
    }, false);

})

</script>
<style style>
body {
    width: 100%;
    overflow: hidden;
    margin: 0;
    cursor: pointer;
}

h1 {
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 3em;
    font-family: 'Kaushan Script', cursive;
    -webkit-text-stroke: 1px hsla(0, 0%, 0%, .3);
    color: transparent;
}

.button {
    left: 50%;
    position: absolute;
    top: 30%;
    transform: translate(-50%, -50%);
    font-size: 2.5em;
    font-family: 'Kaushan Script', cursive;
    -webkit-text-stroke: 1px hsla(0, 0%, 0%, .3);
    color: transparent;

    span {
        text-decoration: underline;
        margin: 0 10px;
    }
}

* {
    margin: 0;
    padding: 0;
}

.container {
    width: 100%;
    height: 100%;
}

#canv {
    width: 100%;
    height: 100%;
}
</style>