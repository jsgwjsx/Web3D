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
float circle(vec2 p,float R, vec2 pos){
        float cir = step(R, length(p - pos));
        return cir;
}
//0,1,互转
float transform(float num){
        return  -num+1.;
}
void main() {
        //step
        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        float d1 = circle(p,0.1,vec2(-0.5,0.3));
        float d2 = circle(p,0.1,vec2(0.5,0.3));
        float r2 = rect(p,vec4(0.8,0.85,-0.7,-0.85));
        float da = transform(d1);
        float db = transform(d2);
        float rb = transform(r2);

        float eye = max(da,db);

        float mouse1 = circle(p,0.5,vec2(0.0,-0.0));
        float mouse2 = circle(p,0.5,vec2(0.0,-0.9));
        float  ear1 = circle(p,0.2,vec2(0.8,0.3));
        float  ear2 = circle(p,0.2,vec2(-0.8,0.3));

        float mouse = transform(max(mouse1,mouse2));
        float ear = min(ear1,ear2);
        float biaoqing = max(eye,mouse);
       gl_FragColor = vec4(vec3(max(min(rb,ear),biaoqing)), 1.0);
        //gl_FragColor = vec4(vec3(ear), 1.0);
}
