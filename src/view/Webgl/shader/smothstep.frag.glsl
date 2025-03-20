#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

float gear(float teethN, float toothHW, vec2 st, float radius) {
    vec2 uv = vec2(st.x * teethN, st.y-radius);
    float x = abs((fract(uv.x)-0.5))*2.;//[0,1]
    float y = uv.y * sqrt(2.) * teethN;     
    return 1. - abs(y - smoothstep(0.5-toothHW, 0.5+toothHW, x)); 
   
}

void main( )
{
    vec2 uv = (gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    vec2 st = vec2((atan(uv.x, uv.y) / 6.2831)+0.5, length(uv));//极坐标系(角度,长度)
    
    float a = 32.;
    float b = 0.3;  
    float g1 = gear(a, b, st+vec2(u_time/33.,0.0), 0.4);
    float g2 = gear(a, b, st+vec2(u_time/33.,0.0), 0.5);
    
    float col = smoothstep(0.9, 1., pow(max(g1, g2), 0.2));
    gl_FragColor = vec4(col, col, col,1.0);
}