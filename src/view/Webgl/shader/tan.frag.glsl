#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

float step_filte(float val1,float val2){
        return step(val1,val2)-step(val1+0.5,val2);//停止t渐变，在0.4~1.4的段内返回1，在其他段内返回0
}
//step(0.4,x)-step(1.4,x)

void main() {

        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);//[-1,1]
        vec3 color = vec3(0.);
        vec3 color2 = vec3(0.0,1.,1.0);
        float angle = atan(uv.y,uv.x );
        float t = tan(angle*10.);
        float d = length(uv)-0.8;
        //在t>1时，为color2，t<0时，为color1,t在0，1，之间时，为两者混合，当在0.4-1.4时，为1.0，
        color = d<0.0?mix(color,color2,step_filte(0.4,t )):vec3(1.0);
        gl_FragColor = vec4(color,1.0);
       
}