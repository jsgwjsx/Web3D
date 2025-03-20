import * as THREE from 'three'

var textureCube = new THREE.CubeTextureLoader()
  .setPath('/model/example/Basic_05/envMap/')
  .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg',])
  textureCube.encoding = THREE.sRGBEncoding; //设置纹理贴图编码方式和WebGL渲染器一致

function SetCarMaterial(gltf){

    gltf.scene.traverse(function (object){
        if(object.type === 'Mesh'){
          if(object.name.slice(0,4) == '高光金属'){
            object.material = new THREE.MeshStandardMaterial({
              color:object.material.color,
              metalness:0.8,
              roughness:0.2
            })
          }
          if(object.name.slice(0,3) == '后视镜'){
            object.material = new THREE.MeshStandardMaterial({
              color:0x000000,
              metalness:1,
              roughness:0,
              envMapIntensity:1.2
            })
          }
          if(object.name.slice(0,2)=='外壳'){
            object.material = new THREE.MeshPhysicalMaterial({
              color:object.material.color,
              clearcoat:1,
              clearcoatRoughness:0.024,
              metalness:0.5,
              roughness:0.43,
              envMapIntensity:2.8
            })
          }
          if(object.name.slice(0,2)=='玻璃'){
            console.log(object.name)
            object.material = new THREE.MeshPhysicalMaterial({
              color:0xffffff,
              metalness:0,
              roughness:0,
              transparent:true,
              transmission:1,
              envMapIntensity:0,
            })
          }
          object.material.envMap = textureCube
        }
      })
    
}

export {
    SetCarMaterial
}