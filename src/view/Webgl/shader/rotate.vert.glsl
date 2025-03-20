attribute vec3 a_Position;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

mat4 Rotate(float angle) {
    float s = sin(angle);
    float c = cos(angle); 
   return mat4(
        vec4(c,s,0.0,0.0),
        vec4(-s,c,0.0,0.0),
        vec4(0.0,0.0,1.0,0.0),
        vec4(0.0,0.0,0.0,1.0)
   ); 
}
void main(){
    vec4 positon = Rotate(u_time) * vec4(a_Position,1.0);
    gl_Position=positon;
}