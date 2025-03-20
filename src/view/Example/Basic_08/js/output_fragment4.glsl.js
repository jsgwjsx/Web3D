export default /* glsl */`
#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif

// https://github.com/mrdoob/three.js/pull/22425
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha + 0.1;
#endif
vec3 z = vec3(0.,0.,1.);
float f = abs(dot(vnormal,z)); 
float per = 1.0-f;
gl_FragColor = vec4( outgoingLight, diffuseColor.a*per);
`;
