#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
void main() {

        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);//[-1,1]
        float t = atan(uv.y,uv.x )+u_time;//[-PI/2,PI/2]
        t = sin(t*10.);//[-1,1]
        float d = smoothstep(0.41,0.4 ,length(uv));
        gl_FragColor=vec4(vec3(d*t),1.0);
}