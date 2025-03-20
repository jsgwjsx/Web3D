#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

float circle(vec2 uv, vec2 center, float radius, float blur) {
        blur += .0001;
        return smoothstep(radius + blur, radius, distance(uv, center));
}

float sdf_line(vec2 p, vec2 a, vec2 b) {
        vec2 pa = p - a;
        vec2 ba = b - a;
        float k = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
        return length(pa - ba * k);
}

float line(vec2 p, vec2 a, vec2 b, float w, float blur) {
        blur += .0001;
        float d = sdf_line(p, a, b);
        return smoothstep(.01 + blur, .01, d / (w * 100.));
}

void main() {
        vec2 uv = (gl_FragCoord.xy * 2. - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

        vec2 uv1 = uv;
        vec2 uv2 = uv;

        uv1 -= .5;
        uv2 += 1.;

        float rad = atan(uv1.y, uv1.x);
        float t = sin(rad * 3. + u_time) * 0.4;
        float fan = 1. - smoothstep(t, t + 0.01, length(uv1));
        float back = circle(uv1, vec2(0.), .1, .01);
        float cap = circle(uv1, vec2(0.), .06, .01);
        float bar = line(uv1, vec2(0.), vec2(0., -1.), .05, 0.002);

        float grass = line(uv2, vec2(-.3, .3), vec2(2., 0.), .3, 0.01);
        float sun = circle(uv, vec2(-1., 1.5), .1, 1.5);

        vec3 color = vec3(0.7529, 0.9451, 0.9804);
        color = mix(color, vec3(0.9412, 0.9882, 0.5176), sun);
        color = mix(color, vec3(.9), bar);
        color = mix(color, vec3(.9), back);
        color = mix(color, vec3(.8), fan);
        color = mix(color, vec3(.9), cap);
        color = mix(color, vec3(0.4706, 0.9529, 0.149), grass);

        gl_FragColor = vec4(vec3(color), 1.);
}