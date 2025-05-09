export default /* glsl */`
#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif

// https://github.com/mrdoob/three.js/pull/22425
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha + 0.1;
#endif
diffuseColor.a=diffuseColor.a*mix(1.0,0.0,vposition.z/20.);
gl_FragColor = vec4( outgoingLight, diffuseColor.a );
`;
