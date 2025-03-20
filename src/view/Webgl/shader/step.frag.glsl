#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

float band(float t, float start, float end, float blur) {
        float d1 = smoothstep(start - blur, start + blur, t);
        float d2 = smoothstep(end + blur, end - blur, t);
        float d = d1 * d2;
        return d;
}
float rect(vec2 p, vec4 range) {
        float rect1 = band(p.y, range.z, range.x, 0.001);
        float rect2 = band(p.x, range.w, range.y, 0.001);
        return rect2 * rect1;
}

void main() {
        //step
        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        float d1 = -rect(p, vec4(0.95, 0.5, -0.2, -0.8)) + 1.;
        float d2 = -rect(p, vec4(0.3, 0.8, -0.5, 0.0)) + 1.;
        float interset1 = d2 - d1;
        float interset2 = d1 - d2;
        gl_FragColor = vec4(vec3((1. - interset2) * (1. - interset1)), 1.0);

}