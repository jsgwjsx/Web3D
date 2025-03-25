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
    //设置初始位置
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(111.48894522023063, 32.55843610413914, 5000)
    });
    let pts = Cesium.Cartesian3.fromDegreesArray([
        111.48894522023063, 32.55843610413914, 111.48869238776277, 32.55602570974643, 111.49004745721604, 32.5548361448687, 111.49250635559537, 32.5526581917131, 111.49401017612676, 32.55129837476868, 111.49557557543416, 32.549965127681524, 111.49805874806115, 32.550219820173126, 111.49881935514881, 32.550823388219456, 111.49893286824275, 32.55195597852755, 111.4983164393889, 32.5535655841798, 111.49817521853979, 32.554570336381104, 111.49914284747027, 32.55554277243855, 111.49967950821859, 32.555814392110264, 111.50062151969038, 32.556517275179836, 111.50149914222958, 32.55731250438687, 111.50207800636986, 32.55757396515373, 111.50386396090245, 32.55781206769338, 111.50391371888884, 32.559650818164926, 111.50077307397399, 32.56013340913413, 111.49625702141412, 32.560250133340446, 111.49171532588734, 32.560183453792156, 111.48920373670329, 32.56015020231049, 111.48844043918616, 32.55981856869106, 111.48743657311691, 32.55945303779285, 111.48760383414758, 32.55863069835514, 111.48812831262538, 32.55837951411848
    ]);
    const bluePolygon = viewer.entities.add({
        name: "Blue polygon with holes",
        polygon: {
            hierarchy: {
                positions: pts,
            },
            material: Cesium.Color.BLUE.withAlpha(0.0),
            height: 0,
            outline: true,
            outlineWidth: 15,
            outlineColor: Cesium.Color.BLUE,
        },
    });
    //用primitive方式改写
    const oneTypeLineInstances = [];
    oneTypeLineInstances.push(
        new Cesium.GeometryInstance({
            geometry: new Cesium.PolygonGeometry({
                polygonHierarchy: new Cesium.PolygonHierarchy(pts),
                width: 15,
                vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
            }),
            // attributes : {
            //     color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE), 
            // }
        })
    );
    let f_shader = `
float line_kx(vec2 st,float k,float t,float line_width) {
    float y = k*st.x+t;
    return step(y,st.y) - step(y+line_width,st.y);
}
float line_kx_smooth(vec2 st,float k,float t,float line_width) {
    float y = k*st.x+t;
    return pow(smoothstep(y-line_width,y,st.y) - smoothstep(y,y+line_width,st.y),50.0);
}
czm_material czm_getMaterial(czm_materialInput materialInput) { 
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;
    st = -1.0 + 2.0 *st;
    vec4 color = vec4(0.0);//背景色
    float pct = 0.0;
    for(float i = -2.0;i<2.0;i+=0.1){
        // 抗锯齿
        // pct = line_kx_smooth(st,1.0,i,linewidth);
        // 无抗锯齿
        pct = line_kx(st,1.0,i,linewidth);
        color = mix(color,linecolor,pct);
    }
    
    material.alpha =color.a;
    material.diffuse = color.rgb;
    return material;
}
`;
    const oneTypeLinesPrimitive = new Cesium.Primitive({
        geometryInstances: oneTypeLineInstances,
        appearance: new Cesium.MaterialAppearance({
            material: new Cesium.Material({
                fabric: {
                    uniforms: {
                        linewidth: 0.02,
                        linecolor: new Cesium.Color(1.0, 0.0, 0.0, 1.0)
                    },
                    source: f_shader,
                    // aboveGround:true
                }
            })
        }),
        asynchronous: true
    });
    viewer.scene.primitives.add(oneTypeLinesPrimitive);

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