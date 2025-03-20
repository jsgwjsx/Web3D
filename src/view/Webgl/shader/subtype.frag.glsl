#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
const float PI = 3.1415;
#define NUM_OCTAVES 5

//hsv转rgb
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);//[-1-1]
        int j = 0;
        vec2 x = p+vec2(-0.5,0.0);
        float y = 1.5;
        vec2 z = vec2(0.0,0.0);
        for(int i = 0;i<120;i++){
                j++;
                if(length(z)>2.0){break;}
                z = vec2(z.x*z.x-z.y*z.y,2.0*z.x*z.y)+x;

        }
        vec3 rgb = hsv2rgb(vec3(0.9,1.0,1.0));
        float t = float(j)/120.;
        gl_FragColor = vec4(rgb*t,1.0);

       

      
       
}