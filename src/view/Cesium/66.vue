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
    function PolylineTrailLinkMaterialProperty(options) {
        options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);

        this._definitionChanged = new Cesium.Event();
        this._color = undefined;
        this._image = undefined;
        this._duration = (new Date()).getTime();
        this._colorSubscription = undefined;

        this.image = options.imgurl;
        this.color = options.color;
        this.duration = options.duration || 3000;

        this.isTranslucent = function () {
            return true;
        }
    }
    // //1.69版本使用这个
    // //Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
    Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
        isConstant: {
            get: function () {
                return false;
            }
        },
        definitionChanged: {
            get: function () {
                return this._definitionChanged;
            }
        },
        color: Cesium.createPropertyDescriptor('color'),
        image: Cesium.createPropertyDescriptor("image"),
        duration: Cesium.createPropertyDescriptor("duration")
    });
    PolylineTrailLinkMaterialProperty.prototype.getType = function (time) {
        return 'PolylineTrailLink';
    }
    PolylineTrailLinkMaterialProperty.prototype.getValue = function (time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }
        result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
        result.image = Cesium.Property.getValueOrUndefined(this._image, time);
        result.time = (((new Date()).getTime() - this._duration) % this.duration) / this.duration;
        return result;
    }
    PolylineTrailLinkMaterialProperty.prototype.equals = function (other) {
        return this === other ||
            (other instanceof PolylineTrailLinkMaterialProperty &&
                Cesium.Property.equals(this._color, other._color) &&
                Cesium.Property.equals(this._duration, other._duration) &&
                Cesium.Property.equals(this._image, other._image))
    }
    //Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;
    Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';
    Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkType, {
        fabric: {
            type: Cesium.Material.PolylineTrailLinkType,
            uniforms: {
                color: new Cesium.Color(0.0, 0.0, 1.0, 0.5),
                image: Cesium.Material.DefaultImageId,
                time: 1
            },
            source: `czm_material czm_getMaterial(czm_materialInput materialInput)
                {
                    czm_material material = czm_getDefaultMaterial(materialInput);
                    vec2 st = materialInput.st;
                    vec4 colorImage = texture(image, vec2(fract( st.s*14.0-time ), fract(st.t*4.0)));
                    material.alpha = colorImage.a * color.a;
                    material.diffuse = (colorImage.rgb+color.rgb)/2.0;
                    return material;
                }`
        },
        translucent: function (material) {
            return true;
        }
    });
    const texturedPolygonWithHoles = viewer.entities.add({
        polygon: {
            hierarchy: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                    10, 0.0, 50000,
                    20, 0.0, 30000,
                    20, 10, 35000,
                    18, 10.0, 30000,
                    18, 2.0, 50000,
                    10, 2.0, 50000,
                ]),
            },
            textureCoordinates: {
                positions: [

                    new Cesium.Cartesian2(0, 0),
                    new Cesium.Cartesian2(0.5, 0),
                    new Cesium.Cartesian2(1, 0),
                    new Cesium.Cartesian2(1, 1),
                    new Cesium.Cartesian2(0.5, 1),
                    new Cesium.Cartesian2(0, 1),
                ],
            },
            perPositionHeight: true,
            material: new PolylineTrailLinkMaterialProperty({
                color: Cesium.Color.ORANGE.withAlpha(0.8),
                duration: 300,
                imgurl: "../../../public/Cesium/arrow2.jpg"
            })
        },
    });

    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(15, 6, 2000000),
        orientation: {
            heading: Cesium.Math.toRadians(-30),
            pitch: Cesium.Math.toRadians(-100),
            roll: Cesium.Math.toRadians(0),
        }
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