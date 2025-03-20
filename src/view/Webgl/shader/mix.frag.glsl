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
        float cir = step(R, length(p - pos));
        return cir;
}
//0,1,互转
float transform(float num) {
        return -num + 1.;
}
void main() {

        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);//[0-1]
        // //颜色渐变
        // vec3 color = vec3(0.);
        // vec3 color1 = vec3(0.383,1.000,0.914);
        // vec3 color2 = vec3(0.956,1.000,0.427);
        // vec3 pet = vec3(p.x);
        // color = mix(color1,color2,pet);

        // gl_FragColor = vec4(color,1.0);

        //圆的颜色混合
        float c1 =sign(length(p) - 0.2);
        float c2 = sign(length(p - 0.2) - 0.2);
        float inter = max(c1,c2);
        float area = max(c1,c2);
        float pet = 0.5;
        vec3 color1 =  0.5 + 0.5*cos(u_time+p.xyx+vec3(0,2,4));
        vec3 color2 =  0.5*cos(u_time+p.xyx+vec3(0,2,4));;
        vec3 col = mix(color1,color2,pet);
        if(inter<0.){
        gl_FragColor = vec4(col, 1.);
        return ;
        }
        if(c1<0.){
        gl_FragColor = vec4(color1, 1.);
        return;
        }
        if(c2<0.){
        gl_FragColor = vec4(color2, 1.);
        return ;
        }
        gl_FragColor = vec4(0.0,0.0,0.0,1.);//背景颜色
}