attribute vec3 a_Position;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

mat4 Translate(float tx,float ty,float tz) {
   return mat4(
        vec4(1.0,0.0,0.0,0.0),
        vec4(0.0,1.0,0.0,0.0),
        vec4(0.0,0.0,1.0,0.0),
        vec4(tx,ty,tz,1.0)
   ); 
}
void main(){
    vec4 positon = Translate(sin(u_time),0.0,0.0) * vec4(a_Position,1.0);
    gl_Position=positon;
}