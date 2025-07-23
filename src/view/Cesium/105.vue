<template>
  <div>
    <div id="map"></div>
  </div>
</template>
<script setup>
// import * as Cesium from 'cesium'
import { onMounted } from 'vue'
import { Texture3D } from "./util/Texture3D";  //定义3D纹理，cesium中没有自带的，可以通过2D的texture来定义一个3D的Texture3D
import { ImprovedNoise } from './util/perlin_noise'
const fragmentShaderSource = `
precision highp float;
precision highp sampler3D;
#define epsilon 0.0001
uniform float slice_size;
uniform sampler3D volumnTexture;
uniform vec3 halfdim;

uniform float threshold;

uniform float steps;


in vec3 vOrigin;
in vec3 vDirection;
in vec2 vst;

float getData(vec3 apos){
  vec3 pos=apos/(halfdim*2.);
 
  return texture(volumnTexture,pos).a;
}
vec2 hitBox( vec3 orig, vec3 dir ) {
  vec3 box_min = vec3( -halfdim );
  vec3 box_max = vec3( halfdim );
  vec3 inv_dir = 1.0 / dir;
  vec3 tmin_tmp = ( box_min - orig ) * inv_dir;
  vec3 tmax_tmp = ( box_max - orig ) * inv_dir;
  vec3 tmin = min( tmin_tmp, tmax_tmp );
  vec3 tmax = max( tmin_tmp, tmax_tmp );
  float t0 = max( tmin.x, max( tmin.y, tmin.z ) );
  float t1 = min( tmax.x, min( tmax.y, tmax.z ) );
  return vec2( t0, t1 );
}
vec3 normal( vec3 coord ) {
  if ( coord.x < epsilon ) return vec3( 1.0, 0.0, 0.0 );
  if ( coord.y < epsilon ) return vec3( 0.0, 1.0, 0.0 );
  if ( coord.z < epsilon ) return vec3( 0.0, 0.0, 1.0 );
  if ( coord.x > 1.0 - epsilon ) return vec3( - 1.0, 0.0, 0.0 );
  if ( coord.y > 1.0 - epsilon ) return vec3( 0.0, - 1.0, 0.0 );
  if ( coord.z > 1.0 - epsilon ) return vec3( 0.0, 0.0, - 1.0 );

  float step = 0.01;
  float x = getData( coord + vec3( - step, 0.0, 0.0 ) ) - getData( coord + vec3( step, 0.0, 0.0 ) );
  float y = getData( coord + vec3( 0.0, - step, 0.0 ) ) - getData( coord + vec3( 0.0, step, 0.0 ) );
  float z = getData( coord + vec3( 0.0, 0.0, - step ) ) - getData( coord + vec3( 0.0, 0.0, step ) );

  return normalize( vec3( x, y, z ) );
}

void main()
{
  vec3 rayDir=normalize(vDirection);
  vec2 bounds=hitBox(vOrigin,rayDir);

  if(bounds.x>bounds.y) discard;
  bounds.x=max(bounds.x,0.0);

  vec3 p=vOrigin+bounds.x*rayDir;
  vec3 inc=1.0/abs(rayDir);
  float delta=min(inc.x,min(inc.y,inc.z));
  delta/=steps;

  for ( float t = bounds.x; t < bounds.y; t += delta ){
    float d=getData(p+halfdim);
    if(d>threshold){
      out_FragColor.rgb=normal(p+0.5)*0.5+(p*1.5+0.25);
      // color=vec4(d);
      out_FragColor.a=1.;
      break;
    }
    p+=rayDir*delta;
  }

  if(out_FragColor.a==0.) discard;
}
`;
const vertexShaderSource = /* glsl */ `
in vec3 position;
in vec2 st;

out vec3 vOrigin;
out vec3 vDirection;
out vec2 vst;

void main()
{  
 vOrigin=czm_encodedCameraPositionMCHigh+czm_encodedCameraPositionMCLow;
 vDirection=position-vOrigin;
 vst=st;

 gl_Position = czm_modelViewProjection * vec4(position,1.0);
}
`;
class CustomPrimitive {
  constructor(options) {
    this.drawCommand = undefined;
    if (Cesium.defined(options)) {
      this.modelMatrix = options.modelMatrix;
      this.geometry = options.geometry;
      this.data = options.data;
      this.halfdim = new Cesium.Cartesian3();
      Cesium.Cartesian3.divideByScalar(options.dim, 2, this.halfdim);
      this.viewModel = {
        steps: options.steps || 200,
        threshold: options.threshold || 0.6,
        size: options.size || 128,
      };
    }
  }
  createCommand(context) {
    if (!Cesium.defined(this.geometry)) return;
    const geometry = Cesium.BoxGeometry.createGeometry(this.geometry);
    const attributelocations =
      Cesium.GeometryPipeline.createAttributeLocations(geometry);
    this.vertexarray = Cesium.VertexArray.fromGeometry({
      context: context,
      geometry: geometry,
      attributes: attributelocations,
    });
    const renderstate = Cesium.RenderState.fromCache({
      depthTest: {
        enabled: true,
      },
      cull: {
        enabled: false,
      },
    });
    const shaderProgram = Cesium.ShaderProgram.fromCache({
      context: context,
      vertexShaderSource: vertexShaderSource,
      fragmentShaderSource: fragmentShaderSource,
      attributeLocations: attributelocations,
    });
    const that = this;
    const uniformmap = {
      slice_size() {
        console.log(that.viewModel.size);
        return that.viewModel.size;
      },
      volumnTexture() {
        return that.getTexture(context);
      },
      halfdim() {
        return that.halfdim;
      },

      threshold: function () {
        return that.viewModel.threshold;
      },

      steps: function () {
        return that.viewModel.steps;
      },
    };

    this.drawCommand = new Cesium.DrawCommand({
      boundingVolume: this.geometry.boundingSphere,
      modelMatrix: this.modelMatrix,
      pass: Cesium.Pass.TRANSLUCENT,
      shaderProgram: shaderProgram,
      renderState: renderstate,
      vertexArray: this.vertexarray,
      uniformMap: uniformmap,
    });
  }
  getTexture(context) {
    if (!this.texture) {
      const texture_size = Math.ceil(Math.sqrt(this.data.length));
      this.texture = new Texture3D({
        width: this.viewModel.size,
        height: this.viewModel.size,
        depth: this.viewModel.size,
        context: context,
        flipY: false,
        pixelFormat: Cesium.PixelFormat.ALPHA,
        pixelDataType: Cesium.ComponentDatatype.fromTypedArray(this.data),
        source: {
          width: texture_size,
          height: texture_size,
          arrayBufferView: this.data,
        },
        sampler: new Cesium.Sampler({
          minificationFilter: Cesium.TextureMinificationFilter.LINEAR,
          magnificationFilter: Cesium.TextureMagnificationFilter.LINEAR,
        }),
      });
    }

    return this.texture;
  }
  update(frameState) {
    if (!this.drawCommand) {
      this.createCommand(frameState.context);
    }
    frameState.commandList.push(this.drawCommand);
  }
  isDestroyed() {
    return false;
  }
  /**
     * 更改视图模型参数
     *@paramdata 新的视图模型参数
     */
  change(data) {
    this.viewModel = { ...this.viewModel, ...data };
  }
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
      //&scale=1&lang=zh_cn&style=8&x={x}&y={y}&z={z}
      url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png',
      minimumLevel: 1,
      maximumLevel: 18
    })
    ),
    shouldAnimate: true,
    // scene3DOnly: true,
    contextOptions: {
      requestWebgl2: true
    },
    terrainProvider: new Cesium.EllipsoidTerrainProvider() // 使用简单的椭球体地形
  })

  //生成体数据
  const size = 128;
  const data = new Uint8Array(size * size * size);
  let i = 0;
  const perlin = ImprovedNoise();
  for (let z = 0; z < size; z++) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // vector.set( x, y, z ).divideScalar( size );
        const vector = new Cesium.Cartesian3(x, y, z);
        Cesium.Cartesian3.divideByScalar(vector, size, vector);
        const d = perlin.noise(
          vector.x * 6.5,
          vector.y * 6.5,
          vector.z * 6.5,
        );
        data[i++] = d * 128 + 128;
      }
    }
  }
  const viewModel = {
    steps: 200,
    threshold: 0.6,
    size: 128,
  };
  const dim_temp = new Cesium.Cartesian3(1, 1, 1);
  const geometry = Cesium.BoxGeometry.fromDimensions({
    dimensions: dim_temp,
    vertexFormat: Cesium.VertexFormat.POSITION_AND_ST,
  });
  const primitive_modelMatrix = Cesium.Matrix4.multiplyByTranslation(
    Cesium.Transforms.eastNorthUpToFixedFrame(
      Cesium.Cartesian3.fromDegrees(120.14046454, 30.27415039),
    ),
    new Cesium.Cartesian3(0.0, 0.0, 400.0),
    new Cesium.Matrix4(),
  );
  const options = {
    modelMatrix: primitive_modelMatrix,
    geometry: geometry,
    data: data,
    dim: dim_temp,
    viewModel: viewModel,
  };

  viewer.scene.primitives.add(new CustomPrimitive(options));
    viewer.camera.lookAt(new Cesium.Cartesian3.fromDegrees(120.14046454,
    30.27415039, 400), new Cesium.Cartesian3(10, 10, 10));
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