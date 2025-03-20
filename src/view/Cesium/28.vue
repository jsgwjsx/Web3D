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
        // baseLayer: new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
        //     url: ' http://webrd01.is.autonavi.com/appmaptile?&scale=1&lang=zh_cn&style=8&x={x}&y={y}&z={z}',
        //     minimumLevel: 1,
        //     maximumLevel: 18
        // })
        // )
    })
    viewer.scene.debugShowFramesPerSecond = true //显示fps
    //这部分就要改源码了
    //1.先介绍如何给entity设置自定义材质
    //先定义一个类，然后添加material在内存中的类型 Cesium.Material._materialCache.addMaterial(options.type,newOptions)
    //getType与getValue必须设置，否则会报错
    class customMaterial {
        constructor(options = {}) {
            this.type = options.type
            const newOptions = {
                fabric: {
                    type: options.type || 'customMaterial',//自定义的材质名称
                    uniforms: {
                        u_img: "../../../public/Cesium/a.jpg",
                        u_time: 0.0
                    },
                    source: `
                        uniform sampler2D u_img;
                        uniform float u_time;
                        czm_material czm_getMaterial(czm_materialInput materialInput){
                            czm_material material = czm_getDefaultMaterial(materialInput);
                            vec4 imgColor=texture(u_img,fract(vec2(materialInput.st.x+u_time,materialInput.st.y)));
                            material.diffuse =vec3(imgColor.rgb);
                            material.alpha =materialInput.st.x;
                            return material;
                        }
`
                },
                translucent: true,//半透明

            }
            Cesium.Material._materialCache.addMaterial(options.type, newOptions)
        };
        getType(params, result) {
            //初始化的时候会调用一次
            return this.type
        };
        getValue(time, result) {
            //会一致调用，可以在这里修改需要动态变换的uniforms参数，例如u_time
            result.u_time += 0.001;
            //console.log(result);
            return result;
        }
    }
    const cusmaterial = new customMaterial({
        type: 'customMaterial',
        time: 0.0,
        img: "../../../public/Cesium/a.jpg"
    });
    //给Entity设置自定义material
    var entity = viewer.entities.add({
        rectangle: {
            coordinates: Cesium.Rectangle.fromDegrees(119.7, 38, 120, 38.2),
            material: cusmaterial
        },
    })
    viewer.zoomTo(entity)

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
                            uniform sampler2D u_img;
                            uniform float u_time;
                            czm_material czm_getMaterial(czm_materialInput materialInput)
                            {
                                czm_material material = czm_getDefaultMaterial(materialInput);
                                vec4 imgColor=texture(u_img,fract(vec2(materialInput.st.x+u_time,materialInput.st.y)));
                                material.diffuse =vec3(imgColor.rgb);
                                material.alpha =materialInput.st.x;
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