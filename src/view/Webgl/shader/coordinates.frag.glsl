#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
const float PI = 3.1415;

float random(vec2 st) {
        return fract(sin(dot(st, vec2(12.784, 774.154))) * 1000000.1213);
}
float sdf_line(vec2 p, vec2 a, vec2 b) {
        vec2 pa = p - a;
        vec2 ba = b - a;
        float k = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
        return length(pa - ba * k);
}

void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);//[0-1]
        
        vec3 color = vec3(0.0);
        vec3 col1 = vec3(1.0,1.0,0.0);//坐标轴

        float x = step(0.99,0.01/p.y );
        float y = step(0.99,0.01/p.x );

        float a = 0.1; //振幅
        float b = 5.0; //角速度
        float c = 7.0; //频率
        float d = 0.;//偏距
        float e = c;
        float sina = a*sin(b*p.x+e)-d;
        float yx = smoothstep(0.02,0.0 , abs(p.y-sina));
       

        color = mix(color,col1,x);
        color = mix(color,col1,y);
        color = mix(color,vec3(1.0,0.0,0.0),yx);

        gl_FragColor=vec4(vec3(color),1.0);
}