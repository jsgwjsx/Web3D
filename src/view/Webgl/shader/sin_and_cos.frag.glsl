#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;


void main() {

        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);//[-1,1]
        float a = 0.1; //振幅
        float b = 5.0; //角速度
        float c = 7.0; //频率
        float d = 0.;//偏距
        float e = c*u_time;
        float y = a*sin(b*uv.x+e)-d;
        vec3 col = uv.y>y?vec3(0.0):vec3(0.,0.7,0.9);
       
        gl_FragColor=vec4(col,1.0);
}