<template>
    <div>
        <div id="map"></div>
    </div>
</template>
<script setup>
import * as Cesium from "cesium";
import { onMounted } from 'vue'
const boxSize = 25;
function createMaterialAppearance() {
    // Create custom materials.
    const customMaterial = new Cesium.Material({
        translucent: false,
        fabric: {
            type: "CustomBoxShader",
            // NOTE: Uniforms in the Material fabric can only be used directly in the fabric shader source.
            // In the final shader code, the variable name will be overwritten.
            uniforms: {
                time: 0.0,
            },
            source: `
            uniform float time;
            float getUniformTimeOfMaterial(){
                return time;
            }

            czm_material czm_getMaterial(czm_materialInput materialInput) {
                czm_material material = czm_getDefaultMaterial(materialInput);
                material.diffuse = vec3(1.0,1.0,1.0);
                return material;
            }
            `,
        },
    });
    const appearance = new Cesium.MaterialAppearance({
        material: customMaterial,
        flat: false,
        faceForward: true,
        translucent: true,
        closed: true,
        vertexShaderSource: `
        in vec3 position3DHigh;
        in vec3 position3DLow;
        in vec3 normal;
        in vec2 st;
        in float batchId;

        out vec3 v_positionEC;
        out vec3 v_normalEC;
        out vec2 v_st;
        out vec3 v_position;
        uniform float frameNumber;

        mat3 rotateZ(float angle) {
            float c = cos(angle);
            float s = sin(angle);
            return mat3(
                c, -s, 0.0,   
                s,  c, 0.0,  
                0.0, 0.0, 1.0
            );
        }

        void main()
        {
            //获取世界坐标

            vec4 p = czm_computePosition();//点的世界坐标
            vec3 cameraPositionMC = czm_encodedCameraPositionMCHigh + czm_encodedCameraPositionMCLow;//表示相机与世界坐标的相对位置，注意，并不是相机在世界坐标中的位置，两者是相符数的关系
            vec3 originMC = p.xyz + cameraPositionMC;//将顶点位置转换到以相机为原点的坐标系中（便于旋转计算）

            //生成旋转矩阵并且应用
             mat3 rotation = rotateZ(frameNumber * 0.01);
             originMC = rotation * originMC;

             v_position = originMC;

             originMC = originMC - cameraPositionMC;
             p.xyz = originMC;
            
            v_positionEC = (czm_modelViewRelativeToEye * p).xyz;
            v_normalEC = czm_normal * normal;
            v_st = st;

            gl_Position = czm_modelViewProjectionRelativeToEye * p;
        }
        
    `,
        fragmentShaderSource: `
        in vec3 v_positionEC;
        in vec3 v_normalEC;
        in vec2 v_st;
        in vec3 v_position;
        
        uniform vec3 customColor; 
        uniform float boxSize;

        void main()
        {
            vec3 positionToEyeEC = -v_positionEC;
            vec3 normalEC = normalize(v_normalEC);

        #ifdef FACE_FORWARD
            normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);
        #endif

            czm_materialInput materialInput;
            materialInput.normalEC = normalEC;
            materialInput.positionToEyeEC = positionToEyeEC;
            materialInput.st = v_st;
            czm_material material = czm_getMaterial(materialInput);
            
            material.diffuse  = customColor; 

            int uniformOfMaterial = int(getUniformTimeOfMaterial() * 4.0);
            float s1 =  boxSize / 10.0; 
            float delta = abs(abs(v_position.z) - float(uniformOfMaterial % int((boxSize / 2.0 - s1) * 100.0)) / 100.0);
            if(delta < s1)
            {
                float scale = 1.0 - delta / s1;
                material.diffuse  = vec3(1.0) * scale; 
                material.alpha = scale;
            }

        #ifdef FLAT
            out_FragColor = vec4(material.diffuse + material.emission, material.alpha);
        #else
            out_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);
        #endif              
        }
        `,
        materialCacheKey: "my-box-material-appearance",
    })
    const color = new Cesium.Color(1.0, 1.0, 0.0, 1.0);
    appearance.uniforms = {
        frameNumber: 1.0, // Used in vertex shader.
        customColor: color, // Used in fragment shader.
        boxSize: boxSize, // Used in fragment shader.
    };

    return appearance;


}
function createBoxPrimitive(destination, appearance) {
    let { lon, lat, height } = destination
    const boxGeometry = Cesium.BoxGeometry.fromDimensions({
        dimensions: new Cesium.Cartesian3(boxSize, boxSize, boxSize),
    });
    const position = Cesium.Cartesian3.fromDegrees(lon, lat, height);
    const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    console.log(modelMatrix)
    // Wrap the geometry as GeometryInstance.
    const boxInstance = new Cesium.GeometryInstance({
        geometry: boxGeometry,
    });

    // Create a Primitive and add it to the scene.
    const primitive = new Cesium.Primitive({
        geometryInstances: boxInstance,
        appearance: appearance,
        asynchronous: false,
        modelMatrix: modelMatrix,
    });

    return primitive;
}
function updateAppearance(appearance) {
    const t = appearance.material.uniforms.time++;
    appearance.uniforms.frameNumber++;

    const { customColor } = appearance.uniforms;
    customColor.red = Math.sin(t * 0.01) ** 2 / 1.5;
    customColor.green = Math.sin(t * 0.01 + (2 * Math.PI) / 3) ** 2 / 1.5;
    customColor.blue = Math.sin(t * 0.01 + (4 * Math.PI) / 3) ** 2 / 1.5;
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
        imageryProvider: false,
        terrainProvider: new Cesium.EllipsoidTerrainProvider() // 使用简单的椭球体地形
    })

    viewer.scene.debugShowFramesPerSecond = true //显示fps
    viewer.clock.currentTime.secondsOfDay = 65398;
    viewer.scene.globe.enableLighting = true;
    viewer.scene.fog.enabled = true;

    const destination = {
        lon: 118.36,
        lat: 30.34,
        height: 1000,
    };


    const appearance = createMaterialAppearance();
    const primitive = createBoxPrimitive(destination, appearance);
    viewer.scene.preRender.addEventListener(() => {
        updateAppearance(appearance);
    });

    viewer.scene.primitives.add(primitive);
    viewer.camera.lookAt(
        Cesium.Cartesian3.fromDegrees(destination.lon, destination.lat, destination.height),
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