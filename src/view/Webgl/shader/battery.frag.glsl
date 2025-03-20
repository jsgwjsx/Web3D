#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

float sdfBox(in vec2 uv, in vec2 b) {
       vec2 d = abs(uv) - b;
       return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float sdTriangle(in vec2 p, in vec2 p0, in vec2 p1, in vec2 p2) {
       vec2 e0 = p1 - p0, e1 = p2 - p1, e2 = p0 - p2;
       vec2 v0 = p - p0, v1 = p - p1, v2 = p - p2;
    // 分别计算过p点垂直于三条边的向量，箭头指向p点
       vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
       vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
       vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
    // 由于不清楚传入的三个点是顺时针还是逆时针顺序，先确定好基本符号
    // 若s是-1，说明传入是逆时针
    // 假设规定传入都是顺时针顺序，则s为1，可无视
       float s = sign(e0.x * e2.y - e0.y * e2.x);
    // 这里的 d并非具有什么实际几何意义的向量，而是作为一个数据的集合来使用
    // 它的第一个分量d.x表示p点与各边长度的平方中的最小值，它的第二个分量可以用来判断内部外部
    // 假如点P在三角形内部，那么参与比较的三个式子都会是正数，它们中的最小值也将是正数
    // 若在外部，则至少有一个式子是负的，取最小值后d.y也将是负值
       vec2 d = min(min(vec2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)), vec2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))), vec2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x)));
    // 若d.y为负数，说明在三角形外，不要漏看下面一行的负号
       return -sqrt(d.x) * sign(d.y);
}
//创建泛光体
float createColor(float load) {
       return min(step(0.0,load)-step(2.0,load),smoothstep(-0.5,0.5,load));

}

vec3 drawScene(vec2 uv) {
       vec3 col = vec3(0.2);
       float ts = fract(u_time / 8.);

       //绘制外轮廓
       float boxBack = sdfBox(uv, vec2(0.15, 0.32));
       float boxIn = sdfBox(uv, vec2(0.13, 0.30));
       float top = sdfBox(vec2(uv.x, uv.y - 0.32), vec2(0.08, 0.019));
       float contour = max(boxBack, -boxIn);
       float res = min(contour, top);

       //充电形状
       vec2 p1 = vec2(-0.1, -0.15);
       vec2 p2 = vec2(-0.01, -0.15);
       vec2 p3 = vec2(-0.04, 0.125);
       float lighting1 = sdTriangle(vec2(uv.x - 0.02, uv.y - 0.123), p1, p2, p3);
       float lighting2 = sdTriangle(vec2(-uv.x - 0.02, -uv.y - 0.123), p1, p2, p3);
       float lighting = min(lighting1, lighting2);

       float bottomOff = 0.240;
       float heightLoad = 0.055;
       float load1 = sdfBox(vec2(uv.x, uv.y + bottomOff), vec2(0.125, heightLoad));
       float load2 = sdfBox(vec2(uv.x, uv.y + bottomOff - 0.120 * 1.), vec2(0.125, heightLoad));
       float load3 = sdfBox(vec2(uv.x, uv.y + bottomOff - 0.120 * 2.), vec2(0.125, heightLoad));
       float load4 = sdfBox(vec2(uv.x, uv.y + bottomOff - 0.120 * 3.), vec2(0.125, heightLoad));
       float load5 = sdfBox(vec2(uv.x, uv.y + bottomOff - 0.120 * 4.), vec2(0.125, heightLoad));
       if(ts < 0.83) {
              res = min(res, load1);
              res = min(res, load2);
              res = min(res, load3);
              res = min(res, load4);
              res = min(res, load5);
       } else if(ts < 1.) {
              res = min(res, lighting);
       }

       //创建泛光体
       float colorload1 = createColor(load1);
       float colorload2 = createColor(load2);
       float load1Andload2 = min(colorload1, colorload2);
       float colorload3 = createColor(load3);
       float load1Andload2Andload3 = min(load1Andload2, colorload3);
       float colorload4 = createColor(load4);
       float load1Andload2Andload3Andload4 = min(load1Andload2Andload3, colorload4);
       float colorload5 = createColor(load5);
       float load1Andload2Andload3Andload4Andload5 = min(load1Andload2Andload3Andload4, colorload5);

       float d = step(0., res);
       col = mix(vec3(0.), col, d);

       if(ts < 0.17) {
              col = mix(vec3(0., 0., 1.), col, load1Andload2Andload3Andload4Andload5);
       } else if(ts < 0.32) {
              col = mix(vec3(0., 1., 0.), col, load1Andload2Andload3Andload4);
       } else if(ts < 0.5) {
              col = mix(vec3(1., 1., 0.), col, load1Andload2Andload3);
       } else if(ts < 0.67) {
              col = mix(vec3(0.973, 0.611, 1.), col, load1Andload2);
       } else if(ts < 0.83) {
              col = mix(vec3(1., 0., 0.), col, colorload1);
       } else if(ts < 1.) {
              col = col * vec3(0.281, 1.000, 0.746);
       }

       return col;
}

void main() {
       vec2 uv = gl_FragCoord.xy / u_resolution.xy; // <0, 1>
       uv -= 0.5; // <-0.5,0.5>
       uv.x *= u_resolution.x / u_resolution.y; // fix aspect ratio
       vec3 col = drawScene(uv);
       gl_FragColor = vec4(col, 1.0);
}