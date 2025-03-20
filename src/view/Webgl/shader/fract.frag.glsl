#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

vec2 MovingCeil(vec2 uv) {
        float time = u_time *0.2;
        if(fract(time) > 0.5) {//[-0.5,0.5]
                if(fract(uv.y*0.5) > 0.5) {
                        uv.x += fract(time) * 2.;
                } else {
                        uv.x -= fract(time) * 2.;
                }
        } else {
                if(fract(uv.x*0.5) > 0.5) {
                        uv.y += fract(time) * 2.0;

                } else {
                        uv.y -= fract(time) * 2.0;
                }
        }
        return uv;
}

void main() {

        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);//[-1,1]
        uv *= 5.;//范围[-10,10]
        vec3 col = vec3(0.);
        uv = MovingCeil(uv);//[0,1]
        uv = fract(uv)-0.5;
        float d = length(uv);
        col += smoothstep(0.3,0.28 ,d );
        gl_FragColor=vec4(col,1.0);
}