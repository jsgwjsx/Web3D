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
//绘制圆
float circle(vec2 p, float R, vec2 pos) {
        float cir = step(R,length(p-pos));
        float d = exp((-R*0.864)/(length(p-pos)));//[-无穷,0]

        return cir<=0.0?d:1.0;
}
//0,1,互转
float transform(float num) {
        return -num + 1.;
}
void main() {

        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);//[0-1]
        float d1 =circle(p,0.5,vec2(0.0));
        float d2 =circle(p,0.5,vec2(0.2));
        gl_FragColor = vec4(vec3(min(d1,d2)),1.0);
}