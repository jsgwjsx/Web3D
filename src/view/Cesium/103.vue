<template>
    <div>
        <div id="map"></div>
    </div>
</template>
<script setup>
import * as Cesium from "cesium";
import { onMounted } from 'vue'




function createMaterialAppearance() {
    const customMaterial = new Cesium.Material({
        translucent: false,
        fabric: {
            type: 'CustomBoxShader',
            uniforms: {
                iTime: 0.0,
                iResolution: new Cesium.Cartesian2(1024, 1024),
            },
            source: `
            uniform float iTime;
            uniform vec2 iResolution;

            void mainImage( out vec4 o, vec2 u )
            {
                vec2 v = iResolution.xy;
                    u = .2*(u+u-v)/v.y;    
                    
                vec4 z = o = vec4(1,2,3,0);
                
                for (float a = .5, t = iTime, i; ++i < 19.; 
                    o += (1. + cos(z+t))  / length((1.+i*dot(v,v)) * sin(1.5*u/(.5-dot(u,u)) - 9.*u.yx + t))
                    )  
                    v = cos(++t - 7.*u*pow(a += .03, i)) - 5.*u, 
                    u += tanh(40. * dot(u *= mat2(cos(i + .02*t - vec4(0,11,33,0))), u)
                    * cos(1e2*u.yx + t)) / 2e2 + .2 * a * u + cos(4./exp(dot(o,o)/1e2) + t) / 3e2;

                o = 25.6 / (min(o, 13.) + 164. / o) - dot(u, u) / 250.;
            }


            czm_material czm_getMaterial(czm_materialInput materialInput)
            {
            
	        czm_material m =  czm_getDefaultMaterial(materialInput);
            vec4 color = vec4(0.0,0.0,0.0,1.0);
            mainImage(color,materialInput.st*iResolution);

            m.diffuse = color.rgb;
            m.alpha = 1.0;
            return m;
            }
            `,

        }
    })
    const appearance = new Cesium.MaterialAppearance({
        material: customMaterial,
        flat: false,
        faceForward: true,
        translucent: true,
        closed: true,
        materialCacheKey: "shadertoy-material-appearance",
    });
    return appearance;
}

const boxSize = 25;
function createBoxPrimitive(destination, appearance) {
    const boxGeometry = Cesium.BoxGeometry.fromDimensions({
        dimensions: new Cesium.Cartesian3(boxSize, boxSize, boxSize),
    });

    const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(destination);

    const boxInstance = new Cesium.GeometryInstance({
        geometry: boxGeometry,
    });

    const primitive = new Cesium.Primitive({
        geometryInstances: boxInstance,
        appearance: appearance,
        asynchronous: false,
        modelMatrix: modelMatrix,
    });

    return primitive;
}
onMounted(() => {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5OTNhNzM4Zi05OGM1LTQzNzgtOWY3OC1mMjkyMDRjNGQ2NWIiLCJpZCI6MjIwMDczLCJpYXQiOjE3MjQ5ODE0OTN9.xeCfpceKEj1anyoP4fLDosWa-0gNwB1fm-IDE7-uplc'
    var viewer = new Cesium.Viewer('map', {
        //搜索控件
        geocoder: false,
        //home控件
        homeButton: false,
        //动画控件
        animation: false,
        //全屏控件
        fullscreenButton: false,
        //场景模式选择器
        sceneModePicker: false,
        //时间轴
        timeline: false,
        //导航帮助按钮
        navigationHelpButton: false,
        //底图选择器
        baseLayerPicker: false,
        //1. 通过baseLayer在viewer内部中添加地图
        baseLayer: new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
            url: ' http://webrd01.is.autonavi.com/appmaptile?&scale=1&lang=zh_cn&style=8&x={x}&y={y}&z={z}',
            minimumLevel: 1,
            maximumLevel: 18
        })
        ),
        shouldAnimate: true,
        // scene3DOnly: true,
        contextOptions: {
            requestWebgl2: true
        },
        imageryProvider: false,//不加载默认底图
        terrainProvider: new Cesium.EllipsoidTerrainProvider() // 使用简单的椭球体地形
    })
    let scene = viewer.scene
    viewer.scene.logarithmicDepthBuffer = true;
    viewer.scene.debugShowFramesPerSecond = true //显示fps
    viewer.clock.currentTime.secondsOfDay = 65398;
    scene.globe.enableLighting = true;
    scene.fog.enabled = true;

    const destination = {
        x: -2280236.925141378,
        y: 5006991.049189922,
        z: 3215839.258024074,
    };

    const appearance = createMaterialAppearance();
    const primitive = createBoxPrimitive(destination, appearance);

    viewer.scene.primitives.add(primitive);



    let lastTime = Date.now();
    scene.preRender.addEventListener(() => {
        const now = Date.now();
        appearance.material.uniforms.iTime += (now - lastTime) / 1000;
        lastTime = now;
    });

    viewer.camera.lookAt(
        destination,
        new Cesium.HeadingPitchRange(6.283185307179577, -0.4706003213405664, 100),
    );

})
</script>
<style scoped>
#map {
    width: 100%;
    height: 100%;
}

* {
    margin: 0;
    padding: 0;
}

html,
body {
    width: 100%;
    height: 100%;
}
</style>