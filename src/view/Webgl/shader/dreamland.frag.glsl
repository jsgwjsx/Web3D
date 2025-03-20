#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
const float PI = 3.1415;
#define NUM_OCTAVES 5

vec3 palette(float t) {
       vec3 a = vec3(0.5, 0.5, 0.5);
       vec3 b = vec3(0.5, 0.5, 0.5);
       vec3 c = vec3(1.0);
       vec3 d = vec3(0.337, 1.000, 0.745);
       return a + b * cos(6.28454 * (c * t + d));
}

void main() {

       vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);//[-1-1]
       vec2 uv1 = uv;
       vec3 fcolor = vec3(0.);
       for(float i = 0.; i < 3.; i++) {
              uv = fract(uv * 2.0) - 0.5;
              float d = length(uv - vec2(0.0));
              float d1 = length(uv1 - vec2(0.0));
              float d2 = length(d * exp(-d1));//d2是通过exp平滑处理后的值
              vec3 color = palette(u_time + d2+i);//根据一个数，生成一个动态的颜色值 
              d -= 0.5;
              d = sin(d * 20. + u_time) / 1.2;
              d -= 0.772;
              d = abs(d);
      // d = smoothstep(0.,0.1,d);
              d = 0.05 / d;
              color *= d;
              fcolor +=color;
       }

       gl_FragColor = vec4(fcolor, 1.0);
}