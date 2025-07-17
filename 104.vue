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
  viewer.scene.logarithmicDepthBuffer = true;


  var detail_map

  const dim = new Cesium.Cartesian3(10, 10, 10);
  var geometry = Cesium.BoxGeometry.fromDimensions({
    vertexFormat: Cesium.VertexFormat.POSITION_AND_ST,
    dimensions: dim,
  });
  const primitive_modelMatrix = Cesium.Matrix4.multiplyByTranslation(
    Cesium.Transforms.eastNorthUpToFixedFrame(
      Cesium.Cartesian3.fromDegrees(
        124.21936679679918,
        45.85136872098397
      )
    ),
    new Cesium.Cartesian3(0.0, 0.0, 1.0),
    new Cesium.Matrix4()

  );



  let fragmentShaderSource = `
      uniform float iTime;
      in vec3 vOrigin;
      in vec3 vDirection;//相机到点的向量
      
// Stockholms Ström
// by Peder Norrby / Trapcode in 2016
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0


mat3 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat3(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c          );
                                          
}



vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float noise(vec3 v)
  { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
  }

//生成旋转噪声图
float fnoise( vec3 p)
{
    mat3 rot = rotationMatrix( normalize(vec3(0.0,0.0, 1.0)), 0.5*iTime);
    mat3 rot2 = rotationMatrix( normalize(vec3(0.0,0.0, 1.0)), 0.3*iTime);
    float sum = 0.0;
    //rot是整个的旋转矩阵，使整体不断回旋(低频率大结构)
    vec3 r = rot*p;
    
    float add = noise(r);//采取基础3D噪声(返回[-1,1]或者[0,1])
    float msc = add+0.7;// 计算掩码值（初始基于第一层噪声）
    msc = clamp(msc, 0.0, 1.0);//限制在0,1,之间
    sum += 0.6*add;// 叠加噪声，振幅0.6
    
    p = p*2.0;//频率翻倍，生成第二层次细节
    r = rot*p;//旋转
    add = noise(r);//采样噪声
 
    add *= msc; // 受上一层掩码影响（细节跟随大结构）
    sum += 0.5*add; // 叠加振幅0.5比第一层小
    msc *= add+0.7;//更新掩码(融合当前层信息)
    msc = clamp(msc, 0.0, 1.0);
    //第三层细节
    p.xy = p.xy*2.0;
    //p = rot2 *p;
    add = noise(p);
    add *= msc;
    sum += 0.25*abs(add);
    msc *= add+0.7;
   	msc = clamp(msc, 0.0, 1.0);
    //第四层细节
    p = p*2.0;
    p = p*rot;
    add = noise(p);// + vec3(iTime*5.0, 0.0, 0.0));
    add *= msc;
    sum += 0.125*abs(add);
    msc *= add+0.2;
   	msc = clamp(msc, 0.0, 1.0);
    //第五层细节
    p = p*2.0;
    //p = p*rot;
    add = noise(p);
    add *= msc;
    sum += 0.0625*abs(add);
    //msc *= add+0.7;
   	//msc = clamp(msc, 0.0, 1.0);

    
    return sum*0.516129; // return msc as detail measure?
    //return sum;
}

float getHeight(vec3 p) // x,z,time
{
  //fnoise,vec3(,控制浪高,)
  //  控制高度  
 	return 0.3-0.5*fnoise( vec3(0.5*(p.x + 0.0*iTime), 0.5*p.z,  0.5*iTime));   
}

#define box_y 1.0
#define box_x 5.0
#define box_z 5.0
#define bg vec4(0.0, 0.0, 0.0, 0.0)
#define step 0.3
#define red vec4(0.0, 0.0, 0.0, 0.0)
#define PI_HALF 1.5707963267949

//这段着色器代码定义了一个名为 getSky 的函数，用于根据视线方向 rd 返回对应的天空颜色或反射颜色。它通过分段条件判断实现了简单的天空、水面倒影和建筑物反射效果模拟
vec4 getSky(vec3 rd)
{
    if (rd.y > 0.4) return vec4(0.5, 0.8, 1.5, 1.0); // bright sky
    if (rd.y < 0.0) return vec4(0.0, 0.2, 0.4, 1.0); // no reflection from below
    
    if (rd.z > 0.9 && rd.x > 0.3) {
    	if (rd.y > 0.2) return 1.5*vec4(2.0, 1.0, 1.0, 1.0); // red houses
    	return 1.5*vec4(2.0, 1.0, 0.5, 1.0); // orange houses
    } else return vec4(0.5, 0.8, 1.5, 1.0 ); // bright sky
}

//用于计算立方体表面的颜色。它通过位置信息生成简单的明暗变化，模拟水体边缘或容器的效果。
//(相交面法线方向,pos是相交点位置,rd是光线传播方向)
vec4 shadeBox(vec3 normal, vec3 pos, vec3 rd)
{
    float deep = 0.5+0.5*pos.y;
    //控制颜色
    vec4 col = deep*1.0*vec4(0.0, 0.3, 0.4, 1.0);
    return col;
 
}
//计算每个交点在正方形内部渲染的颜色
//normal是校准后的法线,p是交点位置,rd是射线方向
vec4 shade(vec3 normal, vec3 pos, vec3 rd)
{   //最大反射率（接近水面的掠射角时反射最强）
    float ReflectionFresnel = 0.99;
    //计算根据法线与光线方向计算反射系数
   	float fresnel = ReflectionFresnel*pow( 1.0-clamp(dot(-rd, normal), 0.0, 1.0), 5.0) + (1.0-ReflectionFresnel);
    vec3 refVec = reflect(rd, normal);//计算反射方向,内置函数
    vec4 reflection = getSky(refVec);//根据反射方向,采样天空盒或环境纹理，获取反射的天空颜色（模拟水面反射周围环境）,反射对应的颜色
    //漫反射
    // vec3 sunDir = normalize(vec3(-1.0, -1.0, 0.5));
    // float intens = 0.5 + 0.5*clamp( dot(normal, sunDir), 0.0, 1.0);
    
    float deep = 1.0+0.5*pos.y;
    
    vec4 col = fresnel*reflection;
    col += deep*0.4*vec4(0.0, 0.3, 0.4, 1.0);
    // col = vec4(1.0,1.0,1.0,1.0);
    return clamp(col, 0.0, 1.0);
}
//用于检测射线与无限高盒子（不含顶面和底面）的相交情况。下面是对该函数的详细解释：
//ro射线起点,rd射线方向
vec4 intersect_box(vec3 ro, vec3 rd) // no top and bottom, just sides!
{
    //vec3 normal;
    float t_min = 1000.0;//记录射线与盒子侧面最先相交的面的最小距离
    vec3 t_normal;//记录与射线相交的盒子的侧面的法线距离

    // x = -box_x plane
    float t = (-box_x -ro.x) / rd.x;// 计算射线与左平面的相交距离t
    vec3 p = ro + t*rd;//交点
    //验证交点是否在盒子内
    if (p.y > -box_y && p.z < box_z && p.z > -box_z) {
      //在里面的话，设置面的法线方向，记录相交距离
        t_normal = vec3(-1.0, 0.0, 0.0);
        t_min = t;//记录当前距离
        //if (dot(normal, rd) > PI_HALF ) return red;//shadeBox(normal, p, rd);
    }

    
    // x = +box_x plane
    //box_x = ro.x + t*rd.x
    //t*rd.x = box_x - ro.x
   // t = (box_x - ro.x)/rd.x
    //右侧面
    t = (box_x -ro.x) / rd.x;
    p = ro + t*rd;

    if (p.y > -box_y && p.z < box_z && p.z > -box_z) {
        if (t < t_min) {
        	t_normal = vec3(1.0, 0.0, 0.0);
			    t_min = t;
        }
    }

    // z = -box_z plane
	t = (-box_z -ro.z) / rd.z;
    p = ro + t*rd;
    //后侧面
    if (p.y > -box_y && p.x < box_x && p.x > -box_x) {
        
        if (t < t_min) {
        	t_normal = vec3(0.0, 0.0, -1.0);
            t_min = t;
        }
    }
    
    // z = +box_z plane
  //前侧面
	t = (box_z -ro.z) / rd.z;
    p = ro + t*rd;
    
    if (p.y > -box_y && p.x < box_x && p.x > -box_x) {
        
        if (t < t_min) {
        	t_normal = vec3(0.0, 0.0, 1.0);
            t_min = t;
        }
    }
    
    //做水体
    //最后获取距离最近的相交平面的相交距离与平面法线
    //有交点的情况下,shadeBox渲染，否则返回背景色
    if (t_min < 1000.0) return shadeBox(t_normal, ro + t_min*rd, rd);
    
    
    return bg;
}


//用于实现射线与高度场的相交检测。
vec4 trace_heightfield( vec3 ro, vec3 rd)
{
    
    // intersect with max h plane, y=1
    //ro.y + t*rd.y = 1.0;
    //t*rd.y = 1.0 - ro.y;
    //计算射线与平面 y=1 的交点，这是高度场的最大高度
    float t = (1.0 - ro.y) / rd.y;
    if (t<0.0) return vec4(1.0,0.0,0.0,0.0);
    vec3 p = ro + t*rd;
    
    if (p.x < -box_x && rd.x <= 0.0) return bg;
    if (p.x >  box_x && rd.x >= 0.0) return bg;
    if (p.z < -box_z && rd.z <= 0.0) return bg;
    if (p.z >  box_z && rd.z >= 0.0) return bg;
    
    //float h = getHeight(p);
    float h, last_h;
    bool not_found = true;
    vec3 last_p = p;
    //步进法采集点找交点
    for (int i=0; i<20; i++) {
        p += step*rd;//相交后的第一个点
    	  h = getHeight(p);//相交后的第一个纹理高
        //如过p.y<h,说明已经找到了交点
        if (p.y < h) {not_found = false; break;} // we stepped through
        last_h = h;//相交前最后的纹理高
        last_p = p;//相交前最后高的点的位置
    }
  //没有相交，则返回背景值
  if (not_found) return bg;
 
 	// refine interection
    float dh2 = h - p.y;
    float dh1 = last_p.y - last_h;
 	  p = last_p + rd*step/(dh2/dh1+1.0);//计算更加准确的交点位置
   
    if (p.x < -box_x) {
        if (rd.x <= 0.0) return bg;//交点在正方形左边光线往左边射,返回背景值 
        return intersect_box(ro, rd);//否则,返回这个点对应的颜色
    }
    if (p.x >  box_x) {
        if (rd.x >= 0.0) return bg;//交点在正方形右边光线往左边射,返回背景值 
        return intersect_box(ro, rd);
    }
    if (p.z < -box_z) {
        if (rd.z <= 0.0) return bg; //交点正方形在后边光线往左边射,返回背景值 
        return intersect_box(ro, rd);
    }
    if (p.z >  box_z) {
        if (rd.z >= 0.0) return bg;//交点在正方形前边光线往左边射,返回背景值 
        return intersect_box(ro, rd);
    }
    //如果交点在正方体上部
    //生成相邻采样点
    vec3 pdx = p + vec3( 0.01, 0.0,  0.00);//在X方向偏移微小距离（0.01单位）
    vec3 pdz = p + vec3( 0.00, 0.0,  0.01);//在z方向偏移微小距离（0.01单位）
    //获取相邻点的高度
    float hdx = getHeight( pdx );
    float hdz = getHeight( pdz );
   	h = getHeight( p );
    //更新点y的坐标
    p.y = h;
    pdx.y = hdx;
    pdz.y = hdz;
    //计算法线向量
    vec3 normal = normalize(cross( p-pdz, p-pdx)) ;
 	return shade(normal, p, rd);
}


// Shadertoy camera code by iq
//构建相机坐标系的变换矩阵。这个矩阵可以将向量从世界坐标系转换到相机坐标系，在计算机图形学中常用于射线生成和视图变换。
mat3 setCamera( in vec3 ro, in vec3 ta, float cr ) 
{
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}
//计算射线与轴对齐包围盒（AABB，Axis-Aligned Bounding Box）的相交参数。
vec2 hitBox( vec3 orig, vec3 dir ) {
        const vec3 box_min = vec3( - 0.5 );//盒子边界定义，最小为(-0.5,-0.5,-0.5)
        const vec3 box_max = vec3( 0.5 );//最大为(0.5,0.5,0.5)
        vec3 inv_dir = 1.0 / dir;//射线方向的倒数（优化除法运算）
        vec3 tmin_tmp = ( box_min - orig ) * inv_dir;// 射线到达盒子"最小面"的相交距离
        vec3 tmax_tmp = ( box_max - orig ) * inv_dir;// 射线到达盒子"最大面"的相交距离
        vec3 tmin = min( tmin_tmp, tmax_tmp );
        vec3 tmax = max( tmin_tmp, tmax_tmp );
        float t0 = max( tmin.x, max( tmin.y, tmin.z ) );//射线进入盒子的距离（最晚进入的轴）
        float t1 = min( tmax.x, min( tmax.y, tmax.z ) ); // 射线离开盒子的距离（最早离开的轴）
        return vec2( t0, t1 );//如果t0>t1,说明不相交，如果t0<t1,说明相交
      }


					void main(){

						vec3 rayDir = normalize( vDirection );//相机到点的向量归一化
						vec2 bounds = hitBox( vOrigin, rayDir );//Vorigin是相机的位置

						// if ( bounds.x > bounds.y ) discard;

						// bounds.x = max( bounds.x, 0.0 );

						// vec3 p = vOrigin + bounds.x * rayDir;
						// vec3 inc = 1.0 / abs( rayDir );
						// float delta = min( inc.x, min( inc.y, inc.z ) );
						// delta /= steps;

						out_FragColor = trace_heightfield( vOrigin, rayDir );

						if ( out_FragColor.a == 0.0 ) discard;

					}
   `;

  const vertexShaderSource = `
  in vec3 position;
  in vec2 st;

  out vec3 vOrigin;
  out vec3 vDirection;

  void main()
  {    
      vOrigin=czm_encodedCameraPositionMCHigh+czm_encodedCameraPositionMCLow;
      vDirection=position-vOrigin;

      gl_Position = czm_modelViewProjection * vec4(position,1.0);
  }
	`;

  class ly_primitive {

    constructor(options) {
      this.drawCommand = undefined;

      if (Cesium.defined(options)) {
        this.modelMatrix = options.modelMatrix;
        this.geometry = options.geometry;
        this.data = options.data;
        this.halfdim = new Cesium.Cartesian3();
        Cesium.Cartesian3.divideByScalar(options.dim, 2, this.halfdim);
      }
    }
    createCommand(context) {
      let t = performance.now()
      if (!Cesium.defined(this.geometry)) return;
      const geometry = Cesium.BoxGeometry.createGeometry(this.geometry);
      const attributelocations = Cesium.GeometryPipeline.createAttributeLocations(geometry);
      this.vertexarray = Cesium.VertexArray.fromGeometry({
        context: context,
        geometry: geometry,
        attributes: attributelocations
      });
      const renderstate = Cesium.RenderState.fromCache({
        depthTest: {
          enabled: true,
        },
        // blending: {
        //   enabled: true
        // }
        // cull: {
        //   enabled: false,
        // }
      })
      const shaderProgram = Cesium.ShaderProgram.fromCache({
        context: context,
        vertexShaderSource: vertexShaderSource,
        fragmentShaderSource: fragmentShaderSource,
        attributeLocations: attributelocations
      });
      const that = this;
      const uniformmap = {
        threshold: function () { return viewModel.threshold },
        steps: function () { return viewModel.steps },
        map: function () { return detail_map },
        iTime: function () {
          return (performance.now() - t) / 1000
        }

      };

      this.drawCommand = new Cesium.DrawCommand({
        boundingVolume: this.geometry.boundingSphere,
        modelMatrix: this.modelMatrix,
        // pass: Cesium.Pass.OPAQUE,
        pass: Cesium.Pass.TRANSLUCENT,
        shaderProgram: shaderProgram,
        renderState: renderstate,
        vertexArray: this.vertexarray,
        uniformMap: uniformmap
      });
    }
    update(frameState) {
      if (!this.drawCommand) {
        this.createCommand(frameState.context);
      }
      frameState.commandList.push(this.drawCommand);
    }
    isDestroyed(item) {
       return false;
    }
  }

  const m = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(90.0));
  let mm = Cesium.Matrix4.multiplyByMatrix3(primitive_modelMatrix, m, new Cesium.Matrix4);
  const options = {
    modelMatrix: mm,
    geometry: geometry,
    dim: dim
  };
  viewer.scene.primitives.add(
    new ly_primitive(options)
  );

  viewer.camera.lookAt(new Cesium.Cartesian3.fromDegrees(124.21936679679918,
    45.85136872098397, 1), new Cesium.Cartesian3(10, 10, 10));
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