#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
const float PI = 3.1415;
#define NUM_OCTAVES 5

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,4.1414)))
                * 43758.5453);
}


float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    float res =  mix( mix( random(i),random(i+vec2(1.0,0.0)),u.x ),mix( random( i + vec2(0.0,1.0) ),random( i + vec2(1.0,1.0) ), u.x), u.y);
        return res*res;
}

float fbm(vec2 x){
        float v= 0.0;
        float a = 0.5;
        vec2 shift = vec2(100);
        mat2 rot = mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.5));
        for(int i=0;i< NUM_OCTAVES; ++i) {
                v +=a*noise(x);
                x = rot*x*2.0+shift;
                a *=0.5;
        }
        return v;
}

void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);//[-1-1]

        vec3 col = vec3(0.0,0.0,0.0);
        float time = u_time*2.;
        float m = p.x+fbm(p+time);
        
 

        float t2 =abs(1.99/(p.x+fbm(p+time)*100.0));//back
        float t4 =sin(time)<-0.80?abs(1.99/(p.x+fbm(p+time)*100.0)):0.0;//back2
        float t1 = sin(time)<-0.99?abs(1.0/((p.x+fbm(p+time))*100.0)):0.0;//电

        float n = p.y<0.0 ?(sin(length(p.y+p.x*0.2))):0.;
        float t3 = sin(time)<-0.99 ?abs(1.0/((p.x-n+fbm(p+time))*100.0)):0.0;//电

        col = mix(col,vec3(1.0,1.0,1.0),t1);
        col = mix(col,vec3(1.0,1.0,1.0),t2);
        col = mix(col,vec3(1.0,1.0,1.0),t3);
        col = mix(col,vec3(1.0,0.8,1.0),t4);

        gl_FragColor = vec4(col,1.0);
      
       
}