#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

        void main(){
            vec2 uv=(gl_FragCoord.xy*2.-u_resolution.xy)/min(u_resolution.x,u_resolution.y);
            float d1 = fract(length(uv-vec2(0.0)));
            float d2 = fract(length(uv-vec2(0.2)));
            float d = d1*d2;
            gl_FragColor = vec4(vec3(d),1.0);
         
        }
        