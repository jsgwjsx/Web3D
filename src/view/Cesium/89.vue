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
    let fs = `
precision mediump float;

uniform sampler2D colorTexture;
uniform sampler2D depthTexture;
in vec2 v_textureCoordinates;

//#define SHOW_BOUNDS
//#define NOISE_LUT

#define CAM_ROTATION_SPEED 11.7
#define CAM_TILT .15				// put 0. if you do not want to animate camera vertically
#define CAM_DIST 3.8

#define MAX_MULT_EXPLOSIONS 5
uniform sampler2D iChannel0;
uniform float u_time;

// the bounding sphere of the explosion. this is less general but means that
// ray cast is only performed for nearby pixels, and raycast can begin from the sphere
// (instead of walking out from the camera)

//新增
uniform vec2 u_winCenter;
// float expRadius = 1.75;
uniform float expRadius;

float explosion_seed = 0.0;			// keep this constant for a whole explosion, but when differing from explosion to the next one, you get non-identical looking ones
float downscale = 1.25;				// how much smaller (than expRadius) one explosion ball should be. bigger value = smaller. 1.0 = no scale down.
// #ifndef SHADERTOY_APP
const int steps = 30;				// iterations when marching through cloud noise. default = 64. 40 might still suffice. When putting higher, explosion becomes too dense, so make colBottom and colTop more transparent.
float grain = 2.0;					// increase for more detailed explosions, but then you should also increase iterations (and decrease step, which is done automatically)
float speed = 0.5;					// total animation speed (time stretch). nice = 0.5, default = 0.4
float ballness = 2.0;				// lower values makes explosion look more like a cloud. higher values more like a ball.
float growth = 2.2;					// initial growth to explosion ball. lower values makes explosion grow faster
float fade = 1.6;					// greater values make fade go faster but later. Thus greater values leave more smoke at the end.
float thinout_smooth = 0.7;			// smoothed thinning out of the outer bounding sphere. 1.0 = no smoothening, 0.0 = heavy thinning, nice = 0.65 to 0.75
float density = 1.35;				// higher values make sharper difference between dark and bright colors. low values make more blurry, less color spread and more transparent. default = 1.25 or 1.35
vec2 brightness = vec2(3.0, 2.2);	// x = constant offset, y = time-dependent factor
vec2 brightrad = vec2(1.3, 1.0);	// adds some constiation to the radius of the brightness falloff. x = constant offset, y = density-dependent factor
vec4 colBottom = vec4(1.2,0.94,0.42,0.7);
vec4 colTop = vec4(0.15,0.15,0.15,0.1);
float color_low = 0.25;				// the lower the value, the more black spots appear in the explosion. the higher, the more even the explosion looks like.
float contrast = 1.0;				// final color contrast. higher values make ligher contrast. default = 1.0
float rolling_init_damp = 0.3;		// rolling animation initial damping. 0.0 = no damping. nice = 0.2, default = 0.15
float rolling_speed = 2.0;			// rolling animation speed (static over time). default = 1.0
const int mult_explosions = MAX_MULT_EXPLOSIONS;	// how many explosion balls to draw
float variation_seed = 0.0;			// influences position variation of the different explosion balls
float delay_seed = 0.0;				// influences the start delay variation of the different explosion balls
const float delay_range = 0.25;			// describes the maximum delay for explosion balls to start up. Notice, this delay is relative to one explosion ball duration, so actually before speed is applied.
float ball_spread = 1.0;			// how much to spread ball starting positions from the up vector. 0.0 = all on up vector, 1.0 = any direction between up and down vector.
/* for up-moving explosion similar to explosion mushroom, put
downscale = 1.75;
grain = 2.7;
rolling_init_damp = 0.2;
ball_spread = 0.4;
*/

/* for mobile device, for faster rendering but with less quality, put
LOW_Q 1
turn off FOG
MAX_MULT_EXPLOSIONS 3
steps = 25;
*/

// Now come some fun effects which have nothing to do with the explosion effect.
// You can switch them all off completely by commenting WITH_FUN.
//#define WITH_FUN

// The fog is just for fun and has nothing to do with the explosion.
#define FOG
// Same with the stars. Just for fun.
#define STARS
#define STARDISTANCE 250.
#define STARBRIGHTNESS 0.3
#define STARDENCITY 0.05
// Night scenery settings, again just for fun.
#define DAY_NIGHT_CYCLE_TIME 20.
#define NIGHT_COLORING vec3(.92,.95,1.)
#define CORRIDOR_LIGHT vec3(1.,1.,.9)
#define ENLIGHTEN_PASSAGE .75
// explosion enlightening the floor (faked)
#define FLOOR_LIGHT_STRENGTH 1.

struct Ball
{
vec3 offset;
vec3 dir;
float delay;
};

Ball balls[MAX_MULT_EXPLOSIONS];

float tmax = 1.0 + delay_range;
float getTime()
{
return fract(u_time * speed / tmax) * tmax;
}

const float pi=3.14159265;

float hash( float n )
{
return fract(cos(n)*41415.92653);	//https://www.shadertoy.com/view/4sXGRM
//return fract(sin(n)*753.5453123);	//https://www.shadertoy.com/view/4sfGzS
}

vec2 hash2( float n )
{
//return fract(cos(n)*vec2(10003.579, 37049.7));	//https://www.shadertoy.com/view/XtsSWs
return fract(sin(vec2(n,n+1.0))*vec2(13.5453123,31.1459123));
}

vec3 hash3( float n )
{
return fract(sin(vec3(n,n+1.0,n+2.0))*vec3(13.5453123,31.1459123,37.3490423));
}

float hash13(vec3 p3)
{
p3  = fract(p3 * vec3(.1031,.11369,.13787));
p3 += dot(p3, p3.yzx + 19.19);
return fract((p3.x + p3.y) * p3.z);
}

#ifdef NOISE_LUT
//iq's LUT 3D noise
float noise( in vec3 x )
{
vec3 f = fract(x);
vec3 p = x - f; // this avoids the floor() but doesnt affect performance for me.
#ifndef LOW_Q		// in low quality setting, for speed, we try to live without that. we compensate with growth and fade.
f = f*f*(3.0-2.0*f);
#endif

vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
// #ifndef SHADERTOY_APP
vec2 rg = textureLod( iChannel0, (uv+ 0.5)/256.0, 0.0 ).yx;
// #else
// vec2 rg = texture( iChannel0, (uv+ 0.5)/256.0 ).yx;
// #endif
return mix( rg.x, rg.y, f.z );
}
#else

float noise( in vec3 x )
{
vec3 f = fract(x);
vec3 p = x - f; // this avoids the floor() but doesnt affect performance for me.
#ifndef LOW_Q		// in low quality setting, for speed, we try to live without that. we compensate with growth and fade.
f = f*f*(3.0-2.0*f);
#endif

float n = p.x + p.y*157.0 + 113.0*p.z;
return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
            mix( hash(n+157.0), hash(n+158.0),f.x),f.y),
        mix(mix( hash(n+113.0), hash(n+114.0),f.x),
            mix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);
}
#endif

float fbm( vec3 p, vec3 dir )
{
float f;
#ifndef LOW_Q
vec3 q = p - dir; f  = 0.50000*noise( q );
q = q*2.02 - dir; f += 0.25000*noise( q );
q = q*2.03 - dir; f += 0.12500*noise( q );
q = q*2.01 - dir; f += 0.06250*noise( q );
q = q*2.02 - dir; f += 0.03125*noise( q );
#elif LOW_Q == 1
// in low quality setting, for speed, we try to live with a lower-quality fbm. we compensate with higher grain.
vec3 q = p - dir; f  = 0.50000*noise( q );
q = q*2.02 - dir; f += 0.25000*noise( q );
q = q*2.03 - dir; f += 0.12500*noise( q );
q = q*2.04 - dir; f += 0.08250*noise( q );
#elif LOW_Q == 2
vec3 q = p - dir; f  = 0.50000*noise( q );
q = q*2.14 - dir; f += 0.29000*noise( q );
q = q*2.25 - dir; f += 0.16500*noise( q );
#endif
return f;
}

// assign colour to the media
vec4 computeColour( float density, float radius, float bright )
{
vec4 result = vec4( vec3(mix( 1.0, color_low, density )), density );
result *= mix( colBottom, colTop, min( (radius+0.5)*0.588, 1.0 ) ) * bright;
return result;
}

// maps 3d position to density
float densityFn( in vec3 p, in float r, float t, in vec3 dir, float seed )
{
//const float pi = 3.1415926;
float den = ballness + (growth+ballness)*log(t)*r;
den -= (2.5+ballness)*pow(t,fade)/r;
if ( den <= -3. ) return -1.;

#ifdef SHOW_BOUNDS
p = 0.5 * normalize(p);
return abs(p.y);
//return 0.8;
#endif

float s = seed-(rolling_speed/(sin(min(t*3.,1.57))+rolling_init_damp));
dir *= s;

p = -grain*p/(dot(p,p)*downscale);
float f = fbm( p, dir );
den += 4.0*f;

return den;
}
void calcDens( in vec3 pos, out float rad, out float r, out float rawDens, in float t, in float foffset, out vec4 col, in float bright )
{
float radiusFromExpCenter = length(pos);
rad = radiusFromExpCenter / expRadius;

r = 0.0;
rawDens = 0.0;
col = vec4(0.0);

for ( int k = 0; k < mult_explosions; ++k )
{
float t0 = t - balls[k].delay;
if ( t0 < 0.0 || t0 > 1.0 ) continue;

vec3 p = pos - balls[k].offset * foffset;
float radiusFromExpCenter0 = length(p);

float r0 = downscale* radiusFromExpCenter0 / expRadius;
if( r0 > 1.0 ) continue;
float rawDens0 = densityFn( p, r0, t0, balls[k].dir, explosion_seed + 33.7*float(k) ) * density;

#ifndef SHOW_BOUNDS
rawDens0 *= 1.-smoothstep(thinout_smooth,1.,r0);
#endif

#ifndef OLD_COLORING
float dens = clamp( rawDens0, 0.0, 1.0 );
vec4 col0 = computeColour(dens, r0*(brightrad.x+brightrad.y*rawDens0), bright);	// also adds some variation to the radius

#ifndef SHOW_BOUNDS
col0.a *= (col0.a + .4) * (1. - r0*r0);

// colour by alpha
col0.rgb *= col0.a;
#else
col0.a *= 5.;
#endif

col += col0;

rawDens = max(rawDens, rawDens0);
//rawDens+=max(rawDens0,0.);

/*if ( rawDens0 > rawDens )
{
    rawDens = rawDens0;
    r = r0;
    col = col0;
}*/
#else
if ( rawDens0 > rawDens )
{
    rawDens = rawDens0;
    r = r0;
}
#endif
}

#ifdef SHOW_BOUNDS
col /= float(mult_explosions);
#endif

}

#ifdef OLD_COLORING
void contributeDens( in float rad, in float r, in float rawDens, in float bright, out vec4 col, inout vec4 sum )
{
float dens = min( rawDens, 1.0 );	// we expect already rawDens to be positive
col = computeColour(dens, r*(brightrad.x+brightrad.y*rawDens), bright);	// also adds some variation to the radius

#ifndef SHOW_BOUNDS
col.a *= (col.a + .4) * (1. - r*r);

col.rgb *= col.a;

sum = sum + col*(1.0 - sum.a);
sum.a+=0.15*col.a;
#else
col.a *= 5.;
sum = max(sum, col);
#endif
}
#endif

#ifndef OLD_COLORING
void contributeColor( in vec4 col, inout vec4 sum )
{
#ifndef SHOW_BOUNDS
// alpha blend in contribution
sum = sum + col*(1.0 - sum.a);
sum.a+=0.15*col.a;
#else
sum = max(sum, col);
#endif
}
#endif

vec4 raymarch( in vec3 rayo, in vec3 rayd, in vec2 expInter, in float t, out float d )
{
    vec4 sum = vec4( 0.0 );

    float step = 1.5 / float(steps);
    vec3 pos = rayo + rayd * (expInter.x);	// no dither

    float march_pos = expInter.x;
    d = 4000.0;
    float t_norm = t / tmax;
    float smooth_t = sin(t_norm*2.1);	//sin(t*2.);

    float t1 = 1.0 - t_norm;	// we use t_norm instead of t so that final color is reached at end of whole animation and not already at end of first explosion ball.
    float bright = brightness.x + brightness.y * t1*t1;

    for( int i=0; i<steps; i++ )
    {
        if( sum.a >= 0.98 ) { d = march_pos; break; }
        if ( march_pos >= expInter.y ) break;

        float rad, r, rawDens;
        vec4 col;
        calcDens( pos, rad, r, rawDens, t, smooth_t, col, bright );

        if ( rawDens <= 0.0 )
        {
            float s = step * 2.0;
            pos += rayd * s;
            march_pos += s;
            continue;
        }

        #ifdef OLD_COLORING
            contributeDens( rad, r, rawDens, bright, col, sum );
        #else
            contributeColor( col, sum );
        #endif

        // take larger steps through low densities.
        // something like using the density function as a SDF.
        float stepMult = 1.0 + (1.-clamp(rawDens+col.a,0.,1.));
        // step along ray
        pos += rayd * step * stepMult;
        march_pos += step * stepMult;

        //pos += rayd * step;
    }

    #ifdef SHOW_BOUNDS
    if ( sum.a < 0.1 )
    sum = vec4(0.,0.,.5,0.1);
    #endif

    return clamp( sum, 0.0, 1.0 );
}
    // iq's sphere intersection, but here fixed for a sphere at (0,0,0)
    vec2 iSphere(in vec3 ro, in vec3 rd, in float rad)
    {
    float b = dot(ro, rd);					//=dot(oc, rd);
    float c = dot(ro, ro) - rad * rad;		//=dot(oc, oc) - sph.w * sph.w; //sph.w is radius
    float h = b*b - c; // delta
    if(h < 0.0) 
    return vec2(-1.0);
    //h = sqrt(h);
    h *= 0.5;		// just some rough approximation to prevent sqrt.
    return vec2(-b-h, -b+h);
}

vec3 computePixelRay( in vec2 p, out vec3 cameraPos )
{
    vec2 iResolution = czm_viewport.zw;
    // camera orbits around explosion

    float camRadius = CAM_DIST;
    // use mouse x coord
    float a = u_time*CAM_ROTATION_SPEED;
    float b = CAM_TILT * sin(a * .014);

    float phi = b * 3.14;
    float camRadiusProjectedDown = camRadius * cos(phi);
    float theta = -(a-iResolution.x)/80.;
    float xoff = camRadiusProjectedDown * cos(theta);
    float zoff = camRadiusProjectedDown * sin(theta);
    float yoff = camRadius * sin(phi);
    cameraPos = vec3(xoff,yoff,zoff);

    // camera target
    vec3 target = vec3(0.);

    // camera frame
    vec3 fo = normalize(target-cameraPos);
    vec3 ri = normalize(vec3(fo.z, 0., -fo.x ));
    vec3 up = normalize(cross(fo,ri));

    // multiplier to emulate a fov control
    float fov = .5;

    // ray direction
    vec3 rayDir = normalize(fo + fov*p.x*ri + fov*p.y*up);

    return rayDir;
}

void setup()
{
    // first expl ball always centered looking up
    balls[0] = Ball(
    vec3(0.),
    vec3(0.,.7,0.),		// not normalized so that expl ball 0 rolls somewhat slower
    0.0
);

float pseed = variation_seed;
float tseed = delay_seed;
float maxdelay = 0.0;
for ( int k = 1; k < mult_explosions; ++k )
{
    float pseed = variation_seed + 3. * float(k-1);
    float tseed = delay_seed + 3. * float(k-1);
    vec2 phi = hash2(pseed) * vec2(2.*pi, pi*ball_spread);
    vec2 tilted = vec2( sin(phi.y), cos(phi.y) );
    vec3 rotated = vec3( tilted.x * cos(phi.x), tilted.y, tilted.x * sin(phi.x) );
    balls[k].offset = 0.7 * rotated; //hash3(pseed) - 0.5;
    balls[k].dir = normalize( balls[k].offset );
    balls[k].delay = delay_range * hash(tseed);
    pseed += 3.;
    tseed += 3.;
    maxdelay = max(maxdelay, balls[k].delay);
}

if ( maxdelay > 0.0 )
{
    // Now stretch the ball explosion delays to the maximum allowed range.
    // So that the last ball starts with a delay of exactly delay_range and thus we do not waste any final time with just empty space.
    for ( int k = 0; k < mult_explosions; ++k )
        balls[k].delay *= delay_range / maxdelay;
    }
}

void main()
{
    out_FragColor = texture(colorTexture, v_textureCoordinates);
    vec2 iResolution = czm_viewport.zw;
    float t = getTime();

    // some global initialization.
    setup();

    // get aspect corrected normalized pixel coordinate
    vec2 q = gl_FragCoord.xy / iResolution.xy;
    vec2 p = -1.0 + 2.0*q;
    float ratio = iResolution.x / iResolution.y;
    p.x *= ratio;

    vec3 cameraPos,rayDir;

    // 新增
    vec2 winCenter = 2.0*u_winCenter;
    p.x -= (winCenter.x)*ratio;
    p.y += (winCenter.y);

    rayDir = computePixelRay( p, cameraPos );

    vec4 col = vec4(0.);
    float d = 4000.0;

    vec2 boundingSphereInter = iSphere( cameraPos, rayDir, expRadius );
    if( boundingSphereInter.x > 0. )
    {
        col = raymarch( cameraPos, rayDir, boundingSphereInter, t, d );
    }
    col.xyz = col.xyz*col.xyz*(1.0+contrast*(1.0-col.xyz));
    out_FragColor.rgb = mix( out_FragColor.rgb, col.xyz, col.a );
}
`;

    function AddCircleScanPostStage(viewer, cartographicCenter) {
        const ScanSegmentShader = fs;
        //进行一个坐标转换
        const _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
        const _Cartesian4Center = new Cesium.Cartesian4(_Cartesian3Center.x, _Cartesian3Center.y, _Cartesian3Center.z, 1);
        const _nearFar = new Cesium.NearFarScalar(15, 1.0, 1.5e3, 0.1);
        const _time = (new Date()).getTime();
        const ScanPostStage = new Cesium.PostProcessStage({
            fragmentShader: ScanSegmentShader,
            uniforms: {
                //新增
                u_winCenter: function () {
                    let winCenter = Cesium.SceneTransforms.worldToWindowCoordinates(viewer.scene, _Cartesian4Center);
                    let res = new Cesium.Cartesian2(winCenter.x / viewer.canvas.width - 0.5, winCenter.y / viewer.canvas.height - 0.5);
                    return res;
                },
                //新增--计算半径
                expRadius: function () {
                    const distance = Cesium.Cartesian3.distance(_Cartesian3Center, viewer.camera.position.clone());
                    let ratio = (distance - _nearFar.near) / (_nearFar.far - _nearFar.near);
                    ratio = Cesium.Math.clamp(ratio, 0.0, 1.0);
                    let value = Cesium.Math.lerp(_nearFar.nearValue, _nearFar.farValue, ratio);
                    return value;
                },
                u_time: function () {
                    return ((new Date()).getTime() - _time) * 0.001;
                },
                iChannel0: "../../../public/Cesium/fire.png",
                // iChannel1: "ichannel0.png"
            }
        });
        viewer.scene.postProcessStages.add(ScanPostStage);
        return (ScanPostStage);

    }
    function addCircleScan(viewer, data) {
        viewer.scene.globe.depthTestAgainstTerrain = true; //防止移动、放大缩小会视觉偏移depthTestAgainstTerrain // 设置该属性为true之后，标绘将位于地形的顶部；如果设为false（默认值），那么标绘将位于平面上。缺陷：开启该属性有可能在切换图层时会引发标绘消失的bug。
        const CartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(data.lon), Cesium.Math.toRadians(data.lat), data.h); //中心位子
        return AddCircleScanPostStage(viewer, CartographicCenter);
    }

    const circleScan = addCircleScan(viewer, {
        lon: 117.217124,//经度
        lat: 31.809777, //纬度
        h: 50, // 新增
    });

    // 新增
    const outlineOnly = viewer.entities.add({
        name: "Yellow box outline",
        position: Cesium.Cartesian3.fromDegrees(117.217124, 31.809777, 50.0),
        box: {
            dimensions: new Cesium.Cartesian3(100.0, 100.0, 100.0),
            fill: false,
            outline: true,
            outlineColor: Cesium.Color.YELLOW,
        },
    });

    //飞行到这个位子
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(117.217124, 31.809777, 350.0),
        orientation: {
            heading: Cesium.Math.toRadians(90.0), // east, default value is 0.0 (north) //东西南北朝向
            pitch: Cesium.Math.toRadians(-90),    // default value (looking down)  //俯视仰视视觉
            roll: 0.0                             // default value
        },
        duration: 0//3秒到达战场
    });

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