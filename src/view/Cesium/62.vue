<template>
    <div>
        <div id="map"></div>
    </div>
</template>
<script setup>
import * as Cesium from "cesium";
import { onMounted } from 'vue'
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
        )
    })
    viewer.scene.debugShowFramesPerSecond = true //显示fps
    const lightningLineInstances = [];
    lightningLineInstances.push(
        new Cesium.GeometryInstance({
            geometry: new Cesium.PolylineGeometry({
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([114, 30, 2000, 114, 30, 250000]),
                width: 200,
                vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
            }),
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE),
            }
        })
    );
    let f_shader = `
#ifdef GL_ES
precision mediump float;
#endif

//https://www.shadertoy.com/view/fsdGWf

uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 color;
float rand(float x)
{
    return fract(sin(x)*75154.32912);
}
float noise(float x)
{
    float i = floor(x);
    float a = rand(i), b = rand(i+1.);
    float f = x - i;
    return mix(a,b,f);
}

float perlin(float x)
{
    float r=0.,s=1.,w=1.;
    for (int i=0; i<6; i++) {
        s *= 2.0;
        w *= 0.5;
        r += w * noise(s*x);
    }
    return r;
}

float f(float y)
{
    float w = 0.4; // width of strike 宽度
    return w * (perlin(2. * y) - 0.5);
}

float plot(vec2 p, float d, bool thicker)
{
    if (thicker) d += 5. * abs(f(p.y + 0.001) - f(p.y));
    return smoothstep(d, 0., abs(f(p.y) - p.x));
}

vec3 render(vec2 uv,float time)
{
    float x = time + 0.1;
    float m = 0.25; // max duration of strike 最大持续时间
    float i = floor(x/m);
    float f = x/m - i;
    float k = 0.4; // frequency of strikes 频率
    float n = noise(i);
    float t = ceil(n-k); // occurrence
    float d = max(0., n-k) / (1.-k); // duration
    float o = ceil(t - f - (1. - d)); // occurrence with duration
    float gt = 0.1; // glare duration
    float go = ceil(t - f - (1. - gt)); // glare occurrence
    
    float lightning = 0.;
    float light = 0.;
    float glare = 0.;
    
    if (o == 1.) {
        vec2 uv2 = uv;
        uv2.y += i * 2.; // select type of lightning
        float p = (noise(i+10.) - 0.5) * 2.; // position of lightning
        uv2.x -= p;
        
        float strike = plot(uv2, 0.01, true);
        float glow = plot(uv2, 0.04, false);
        float glow2 = plot(uv2, 1.5, false);
        // return vec3(strike * 0.4); 

        // lightning = strike * 0.4 + glow * 0.15;
        lightning = strike * 0.4 ;
        // return vec3(lightning);  // 2. 纵向铺满

        float h = noise(i+5.); // height
        lightning *= smoothstep(h, h+0.05, uv.y + perlin(1.2*uv.x + 4.*h)*0.03);

        return vec3(lightning);
        lightning += glow2 * 0.3; // 3.闪电+部分背景白色

        light = smoothstep(5., 0., abs(uv.x - p));
        glare = go * light;
    }

    return vec3(lightning + glare);
}

czm_material czm_getMaterial(czm_materialInput materialInput) 
{ 
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;
    float time = sin(czm_frameNumber * 0.1);

    material.diffuse = render(st.ts,time);
    material.alpha = clamp(material.diffuse.x*10.0,0.0,1.0); // 4. 根据颜色设置透明度，如果不设置，背景会是黑色
    material.diffuse = mix(material.diffuse,color.rgb,material.diffuse.x);

    return material;
}
`;

    const lightningLinesPrimitive = new Cesium.Primitive({
        geometryInstances: lightningLineInstances,
        appearance: new Cesium.PolylineMaterialAppearance({
            material: new Cesium.Material({
                fabric: {
                    uniforms: {
                        color: new Cesium.Color(1.0, 0.0, 0.0),
                    },
                    source: f_shader
                }
            })
        }),
        asynchronous: true
    });
    viewer.scene.primitives.add(lightningLinesPrimitive);
    //设置初始位置
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(113, 30, 90000),
        orientation: {
            heading: Cesium.Math.toRadians(90),
            pitch: Cesium.Math.toRadians(0),
        }
    });

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