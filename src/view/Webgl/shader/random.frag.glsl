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

void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);//[0-1]
        p*=8.;//[-8,8]
        p = floor(p);
        float d = random(p);
        gl_FragColor = vec4(vec3(d), 1.0);
}