<template>
    <div>
        <div id="map"></div>
    </div>
</template>
<script setup>
import * as Cesium from "cesium";
import { onMounted } from 'vue'
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
//实例化一个gui对象
let gui = new GUI()
const Common = `
        uniform sampler2D heightMap;
        uniform float heightScale;
        uniform float maxElevation;
        uniform float minElevation;
        uniform sampler2D iChannel0;
        uniform float iTime;

        uniform float coast2water_fadedepth;
        uniform float large_waveheight; // change to adjust the "heavy" waves
        uniform float large_wavesize;  // factor to adjust the large wave size
        uniform float small_waveheight;  // change to adjust the small random waves
        uniform float small_wavesize;   // factor to ajust the small wave size
        uniform float water_softlight_fact;  // range [1..200] (should be << smaller than glossy-fact)
        uniform float water_glossylight_fact; // range [1..200]
        uniform float particle_amount;
        uniform float WATER_LEVEL; // Water level (range: 0.0 - 2.0)
        vec3 watercolor = vec3(0.0, 0.60, 0.66); // 'transparent' low-water color (RGB)
        vec3 watercolor2 = vec3(0.0,0.0,0.5); // deep-water color (RGB, should be darker than the low-water color)
        vec3 water_specularcolor = vec3(1.3, 1.3, 0.9);    // specular Color (RGB) of the water-highlights
        vec3 light;

        // calculate random value
        float hash(float n) {
            return fract(sin(n) * 43758.5453123);
        }

        // 2d noise function
        float noise1(in vec2 x) {
            vec2 p = floor(x);
            vec2 f = smoothstep(0.0, 1.0, fract(x));
            float n = p.x + p.y * 57.0;
            return mix(mix(hash(n + 0.0), hash(n + 1.0), f.x), mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
        }

        float noise(vec2 p) {
            return textureLod(iChannel0, p * vec2(1. / 256.), 0.0).x;
        }

        float height_map(vec2 p) {
            float f = texture(heightMap,p).r;
            return clamp(f, 0., 10.);
        }

        const mat2 m = mat2(0.72, -1.60, 1.60, 0.72);
        //水体波浪效果
        float water_map(vec2 p, float height) {
            vec2 p2 = p * large_wavesize;
            //大尺度波浪形成
            vec2 shift1 = 0.001 * vec2(iTime * 160.0 * 2.0, iTime * 120.0 * 2.0);
            vec2 shift2 = 0.001 * vec2(iTime * 190.0 * 2.0, -iTime * 130.0 * 2.0);

            //噪声混合
            float f = 0.6000 * noise(p);
            f += 0.2500 * noise(p * m);
            f += 0.1666 * noise(p * m * m);
            //波形生成
            float wave = sin(p2.x * 0.622 + p2.y * 0.622 + shift2.x * 4.269) * large_waveheight * f * height * height;
            //小尺度波纹生成
            p *= small_wavesize;
            f = 0.;
            float amp = 1.0, s = .5;
            for(int i = 0; i < 9; i++) {
                p = m * p * .947;
                f -= amp * abs(sin((noise(p + shift1 * s) - .5) * 2.));
                amp = amp * .59;
                s *= -1.329;
            }
            //结果合成
            return wave + f * small_waveheight;
        }

        float nautic(vec2 p) {
            p *= 18.;
            float f = 0.;
            float amp = 1.0, s = .5;
            for(int i = 0; i < 3; i++) {
                p = m * p * 1.2;
                f += amp * abs(smoothstep(0., 1., noise(p + iTime * s)) - .5);
                amp = amp * .5;
                s *= -1.227;
            }
            return pow(1. - f, 5.);
        }

        float particles(vec2 p) {
            p *= 200.;
            float f = 0.;
            float amp = 1.0, s = 1.5;
            for(int i = 0; i < 3; i++) {
                p = m * p * 1.2;
                f += amp * noise(p + iTime * s);
                amp = amp * .5;
                s *= -1.227;
            }
            return pow(f * .35, 7.) * particle_amount;
        }

        float test_shadow(vec2 xy, float height) {
            vec3 r0 = vec3(xy, height);
            vec3 rd = normalize(light - r0);

            float hit = 1.0;
            float t = 0.001;
            for(int j = 1; j < 25; j++) {
                vec3 p = r0 + t * rd;
                float h = height_map(p.xy);
                float height_diff = p.z - h;
                if(height_diff < 0.0) {
                    return 0.0;
                }
                t += 0.01 + height_diff * .02;
                hit = min(hit, 2. * height_diff / t); // soft shaddow   
            }
            return hit;
        }
`;

