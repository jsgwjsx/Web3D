#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;



void main() {

        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);//[-1,1]
        float y = asin(sin(uv.x*8.))*0.1;//设置飞线样式
        float r= length(vec2(uv.x+tan(u_time),uv.y))*5.0;
        gl_FragColor = vec4(exp(-abs(vec3(uv.y)-y)/0.02-r),1.0);

}