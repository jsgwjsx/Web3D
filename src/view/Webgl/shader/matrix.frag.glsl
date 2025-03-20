  #ifdef GL_ES
precision mediump float;
        #endif

uniform vec2 u_resolution;
varying vec3 v_color;

void main() {
        gl_FragColor = vec4(v_color, .5);
}