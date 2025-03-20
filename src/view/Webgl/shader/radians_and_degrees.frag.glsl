#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

//生成旋转矩阵
vec2 rotate(vec2 uv, float deg) {
        float s = sin(deg);
        float c = cos(deg);
        mat2 n = mat2(c, s, -s, c);

        return n * uv;
}

void main() {

        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);//[-1,1]
        vec4 col = vec4(0.0);
        float d = 0.;
        float d1 = 0.;
        float d2 = 0.;
        float d3 = 0.;
        vec4 c1;
        vec4 c2;
        vec4 c3;
        uv = rotate(uv, 60. + u_time);
        if(atan(uv.x / uv.y) > radians(45.0) && atan(uv.x / uv.y) < radians(135.0)) {
                d = length(uv - vec2(0.0));
                d1 = smoothstep(0.4, 0.41, d) - smoothstep(0.41, 0.42, d);
                d2 = smoothstep(0.5, 0.51, d) - smoothstep(0.51, 0.52, d);
                d3 = smoothstep(0.6, 0.61, d) - smoothstep(0.61, 0.62, d);
                c1 = mix(col, vec4(1.0, 0.0, 0.0, 1.0), d1);
                c2 = mix(col, vec4(1.0, 0.0, 0.0, 1.0), d2);
                c3 = mix(col, vec4(1.0, 0.0, 0.0, 1.0), d3);
        } else {
                d = length(uv - vec2(0.0));
                d1 = smoothstep(0.4, 0.41, d) - smoothstep(0.41, 0.42, d);
                d2 = smoothstep(0.5, 0.51, d) - smoothstep(0.51, 0.52, d);
                d3 = smoothstep(0.6, 0.61, d) - smoothstep(0.61, 0.62, d);
                c1 = mix(col, vec4(0.718, 1.000, 0.379, 1.0), d1);
                c2 = mix(col, vec4(0., 1.000, 1.0, 1.0), d2);
                c3 = mix(col, vec4(0., 1.000, 0., 1.0), d3);
        }
        gl_FragColor = c3+c2+c1;
}