#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
const float PI = 3.1415;
#define NUM_OCTAVES 5

#define NUM_OCTAVES 5

vec2 hash( vec2 p )
{
    p = vec2( dot(p,vec2(127.1,311.7)),
             dot(p,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec2 p )
{
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;
    vec2 i = floor( p + (p.x+p.y)*K1 );
    vec2 a = p - i + (i.x+i.y)*K2;
    vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0*K2;
    vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
    vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    return dot( n, vec3(70.0) );
}

float fbm(vec2 uv)
{
    float f;
    mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
    f  = 0.5000*noise( uv ); uv = m*uv;
    f += 0.2500*noise( uv ); uv = m*uv;
    f += 0.1250*noise( uv ); uv = m*uv;
    f += 0.0625*noise( uv ); uv = m*uv;
    f = 0.5 + 0.5*f;
    return f;
}
void main() {
     vec2 uv = gl_FragCoord.xy / u_resolution.xy;//把坐标调到x(0,1),y(0,1)
    vec2 q = uv;//把uv赋值给q这个变量
    q.x *= 6.;//根据坐标扩五倍x(0,6)
    q.y *= 2.;//y坐标拉伸两倍(0,2)
    float strength = floor(q.x+1.);//根据x坐标确定五个火焰的抖动强度
    float T3 = strength*u_time/2.0;//强度随着时间变化,达到一个动画效果
    q.x = fract(q.x)-0.5;//对x的坐标再调整一下,让他变为5个x(-0.5,0.5)这样的范围
    q.y -= 0.50;//把y变为(-0.50,1.50)范围
    float n = fbm(strength*q - vec2(0,T3));//用FBM生成噪声形成火焰
    //float c = 1. - 16. * pow( max( 0., length(q*vec2(1.8+q.y*1.5,.75) ) - n * max( 0., q.y+.25 ) ),2. );
    float c1 =smoothstep(0.1,0.7,length(vec2(q.x*6.,q.y))*n)+0.18 ;//控制火焰平滑度
    vec3 col =vec3(2.948*c1, 1.180*c1, c1*0.032);//控制火焰颜色
    float a =pow(c1,6.)  ;//颜色混合比例
    gl_FragColor = vec4( mix(vec3(col),vec3(0.),a), 1.0);//实现颜色混合

}