class Erosion extends Cesium.Primitive {
    constructor(options) {
        super();
        this.viewer = options.viewer;//viewer视图
        this.extent = options.extent;//范围
        this.maxElevation = options.maxElevation;//最大高程
        this.minElevation = options.minElevation;//最小高程
        this.heightMap = options.canvas;//地形图canvas对象
        this.noise = options.noise;//噪音图canvas对象
        //设置水面效果参数
        this.coast2water_fadedepth = 0.1;
        this.large_waveheight = 0.5; // change to adjust the "heavy" waves
        this.large_wavesize = 4; // factor to adjust the large wave size
        this.small_waveheight = 0.9; // change to adjust the small random waves
        this.small_wavesize = 0.12; // factor to ajust the small wave size
        this.water_softlight_fact = 36; // range [1..200] (should be << smaller than glossy-fact)
        this.water_glossylight_fact = 120; // range [1..200]
        this.particle_amount = 70;
        this.WATER_LEVEL = 0.34;
        this._showLines = false;
        this.resolution = Cesium.defaultValue(
            options.resolution,
            new Cesium.Cartesian2(1024, 1024)
        );
    }
    //自定义的函数
    createCommand(context) {
        const rectangle = new Cesium.RectangleGeometry({
            ellipsoid: Cesium.Ellipsoid.WGS84,
            rectangle: Cesium.Rectangle.fromDegrees(...this.extent),
            vertexFormat: Cesium.VertexFormat.POSITION_AND_ST,
            granularity: Cesium.Math.toRadians(0.0001), // 调整这个参数以增加顶点密度
            height: this.minElevation,
        });
        const geometry = Cesium.RectangleGeometry.createGeometry(rectangle);
        const attributeLocations =
            Cesium.GeometryPipeline.createAttributeLocations(geometry);

        const va = Cesium.VertexArray.fromGeometry({
            context: context,
            geometry: geometry,
            attributeLocations: attributeLocations,
        });
        const vs = `
        in vec4 position;
        in vec2 st;
        out vec2 v_st;

        const float PI = 3.141592653589793;
        const float earthRadius = 6378137.0; // WGS84 椭球体的平均半径
        const float angularVelocity = 180.0 / PI;

        const float RADII_X = 6378137.0;
        const float RADII_Y = 6378137.0;
        const float RADII_Z = 6356752.314245;

        vec3 worldToGeographic(vec3 worldPosition) {
            // 步骤1: 世界坐标到ECEF坐标
            vec3 ecef = worldPosition;  // 假设世界坐标已经是ECEF

            // 步骤2: ECEF到地理坐标
            float l = length(ecef.xy);
            float e2 = 1.0 - (RADII_Z * RADII_Z) / (RADII_X * RADII_X);
            float u = atan(ecef.z * RADII_X / (l * RADII_Z));
            float lat = atan((ecef.z + e2 * RADII_Z * pow(sin(u), 3.0)) / 
                            (l - e2 * RADII_X * pow(cos(u), 3.0)));
            float lon = atan(ecef.y, ecef.x);
            float N = RADII_X / sqrt(1.0 - e2 * sin(lat) * sin(lat));
            float alt = l / cos(lat) - N;

            // 将弧度转换为度
            lat = degrees(lat);
            lon = degrees(lon);

            return vec3(lon, lat, alt);
        }

        vec3 geo2cartesian(vec3 geo){
            float cosLat=cos(geo.y);
            float snX=cosLat*cos(geo.x);
            float snY=cosLat*sin(geo.x);
            float snZ=sin(geo.y);
            vec3 sn=normalize(vec3(snX,snY,snZ));
            vec3 radiiSquared=vec3(40680631.59076899*1000000.,40680631.59076899*1000000.,40408299.98466144*1000000.);
            vec3 sk=radiiSquared*sn;
            float gamma=sqrt(dot(sn,sk));
            sk=sk/gamma;
            sn=sn*geo.z;
            return sk+sn;
        }

        vec3 deg2cartesian(vec3 deg) {
            vec2 radGeo=radians(deg.xy);
            vec3 geo=vec3(radGeo.xy,deg.z);
            return geo2cartesian(geo);
        }

        void main() {
            float normalizedHeight = 0.0;

            vec2 uv = st;
            float deepwater_fadedepth = 0.5 + coast2water_fadedepth;

            float height = height_map(uv);
            vec3 col;
            //计算地形与波浪高度
            float waveheight = clamp(WATER_LEVEL * 3. - 1.5, 0., 1.);
            float level = WATER_LEVEL + .2 * water_map(uv * 15. + vec2(iTime * .1), waveheight);

            //确定最终高度
            //地形高度低于水位，用波浪高度
            //高于水位，用地形高度
            if(height <= level) {
                normalizedHeight = level;
            }else{
                normalizedHeight = height; // 减少边缘拉伸的割裂感
            }

            float heightOffset = (maxElevation - minElevation) * normalizedHeight;//每个点的高度
            
            // 将顶点位置从模型空间转换到世界空间
            vec4 worldPosition = czm_model * position;
            
            // 将世界坐标转换为经纬度和高度
            vec3 llh = worldToGeographic(worldPosition.xyz);//经纬度
            
            // 将调整后的经纬度和高度转换回笛卡尔坐标
            vec3 adjustedCartesian = deg2cartesian(vec3(llh.xy,minElevation+heightOffset));
            
            gl_Position = czm_projection * czm_view * vec4(adjustedCartesian,1.0);
            v_st = st;
        }
      `;
        const fs = `
        in vec2 v_st;

        void main(){
            light = vec3(-0., .0, 2.8); // position of the sun
            vec2 uv = v_st;

            float deepwater_fadedepth = 0.5 + coast2water_fadedepth;

            float height = height_map(uv);
            vec3 col;
            //计算水位与波浪效果
            float waveheight = clamp(WATER_LEVEL * 3. - 1.5, 0., 1.);
            float level = WATER_LEVEL + .2 * water_map(uv * 15. + vec2(iTime * .1), waveheight);
            if(height <= level) {
                vec2 dif = vec2(.0, .01);
                //水面法线计算,通过采样周围4点的高度差生成法线向量
                vec2 pos = uv * 15. + vec2(iTime * .01);
                float h1 = water_map(pos - dif, waveheight);
                float h2 = water_map(pos + dif, waveheight);
                float h3 = water_map(pos - dif.yx, waveheight);
                float h4 = water_map(pos + dif.yx, waveheight);
                vec3 normwater = normalize(vec3(h3 - h4, h1 - h2, .125)); // norm-vector of the 'bumpy' water-plane
                uv += normwater.xy * .002 * (level - height);

                col = vec3(1.0);
                //计算光照
                float coastfade = clamp((level - height) / coast2water_fadedepth, 0., 1.);
                float coastfade2 = clamp((level - height) / deepwater_fadedepth, 0., 1.);
                float intensity = col.r * .2126 + col.g * .7152 + col.b * .0722;
                watercolor = mix(watercolor * intensity, watercolor2, smoothstep(0., 1., coastfade2));

                vec3 r0 = vec3(uv, WATER_LEVEL);
                vec3 rd = normalize(light - r0); // ray-direction to the light from water-position
                float grad = dot(normwater, rd); // dot-product of norm-vector and light-direction
                float specular = pow(grad, water_softlight_fact);  // used for soft highlights                          
                float specular2 = pow(grad, water_glossylight_fact); // used for glossy highlights
                float gradpos = dot(vec3(0., 0., 1.), rd);
                float specular1 = smoothstep(0., 1., pow(gradpos, 5.));  // used for diffusity (some darker corona around light's specular reflections...)                          
                float watershade = test_shadow(uv, level);
                watercolor *= 2.2 + watershade;
                watercolor += (.2 + .8 * watershade) * ((grad - 1.0) * .5 + specular) * .25;
                watercolor /= (1. + specular1 * 1.25);
                watercolor += watershade * specular2 * water_specularcolor;
                watercolor += watershade * coastfade * (1. - coastfade2) * (vec3(.5, .6, .7) * nautic(uv) + vec3(1., 1., 1.) * particles(uv));

                col = mix(col, watercolor, coastfade);
    
                float alpha = clamp(coastfade,0.1,0.6);
                out_FragColor = vec4(col,1.0);
                return;
            }
        }
  
      `;
        const shaderProgram = Cesium.ShaderProgram.fromCache({
            context: context,
            vertexShaderSource: Common + vs,
            fragmentShaderSource: Common + fs,
            attributeLocations: attributeLocations,
        });
        const texture = new Cesium.Texture({
            context: context,
            width: 2048.0,
            height: 2048.0,
            pixelFormat: Cesium.PixelFormat.RGBA,
            pixelDatatype: Cesium.PixelDatatype.UNSIGNED_BYTE,
            flipY: true,
            sampler: new Cesium.Sampler({
                minificationFilter: Cesium.TextureMinificationFilter.LINEAR,
                magnificationFilter: Cesium.TextureMagnificationFilter.LINEAR,
                wrapS: Cesium.TextureWrap.REPEAT,
                wrapT: Cesium.TextureWrap.REPEAT,
            }),
            source: this.heightMap,
        });
        const noise = new Cesium.Texture({
            context: context,
            width: 512.0,
            height: 512.0,
            pixelFormat: Cesium.PixelFormat.RGBA,
            pixelDatatype: Cesium.PixelDatatype.UNSIGNED_BYTE,
            flipY: true,
            sampler: new Cesium.Sampler({
                minificationFilter: Cesium.TextureMinificationFilter.LINEAR,
                magnificationFilter: Cesium.TextureMagnificationFilter.LINEAR,
                wrapS: Cesium.TextureWrap.REPEAT,
                wrapT: Cesium.TextureWrap.REPEAT,
            }),
            source: this.noise,
        });
        const uniformMap = {
            heightMap: () => {
                return texture;
            },
            heightScale: () => 1.0,
            minElevation: () => this.minElevation,
            maxElevation: () => this.maxElevation,
            iTime: () => this.time,
            iChannel0: () => noise,
            coast2water_fadedepth: () => this.coast2water_fadedepth,
            large_waveheight: () => this.large_waveheight, // change to adjust the "heavy" waves
            large_wavesize: () => this.large_wavesize, // factor to adjust the large wave size
            small_waveheight: () => this.small_waveheight, // change to adjust the small random waves
            small_wavesize: () => this.small_wavesize, // factor to ajust the small wave size
            water_softlight_fact: () => this.water_softlight_fact, // range [1..200] (should be << smaller than glossy-fact)
            water_glossylight_fact: () => this.water_glossylight_fact, // range [1..200]
            particle_amount: () => this.particle_amount,
            WATER_LEVEL: () => this.WATER_LEVEL,
        };
        const renderState = Cesium.RenderState.fromCache({
            depthTest: { enabled: true },
            depthMask: { enabled: true },
            blending: Cesium.BlendingState.ALPHA_BLEND,
            cull: {
                enabled: false,
            },
        });
        this.drawCommand = new Cesium.DrawCommand({
            modelMatrix: this.modelMatrix,
            vertexArray: va,
            primitiveType: Cesium.PrimitiveType.TRIANGLES, //TRIANGLES LINES
            shaderProgram: shaderProgram,
            uniformMap: uniformMap,
            renderState: renderState,
            pass: Cesium.Pass.OPAQUE,
        });
    }
    set showLines(value) {
        this._showLines = value;
        this.drawCommand.primitiveType = this._showLines
            ? Cesium.PrimitiveType.LINES
            : Cesium.PrimitiveType.TRIANGLES;
    }
    get showLines() {
        return this._showLines;
    }
    async update(frameState) {
        //时间计算
        const now = performance.now();
        this.deltaTime = (now - this.lastUpdateTime) / 1000.0; // 转换为秒
        this.lastUpdateTime = now;
        this.time = now / 1000;
        this.frame += 0.02;
        //this.drawCommand不存在
        if (!this.drawCommand) {
            this.createCommand(frameState.context);
        }
        frameState.commandList.push(this.drawCommand);
    }
    destroy() {
        super.destroy();
        const commondList = [this.drawCommand];
        commondList.forEach((drawCommand) => {
            if (drawCommand) {
                const va = drawCommand.vertexArray,
                    sp = drawCommand.shaderProgram;
                if (!va.isDestroyed()) va.destroy();
                if (!sp.isDestroyed || !sp.isDestroyed()) {
                    sp.destroy();
                }
                drawCommand.isDestroyed = function returnTrue() {
                    return true;
                };
                drawCommand.uniformMap = undefined;
                drawCommand.renderState = Cesium.RenderState.removeFromCache(
                    drawCommand.renderState
                );
            }
        });
        this.drawCommand = null;
    }
}
function createSquareRectangle(centerLon, centerLat, sideLength) {
    // 将边长转换为度
    const earthRadius = 6371000; // 地球平均半径，单位：米
    const angularDistance = (sideLength / earthRadius) * (180 / Math.PI);

    // 计算经度差
    const lonDiff = angularDistance / Math.cos((centerLat * Math.PI) / 180);

    // 计算矩形的边界
    const west = centerLon - lonDiff / 2;
    const east = centerLon + lonDiff / 2;
    const south = centerLat - angularDistance / 2;
    const north = centerLat + angularDistance / 2;

    // 返回[west, south, east, north]格式的数组
    return [west, south, east, north];
}

