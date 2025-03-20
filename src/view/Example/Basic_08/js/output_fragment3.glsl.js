export default /* glsl */`
#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif

// https://github.com/mrdoob/three.js/pull/22425
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha + 0.1;
#endif
vec2 center = vec2(13524750.5, 3664234.75); //中心
float r0 = 10.0+time*1200.0;//光环半径
float w = 100.0;//光环宽度100
float L = distance(vposition.xy,center);

if(L > r0 && L < r0+2.0*w){
    //渐变色光带
    float per = 0.0;
    if(L<r0+w){
        per = (L-r0)/w;
        outgoingLight = mix(outgoingLight, vec3(1.0,1.0,1.0),per);
    }else{
        per = (L-r0-w)/w;
        outgoingLight = mix( vec3(1.0,1.0,1.0),outgoingLight,per);
    }
}

gl_FragColor = vec4( outgoingLight, diffuseColor.a );
`;
