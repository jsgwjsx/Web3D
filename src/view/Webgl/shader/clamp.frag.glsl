#ifdef GL_ES
precision mediump float;
#endif
uniform vec3 u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
#define PI 3.14

float sdf_circle(vec2 p, vec2 c, float r) {
        return abs(r - length(p - c));
}

float sdf_line(vec2 p, vec2 a, vec2 b) {
        vec2 ap = p - a;
        vec2 ab = b - a;
        float k = clamp(dot(ap, ab) / dot(ab, ab), 0., 1.);
        return length(ap - k * ab);
}
//旋转角度计算
mat2 rotate(float angle) {
        return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float a2r(float angle) {
        return angle * PI / 180.;
}
void main() {
        vec2 uv = (gl_FragCoord.xy * 2. - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

        float c3 = step(sdf_circle(uv, vec2(0.), .6), .005);
        //rotate旋转角度计算
        float l1 = step(sdf_line(uv, vec2(0.), rotate(u_time.x * a2r(30.) + u_time.y / 60. * a2r(30.)) * vec2(0., .3)), .015);// 时
        float l2 = step(sdf_line(uv, vec2(0.), rotate(u_time.y * a2r(6.) + u_time.z / 60. * a2r(6.)) * vec2(0., .4)), .01);// 分
        float l3 = step(sdf_line(uv, vec2(0.), rotate(u_time.z * a2r(6.)) * vec2(0., .5)), .005);// 秒
        float color = max(max(max( c3, l1), l2), l3);
        gl_FragColor = vec4(vec3(color), 1.);

}