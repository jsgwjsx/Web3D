#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
 float circle(vec2 uv,vec2 center,float radius,float blur){
            blur+=.0001;
            return smoothstep(radius+blur,radius,distance(uv,center));
        }

        void main(){
            vec2 uv=(gl_FragCoord.xy*2.-u_resolution.xy)/min(u_resolution.x,u_resolution.y);
  
            vec2 uv1 = uv;
            vec2 uv2 = uv;
            uv1.y-=.5;
            uv2.y+=.5;

            vec3 color_sun = vec3(.9451,.9608,.0549);
            vec3 color_water1 = vec3(0.0745, 0.5176, 0.8784);
            vec3 color_water2 = vec3(0.2784, 0.7569, 0.9804);

            float sun = circle(uv1, vec2(0.), .16, 0.);
            float rad = atan(uv1.y/uv1.x)+u_time;
            float t1 = smoothstep(.01, 1.,sin(rad*14.));//角度，设置环的间隔
            float t2 = smoothstep(.01, 1., sin(length(uv1*100.0)));//方块的间隔
            float sun_light =min(t1,t2);

            float y1 = sin(uv2.x*18.+u_time)*.05;
            float water1 = smoothstep(1., .9, uv2.y>y1?1.:y1);

            float y2 = sin(uv2.x*12.+u_time*1.2)*.05;
            float water2 = smoothstep(1., .9, (uv2.y+.1)>y2?1.:y2);

            vec3 color = vec3(0.8314, 0.9176, 0.9412);
            color = mix(color, color_sun, sun);
            color = mix(color, color_sun, sun_light);
            color = mix(color, color_water1, water1);
            color = mix(color, color_water2, water2);

            gl_FragColor = vec4(color, 1.);
        }