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
        float utime =abs(sin(u_time*3.14));
        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        float len = length(p);
        vec3 col = vec3(utime-len, utime-2.*len, 0.5*utime-3.*len);
        gl_FragColor = vec4(col,1.0);
}