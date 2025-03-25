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
    const scene = viewer.scene;
    const position = Cesium.Cartesian3.fromDegrees(
        -123.0744619,
        44.0503706
    );
    // const url = "../../../public/Cesium/fly.glb";
    // const entity = viewer.entities.add({
    //     name: url,
    //     position: position,
    //     model: {
    //         uri: url,
    //     },
    // });

    // 添加entity-ellipsoid测试
    const outlineOnly = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(
            -123.0743631,
            44.0503706,
            1.0
        ),
        ellipsoid: {
            radii: new Cesium.Cartesian3(1.0, 1.0, 2.0),
            material: "../../../public/Cesium/fire.png",
        },
    });

    //添加 Primitives 测试
    scene.primitives.add(
        new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: Cesium.BoxGeometry.fromDimensions({
                    vertexFormat:
                        Cesium.PerInstanceColorAppearance
                            .VERTEX_FORMAT,
                    dimensions: new Cesium.Cartesian3(
                        1.0,
                        1.0,
                        1.0
                    ),
                }),
                modelMatrix: Cesium.Matrix4.multiplyByTranslation(
                    Cesium.Transforms.eastNorthUpToFixedFrame(
                        Cesium.Cartesian3.fromDegrees(
                            -123.0742631,
                            44.0503706,
                            1.0
                        )
                    ),
                    new Cesium.Cartesian3(0.0, 0.0, 1),
                    new Cesium.Matrix4()
                ),
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                        Cesium.Color.GREEN.withAlpha(0.5)
                    ),
                },
            }),
            appearance: new Cesium.PerInstanceColorAppearance({
                closed: true,
            }),
        })
    );

    viewer.zoomTo(viewer.entities);

    const fragmentShaderSource = `
uniform sampler2D colorTexture;
uniform vec3 defaultColor;

in vec2 v_textureCoordinates;
void main() {
    vec4 texel = texture(colorTexture, v_textureCoordinates);

    if(!czm_selected()) {
        out_FragColor = texel;
    }else{
        out_FragColor = vec4(defaultColor,1.0);
    }

}
`;

    const stage = viewer.scene.postProcessStages.add(
        new Cesium.PostProcessStage({
            fragmentShader: fragmentShaderSource,
            uniforms: {
                defaultColor: function () {
                    return new Cesium.Color(1.0, 0.0, 1.0);
                }
            },
        })
    );
    stage.selected = [];
    const handler = new Cesium.ScreenSpaceEventHandler(
        viewer.scene.canvas
    );

    handler.setInputAction(function (movement) {
        const pickedObject = viewer.scene.pick(
            movement.endPosition
        );
        console.log(Cesium.defined(pickedObject))
        if (Cesium.defined(pickedObject)) {
            // 关键代码
            pickedObject.primitive.pickIds =
                pickedObject.primitive._pickIds;
            stage.selected = [pickedObject.primitive];
        } else {
            stage.selected = [];
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


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