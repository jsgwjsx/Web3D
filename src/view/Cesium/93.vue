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
    // Define resolution of noise grid  ---  定义噪声网格，可以理解成动态纹理的分辨率
    const gridWidth = 128;
    const gridHeight = 128;

    // Define the color gradient for noise values  ---  噪声值的边界及对应的颜色，noiseStops的长度必须跟noiseColors一致，否则会出错
    const noiseStops = [65.0, 70.0, 75.0, 80.0, 85.0, 95.0];
    const noiseColors = [
        new Cesium.Color(0.0, 0.0, 1.0, 0.0),
        new Cesium.Color(1.0, 0.0, 1.0, 0.3),
        new Cesium.Color(0.0, 1.0, 1.0, 0.5),
        new Cesium.Color(0.0, 1.0, 0.0, 0.6),
        new Cesium.Color(1.0, 1.0, 0.0, 0.8),
        new Cesium.Color(1.0, 0.0, 0.0, 1.0),
    ];

    // Allocate the noise values
    const noiseValues = new Float32Array(gridWidth * gridHeight);

    // Create a rectangle geometry where the noise values will be rendered  创建形状(常规)
    const geometry = new Cesium.RectangleGeometry({
        rectangle: Cesium.Rectangle.fromDegrees(
            -80.0,
            39.0,
            -75.0,
            43.0
        ),
        vertexFormat:
            Cesium.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
    });
    // Create a material with a custom shader that will render the noise texture   创建材质(常规)
    const material = new Cesium.Material({
        fabric: {
            uniforms: {
                texture1: Cesium.Material.DefaultImageId,
            },
            source:
                "czm_material czm_getMaterial(czm_materialInput materialInput) {" +
                "    czm_material material = czm_getDefaultMaterial(materialInput);" +
                "    vec4 color = czm_gammaCorrect(texture(texture1, materialInput.st));" +
                "    material.diffuse = color.rgb;" +
                "    material.alpha = color.a;" +
                "    return material;" +
                "}",
        },
    });
    // Create the appearance for the primitive  创建外观(常规)
    const appearance = new Cesium.MaterialAppearance({
        material: material,
        flat: true,
        translucent: true,
        closed: false,
    });

    // Create the ground primitive and add it to the scene 3 创建图元(常规)
    const primitive = new Cesium.GroundPrimitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: geometry,
        }),
        appearance: appearance,
        allowPicking: true,
        classificationType: Cesium.ClassificationType.TERRAIN,
    });

    viewer.scene.primitives.add(primitive);

    viewer.scene.camera.setView({
        destination: new Cesium.Cartesian3(
            1063347.0206470848,
            -5084257.977217666,
            4094072.0828084024
        ),
        orientation: new Cesium.HeadingPitchRoll(
            0.17020003043918752,
            -0.7544830588203433,
            6.283176302414288
        ),
        endTransform: Cesium.Matrix4.IDENTITY,
    });

    // Update noise values every second   每一秒刷新一次纹理值
    var noiseValuesDirty = true;
    window.setInterval(function () {
        updateNoiseValues(
            gridWidth,
            gridHeight,
            noiseStops,
            noiseValues
        );
        noiseValuesDirty = true;
    }, 1000);

    // 噪声值发生变化时，会重绘
    // Add event listener to CesiumJS's render loop to update the noise texture when the noise values are dirty
    // Note that setting the material's texture manually like this is not part of the public API
    viewer.scene.postRender.addEventListener(function (scene) {
        if (noiseValuesDirty) {
            material.uniforms.texture1 = updateTexture(
                scene.context,
                gridWidth,
                gridHeight,
                noiseValues,
                noiseStops,
                noiseColors
            );
            noiseValuesDirty = false;
        }
    });

    // 以网格中心为基点创建噪声值
    // Create some fake noise values that emanate from the center of the grid
    function updateNoiseValues(
        gridWidth,
        gridHeight,
        noiseStops,
        noiseValues
    ) {
        var halfWidth = gridWidth / 2;
        var halfHeight = gridHeight / 2;
        var radius = Math.sqrt(
            halfWidth * halfWidth + halfHeight * halfHeight
        );
        var halfRadius = radius * 0.5;

        var valuesLength = gridWidth * gridHeight;
        for (var x = 0; x < gridWidth; ++x) {
            for (var y = 0; y < gridHeight; ++y) {
                var i = y * gridWidth + x;
                var xoffset = x - halfWidth;
                var yoffset = y - halfHeight;
                var noise = Math.sqrt(
                    xoffset * xoffset + yoffset * yoffset
                );
                noise = noise + Math.random() * radius * 0.03;
                noise =
                    1.0 -
                    Cesium.Math.clamp(noise / halfRadius, 0.0, 1.0);
                noise = Cesium.Math.lerp(
                    noiseStops[0],
                    noiseStops[noiseStops.length - 1],
                    noise
                );
                noiseValues[i] = noise;
            }
        }
    }

    var scratchColor = new Cesium.Color();

    var texture;
    var textureData;

    // Update an RGBA texture based on the noise values
    function updateTexture(
        context,
        gridWidth,
        gridHeight,
        noiseValues,
        noiseStops,
        noiseColors
    ) {
        if (!Cesium.defined(textureData)) {
            textureData = new Uint8Array(
                gridWidth * gridHeight * 4
            );
        }

        // 构建纹理
        // This loop is pretty slow and can be optimized. A better approach might be to
        // map noise values to colors in the shader. Would need to upload noise values directly
        // as a float texture and also pass in the gradient stops/colors as a uniform array.
        var valuesLength = gridWidth * gridHeight;
        for (var i = 0; i < valuesLength; ++i) {
            var noise = noiseValues[i];
            var noiseStopsLength = noiseStops.length;
            noise = Cesium.Math.clamp(
                noise,
                noiseStops[0],
                noiseStops[noiseStopsLength - 1]
            );
            for (var j = 1; j < noiseStopsLength; ++j) {
                if (noise <= noiseStops[j]) {
                    var noiseStopLeft = noiseStops[j - 1];
                    var noiseStopRight = noiseStops[j];
                    var t =
                        (noise - noiseStopLeft) /
                        (noiseStopRight - noiseStopLeft);
                    var color = Cesium.Color.lerp(
                        noiseColors[j - 1],
                        noiseColors[j],
                        t,
                        scratchColor
                    );
                    textureData[i * 4] = Cesium.Color.floatToByte(
                        color.red
                    );
                    textureData[i * 4 + 1] =
                        Cesium.Color.floatToByte(color.green);
                    textureData[i * 4 + 2] =
                        Cesium.Color.floatToByte(color.blue);
                    textureData[i * 4 + 3] =
                        Cesium.Color.floatToByte(color.alpha);
                    break;
                }
            }
        }

        // 创建纹理
        if (!Cesium.defined(texture)) {
            texture = new Cesium.Texture({
                context: context,
                pixelFormat: Cesium.PixelFormat.RGBA,
                pixelDatatype: Cesium.PixelDatatype.UNSIGNED_BYTE,
                source: {
                    width: gridWidth,
                    height: gridHeight,
                    arrayBufferView: textureData,
                },
                sampler: new Cesium.Sampler({
                    wrapS: Cesium.TextureWrap.CLAMP_TO_EDGE,
                    wrapT: Cesium.TextureWrap.CLAMP_TO_EDGE,
                    minificationFilter:
                        Cesium.TextureMinificationFilter.LINEAR,
                    magnificationFilter:
                        Cesium.TextureMagnificationFilter.LINEAR,
                }),
                flipY: false,
            });
        } else {
            texture.copyFrom({
                source: {
                    width: gridWidth,
                    height: gridHeight,
                    arrayBufferView: textureData,
                },
            });
        }

        return texture;
    }

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