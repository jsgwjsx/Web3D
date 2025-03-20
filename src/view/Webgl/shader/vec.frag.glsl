#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
const float PI = 3.1415;

mat2 rotate(float angle) {
        return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}
void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);//[0-1]
        p =p*rotate(PI / 4.);
        vec2 n1 = vec2(-0.1, -0.1), n2 = vec2(0.1, -0.1), n3 = vec2(-0.1, 0.1), n4 = vec2(0.1, 0.1);
        vec4 d = vec4(dot(p, n1), dot(p, n2), dot(p, n3), dot(p, n4));
        d = all(lessThan(d, vec4(0.098))) ? vec4(.1) : d;
         
        float color = all(lessThan(d, vec4(0.099))) ? 0. : 1.;

        gl_FragColor = vec4(vec3(color), 1.0);
}