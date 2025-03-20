#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

void main() {
        vec2 p = (gl_FragCoord.xy/u_resolution.y);//范围为(0,1)
        p *= 10.;//此时范围为(0,10)

        //ceil向上取整
        vec3 col = vec3(0.0);
        vec2 id  = floor(p);//范围(1,10)
        id.xy /= 10.; //范围为(0.1,1)
        col.xy += id;
        gl_FragColor = vec4(col,1.0);

}