<template>
  <div>
    <div id="map"></div>
  </div>
</template>
<script setup>
import * as Cesium from "cesium";
import { onMounted } from 'vue'

onMounted(() => {
  //1.场景初始化
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
    //imageryProvider: false,
    terrainProvider: new Cesium.EllipsoidTerrainProvider() // 使用简单的椭球体地形
  })

  viewer.scene.debugShowFramesPerSecond = true //显示fps

  // 配置VoxelProvider
  function ProceduralMultiTileVoxelProvider(shape) {
    //在这个函数中,一个面由多少方块组成，一方面取决于dimensions,一方面取决于自定义的属性值_levelCount
    //体渲染一面的体素数量=dimensions.x+dimensions.y(两个相乘)*_levelCount
    //例如，此时为8x8x1=64,即为每一个面都由64个小正方体组成
    this.shape = shape;
    this.minBounds = Cesium.VoxelShapeType.getMinBounds(shape).clone();
    this.maxBounds = Cesium.VoxelShapeType.getMaxBounds(shape).clone();
    this.dimensions = new Cesium.Cartesian3(8, 8, 8);
    this.paddingBefore = new Cesium.Cartesian3(1, 1, 1);
    this.paddingAfter = new Cesium.Cartesian3(1, 1, 1);
    this.names = ["color"];
    this.types = [Cesium.MetadataType.VEC4];
    this.componentTypes = [Cesium.MetadataComponentType.FLOAT32];
    //this.globalTransform = globalTransform;
    //体素切片分为两级
    this._levelCount = 1;
    this._allVoxelData = new Array(this._levelCount);
    const allVoxelData = this._allVoxelData;
    const channelCount = Cesium.MetadataType.getComponentCount(this.types[0]);
    const { dimensions } = this;

    for (let level = 0; level < this._levelCount; level++) {
      const dimAtLevel = Math.pow(2, level);
      const voxelCountX = dimensions.x * dimAtLevel;
      const voxelCountY = dimensions.y * dimAtLevel;
      const voxelCountZ = dimensions.z * dimAtLevel;
      //第一级是64，第二级是512
      const voxelsPerLevel = voxelCountX * voxelCountY * voxelCountZ;
      //根据数据，生成每一级别的空数组
      const levelData = (allVoxelData[level] = new Array(
        voxelsPerLevel * channelCount,
      ));
      //此时levelData结构为
      //0:[256*4个0]
      //1:[512*4个0]
      //插值计算,生成数据
      for (let z = 0; z < voxelCountX; z++) {
        for (let y = 0; y < voxelCountY; y++) {
          const indexZY = z * voxelCountY * voxelCountX + y * voxelCountX;
          for (let x = 0; x < voxelCountZ; x++) {
            const index = (indexZY + x) * channelCount;
            //归一化赋值
            levelData[index + 0] = x / (voxelCountX - 1);
            levelData[index + 1] = y / (voxelCountY - 1);
            levelData[index + 2] = z / (voxelCountZ - 1);
            levelData[index + 3] = 0.5;
            
          }
        }
      }

    }

  }
  ProceduralMultiTileVoxelProvider.prototype.requestData = function (options) {
       const { tileLevel, tileX, tileY, tileZ } = options;

    if (tileLevel >= this._levelCount) {
      return Promise.reject(
        `No tiles available beyond level ${this._levelCount - 1}`,
      );
    }
    //获取name中的color中的第一个数据类型，即为vec4
    const type = this.types[0];
    //根据数据类型获取定义了的MetadataType对应的值
    const channelCount = Cesium.MetadataType.getComponentCount(type);
    //获取定义的属性值
    const { dimensions, paddingBefore, paddingAfter } = this;
    //体渲染的总范围，paddingBefore是图块填充前的范围，after是填充后
    //dimensions表示图块的每个维度的体素数。
    const paddedDimensions = Cesium.Cartesian3.fromElements(
      dimensions.x + paddingBefore.x + paddingAfter.x,
      dimensions.y + paddingBefore.y + paddingAfter.y,
      dimensions.z + paddingBefore.z + paddingAfter.z,
    );
    //当前切片级别
    const dimAtLevel = Math.pow(2, tileLevel);
    //切片对应的级别
    const dimensionsGlobal = Cesium.Cartesian3.fromElements(
      dimensions.x * dimAtLevel,
      dimensions.y * dimAtLevel,
      dimensions.z * dimAtLevel,
    );
    //最小坐标
    const minimumGlobalCoord = Cesium.Cartesian3.ZERO;
    //最大坐标
    const maximumGlobalCoord = new Cesium.Cartesian3(
      dimensionsGlobal.x - 1,
      dimensionsGlobal.y - 1,
      dimensionsGlobal.z - 1,
    );
    let coordGlobal = new Cesium.Cartesian3();
    //dataGlobal是一个数组，有两级别，这个数组就要两个子数组，每个子数组分别存储对应级别的体素的数据，这里分别是color
    const dataGlobal = this._allVoxelData;
    console.log(dataGlobal)
    //生成一个由6x6x6x4一共864个类型为float32的0构成的数组
    const dataTile = new Float32Array(
      paddedDimensions.x * paddedDimensions.y * paddedDimensions.z * channelCount,
    );
    //从dataGlobal找到对应层级与位置的值，将一共256+2048个值赋给864个值之中
    for (let z = 0; z < paddedDimensions.z; z++) {
      const indexZ = z * paddedDimensions.y * paddedDimensions.x;
      for (let y = 0; y < paddedDimensions.y; y++) {
        const indexZY = indexZ + y * paddedDimensions.x;
        for (let x = 0; x < paddedDimensions.x; x++) {
          const indexTile = indexZY + x;
          //限制举止范围为[0,[7,7,7]]
          coordGlobal = Cesium.Cartesian3.clamp(
            Cesium.Cartesian3.fromElements(
              tileX * dimensions.x + (x - paddingBefore.x),
              tileY * dimensions.y + (y - paddingBefore.y),
              tileZ * dimensions.z + (z - paddingBefore.z),
              coordGlobal,
            ),
            minimumGlobalCoord,
            maximumGlobalCoord,
            coordGlobal,
          );
          const indexGlobal =
            coordGlobal.z * dimensionsGlobal.y * dimensionsGlobal.x +
            coordGlobal.y * dimensionsGlobal.x +
            coordGlobal.x;

          for (let c = 0; c < channelCount; c++) {
            dataTile[indexTile * channelCount + c] =
              dataGlobal[tileLevel][indexGlobal * channelCount + c];
          }
        }
      }
    }

    const content = Cesium.VoxelContent.fromMetadataArray([dataTile]);

    return Promise.resolve(content);
  }

  //配置customshader
  const customShader = new Cesium.CustomShader({
    fragmentShaderText: `void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
    {
        material.diffuse = 1.0-fsInput.metadata.color.rgb;
        float transparency = 1.0 - fsInput.metadata.color.a;//0.5

        // To mimic light scattering, use exponential decay
        float thickness = fsInput.voxel.travelDistance * 16.0;
        material.alpha = 1.0 - pow(transparency, thickness);
    }`,
  });
  //生成VoxelProvider
  const provider = new ProceduralMultiTileVoxelProvider(
    Cesium.VoxelShapeType.BOX
  );

  //设置模型矩阵
  const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
    Cesium.Cartesian3.fromDegrees(106.642372689378, 26.623450331223)
  );

  Cesium.Matrix4.multiplyByTranslation(
    modelMatrix,
    new Cesium.Cartesian3(0, 0, 100),
    modelMatrix
  );
  //大小
  const scaleMatrix = Cesium.Matrix4.fromScale(
    new Cesium.Cartesian3(100, 100, 100)
  );
  Cesium.Matrix4.multiply(modelMatrix, scaleMatrix, modelMatrix);
  Cesium.Matrix4.multiplyByTranslation(
    modelMatrix,
    new Cesium.Cartesian3(0, 0, 1),
    modelMatrix
  );
  //生成voxelPrimitive,加载到地图中
  const voxelPrimitive = new Cesium.VoxelPrimitive({
    provider: provider,
    customShader: customShader,
    modelMatrix: modelMatrix
  })
  
  viewer.scene.primitives.add(voxelPrimitive)
  viewer.zoomTo(voxelPrimitive);

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