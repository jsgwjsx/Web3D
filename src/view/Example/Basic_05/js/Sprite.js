import * as THREE from 'three'

function CreatePointsTag(){
    var spriteMaterial = new THREE.SpriteMaterial({
        map:new THREE.TextureLoader().load('/光点.png'),
        transparent:true
    })
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(6,6,1)

    // var pos = new THREE.Vector3()
    // obj.getWorldPosition(pos)
    // sprite.position.copy(pos)
    return sprite
}

export {CreatePointsTag}
