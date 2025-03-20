#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;


void main(){
        vec2 p = (gl_FragCoord.xy *2.0-u_resolution.xy) /min(u_resolution.x,u_resolution.y);
        vec2 m=(u_mouse.xy*2.0-u_resolution.xy)/min(u_resolution.x,u_resolution.y);
        //绘制三个跟随鼠标移动的圆环
        float t = 0.01/abs(0.3-length(p-m));
        float r = 0.01/abs(0.5-length(p-m));
        float g = 0.01/abs(0.4-length(p-m));
       
        gl_FragColor = vec4(vec3(0.1*t+0.1*r+0.1*g),1.0);
       
}