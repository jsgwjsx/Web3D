import * as THREE from 'three';
import config from './config'

var R = config.R;//地球半径
var textureLoader = new THREE.TextureLoader()
var texture = textureLoader.load('/model/example/Basic_07/地球光圈.png')
var spriteMaterial = new THREE.SpriteMaterial({
    map:texture,
    transparent:0.5
})
var sprite = new THREE.Sprite(spriteMaterial)
sprite.scale.set(R*3.0,R*3.0,1.0)
export default sprite
