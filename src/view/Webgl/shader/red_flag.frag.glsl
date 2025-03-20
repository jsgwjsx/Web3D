#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
#define PI2 3.141592653*2.
mat2 rotate(float angle) {
       return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}
float start(vec2 uv) {
       uv.x = abs(uv.x);
       uv = uv;
       float angle = PI2 / 5.;
       float a = dot(uv - vec2(0., 0.), vec2(sin(angle), cos(angle)) - vec2(0., 0.));
       angle = PI2 / 5. * 3.0;
       float b = dot(uv - vec2(0., 0.), vec2(sin(angle), cos(angle)) - vec2(0., 0.));
       float res = max(a, b);
    // res = smoothstep(0.1,0.11 ,res);

       float d = dot(uv, vec2(0., 1.0));
       angle = PI2 / 5. * 2.;
       float e = dot(uv - vec2(0., 0.), vec2(sin(angle), cos(angle)) - vec2(0., 0.));

       float f = max(d, e);

       res = min(res, f);
       res = smoothstep(0.11, 0.1, res);
       return res;
}

float startLayer(vec2 uv) {
       uv *= 2.;
       uv -= vec2(-0.870, 0.450);
       float start1 = start((uv + vec2(0.6, 0.0)) * 1.620);
       float start2 = start((uv + vec2(0.1, 0.4)) * 3.476 * rotate(0.5));
       float start3 = start((uv + vec2(-0.1, 0.2)) * 3.476);
       float start4 = start((uv + vec2(-0.1, -0.1)) * 3.476 * rotate(-0.25));
       float start5 = start((uv + vec2(0.1, -0.3)) * 3.476 * rotate(0.5));
       return start1 + start2 + start3 + start4 + start5;
}

void main() {
       vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
       float i = sin((uv.x * 2.0 + uv.y * 7.0 + sin(uv.x * 2.5 + uv.y * 4.0) - u_time));//模拟震荡函数
       uv *= 1.0 + mix(0., 0.012, i);
       float z = startLayer(uv);//绘制五角星

       vec3 col = vec3(0.8705888, 0.1607, 0.0627);
       vec3 startcol = vec3(1., 0.87, 0.);
       col = mix(col, startcol, z);//上色
       col += i * 0.15;
       gl_FragColor = vec4(col, 1.0);
}