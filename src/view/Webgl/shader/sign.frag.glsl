#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        vec2 m = vec2(u_mouse.x * 2. - 1., -u_mouse.y * 2. + 1.);

        //小日子旗
        // float d = length(p);
        // d=sign(d-0.2);

        // gl_FragColor = vec4(vec3(d)+vec3(0.0,2.0,0.0),1.0);
        float diy = 1.-sign(p.y);
        float dix = 1.-sign(p.x);

        //坐标系分区
        vec3 d = sign(vec3(p,diy*dix));
         gl_FragColor = vec4(d,1.0);

}