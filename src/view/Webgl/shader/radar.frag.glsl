#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
const float PI = 3.1415;
#define NUM_OCTAVES 5

#define NUM_OCTAVES 5

mat2 rotate(float angle) {
        return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
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
        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);//[-1-1]
        p = p * rotate(-u_time);
        vec2 startdir = vec2(0.5);
        float a = line(p, vec2(0., 0.), startdir, 0.0001, 0.0001);
     //使用点乘判断与初始点的弧度
        float d = acos(dot(normalize(startdir), normalize(p.xy)));
     //使用叉乘判断前进方向
        vec3 cross1 = normalize(cross(vec3(startdir, 0.0), vec3(0.0, 0.4, 0.0)));
        vec3 cross2 = normalize(cross(vec3(startdir, 0.0), vec3(p.xy, 0.0)));
        float dis = distance(cross1, -cross2);

        float circle = smoothstep(0.01,0.,length(p.xy)-0.72)-smoothstep(0.01,0.,length(p.xy)-0.7);
        vec3 col = vec3(0.0, 0.0, 0.0);
        col = mix(col, vec3(1.0, 0.0, 0.0), a);
        col = mix(col,vec3(1.0, 0.0, 0.0), circle);
        gl_FragColor = vec4(col, 1.);
        if(d < radians(60.) && dis <= 1.0 && distance(vec2(0., 0.), p.xy) < distance(vec2(0., 0.), startdir)) {
                gl_FragColor = vec4(1.0 - d, 0., 0., 1.);
        }
}