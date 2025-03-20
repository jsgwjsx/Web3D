    attribute vec4 a_Position;
    attribute vec3 a_color;
    uniform float u_time;
    varying vec3 v_color;

        mat4 translate(vec3 v) {
            return mat4(
                1., 0., 0., 0.,
                0., 1., 0., 0.,
                0., 0., 1., 0.,
                v.x, v.y, v.z, 1.
            );
        }

        mat4 scale(vec3 v) {
            return mat4(
                v.x, 0., 0., 0.,
                0., v.y, 0., 0.,
                0., 0., v.z, 0.,
                0., 0., 0., 1.
            );
        }
       
        mat4 rotateZ(float deg) {
            return mat4(
                cos(deg), sin(deg), 0., 0.,
                -sin(deg), cos(deg), 0., 0.,
                0., 0., 1., 0., 
                0., 0., 0., 1.
            );
        }
        
        mat4 rotateX(float deg) {
            return mat4(
                1., 0., 0., 0.,
                0., sin(deg), cos(deg), 0.,
                0., cos(deg), -sin(deg), 0., 
                0., 0., 0., 1.
            );
        }

        mat4 rotateY(float deg) {
            return mat4(
                cos(deg), 0., sin(deg), 0.,
                0., 1., 0., 0.,
                -sin(deg), 0., cos(deg), 0., 
                0., 0., 0., 1.
            );
        }

        void main() {
            gl_Position = scale(vec3(.5)) * translate(vec3(sin(u_time), cos(u_time), 0.)) * rotateX(u_time) * rotateY(u_time) * a_Position;
            gl_PointSize = 1.0;
            v_color = a_color;
        }