function calculateNormalizedPosition(clickedPosition, extent) {
    // 确保extent是正确的格式：[minLon, minLat, maxLon, maxLat]
    const [minLon, minLat, maxLon, maxLat] = extent;

    // 获取点击位置的经纬度
    const cartographic = Cesium.Cartographic.fromCartesian(clickedPosition);
    const lon = Cesium.Math.toDegrees(cartographic.longitude);
    const lat = Cesium.Math.toDegrees(cartographic.latitude);

    // 计算归一化坐标
    const x = (lon - minLon) / (maxLon - minLon);
    const y = (lat - minLat) / (maxLat - minLat);

    return { x, y };
}
onMounted(async () => {
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
        terrain: Cesium.Terrain.fromWorldTerrain(),
    })
    viewer.scene.debugShowFramesPerSecond = true //显示fps
    viewer.scene.msaaSamples = 4;
    viewer.scene.highDynamicRange = true;
    viewer.postProcessStages.fxaa.enabled = true;
    viewer.scene.globe.depthTestAgainstTerrain = true;

    const config = {
        minElevation: 1153.0408311859962,//最小高程
        maxElevation: 3158.762303474051,//最大高程
        url: "/public/Cesium/1724136544296.png",
        center: [-119.5509508318, 37.7379837881],
    };

    async function getImageSource() {
        const image = await Cesium.Resource.fetchImage({
            url: config.url,
        });
        return {
            minElevation: config.minElevation,
            maxElevation: config.maxElevation,
            canvas: image,
        };
    }
    const center = config.center;//坐标位置
    const extent = createSquareRectangle(...center, 20000);//计算范围
    console.log(extent);
    const rectangle = Cesium.Rectangle.fromDegrees(...extent);
    viewer.camera.flyTo({
        destination: rectangle,
        duration: 1.0,
    });

    const terrainInfo = await getImageSource(viewer, extent, 2048, 2048); // getImageSource() await getImage(viewer, extent);
    const noise = await Cesium.Resource.fetchImage({
        url: "/public/Cesium/texture4.png",
    });
    const test = new Erosion({
        viewer,
        extent,
        ...terrainInfo,
        noise,
    });
    //改变交互界面style属性
    gui.domElement.style.top = '80px'
    gui.domElement.style.right = '20px';
    gui.domElement.style.width = '300px';
    gui.add(test, "coast2water_fadedepth", 0.0, 1);
    gui.add(test, "large_waveheight", 0.01, 1);
    gui.add(test, "large_wavesize", 1, 10);
    gui.add(test, "small_waveheight", 0, 2);
    gui.add(test, "small_wavesize", 0, 1);
    gui.add(test, "water_softlight_fact", 1, 200);
    gui.add(test, "water_glossylight_fact", 1, 200);
    gui.add(test, "particle_amount", 1, 200);
    gui.add(test, "WATER_LEVEL", 0, 2);
    gui.add(test, "showLines");

    viewer.scene.primitives.add(test);

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