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
    //给primitive设置自定义material
    //这个就简单多了，可以直接设置，不用像Entity一样设置一个类然后再实例化对象出来自定义material对象
    //创建一个平面的Primitive,使用这个材质
    const instance = new Cesium.GeometryInstance({
        geometry: new Cesium.EllipseGeometry({
            center: Cesium.Cartesian3.fromDegrees(120.0, 37.9),
            semiMinorAxis: 5000.0,
            semiMajorAxis: 10000.0,
            rotation: Cesium.Math.PI_OVER_FOUR,
            vertexFormat: Cesium.VertexFormat.POSITION_AND_ST
        }),
        id: 'object returned when this instance is picked and to get/set per-instance attributes'
    });
    const primitive = new Cesium.Primitive({
        geometryInstances: instance,
        appearance: new Cesium.EllipsoidSurfaceAppearance({
            material: new Cesium.Material({
                fabric: {
                    type: 'cusmaterial',
                    uniforms: {
                        u_img: "../../../public/Cesium/a.jpg",
                        u_time: 0.0
                    },
                    source: `
                        bool isSame(vec3 A, vec3 B,vec3 C,vec3 P){
                            vec3 AB=B-A;
                            vec3 AP=P-A;
                            vec3 AC=C-A;

                            vec3 V1=cross(AB,AC);
                            vec3 V2=cross(AB,AP);

                            return dot(V1,V2)>=0.0;
                        }
                            uniform sampler2D u_img;
                            uniform float u_time;
                            czm_material czm_getMaterial(czm_materialInput materialInput)
                        {
                                czm_material material = czm_getDefaultMaterial(materialInput);
                                vec4 imgColor=texture(u_img,fract(vec2(materialInput.st.x+u_time,materialInput.st.y)));
                                material.diffuse =vec3(imgColor.rgb);
                                vec3 A=vec3(0.5,0.8,0.0);
                                vec3 B=vec3(0.25,0.4,0.0);
                                vec3 C=vec3(0.75,0.4,0.0);
                                vec3 P=vec3(materialInput.st,0.0);
                                if(isSame(A,B,C,P)&&isSame(B,C,A,P)&&isSame(C,A,B,P)){
                                material.alpha = 1.0;
                                }
                                else{
                                    material.alpha = 0.0;
                                }
                                return material;
                        }
                        `
                },
            })
        })
    });
    setInterval(() => {
        //material中传入的uniforms参数如果想要改动，显然没有entity那么方面了
        //需要配合setInterval直接改动属性
        primitive.appearance.material.uniforms.u_time += 0.01
    }, 100)
    viewer.scene.primitives.add(primitive);
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(120, 37.9, 15600)
    })

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