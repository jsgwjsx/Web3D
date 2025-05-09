import * as THREE from 'three';


function createSignalMesh() {
    var texLoad = new THREE.TextureLoader();
    var L = 1;
    var geometry = new THREE.PlaneGeometry(L, 0.6*L);
    geometry.translate(-L / 2, 0, 0);
    geometry.rotateZ(Math.PI / 2);
    var material = new THREE.MeshLambertMaterial({
      map: texLoad.load('/model/example/Basic_08/信号波.png'),
      color: 0xffff00, //设置颜色
      transparent: true, //允许透明计算
      side: THREE.DoubleSide,
    });
    
    var plane = new THREE.Mesh(geometry, material);
    plane.rotateX(Math.PI / 3)
    
    // 波动动画
    var S= 1000;//波动范围倍数设置
    var _s = 1;
    function animation() {
      _s += 20;
      plane.scale.set(_s, _s,  _s);
      if (_s <= S*0.2) {
          material.opacity = (_s - 1) /(S*0.2-1);//保证透明度在0~1之间变化
      } else if (_s > S*0.2 && _s <= S) {
          material.opacity = 1 - (_s - S*0.2) /(S - S*0.2);//保证透明度在0~1之间变化
      } else {
          _s = 1.0;
      }
      requestAnimationFrame(animation);
    }
    animation();
    
    return plane;
}
export {
    createSignalMesh
};