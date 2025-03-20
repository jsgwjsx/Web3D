import * as THREE from 'three'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { scene } from './index'
import { tag } from './tag'
import {createFlame} from './flame'

const group = new THREE.Group()

const draco = new DRACOLoader()
//DRACOLoader依赖examples\jsm\libs\draco\gltf里面多个解压文件
draco.setDecoderPath('/draco/')
var granaryArr = [] //所有粮仓模型对象集合
const loader = new GLTFLoader()
loader.setDRACOLoader(draco)
loader.load('/model/example/Basic_03/model.glb', (gltf) => {
    //批量修改材质
    gltf.scene.traverse(function (object) {
      
        if (object.type === 'Mesh') {
            object.material = new THREE.MeshLambertMaterial({
                map: object.material.map,//获取原来材质的颜色贴图属性值
                color: object.material.color,//读取原来材质颜色
            })
        
        }
    })
    var groups = gltf.scene.getObjectByName('粮仓')
    groups.traverse(function(obj){
        if(obj.type === 'Mesh'){
            granaryArr.push(obj)
        }
    })
    group.add(gltf.scene)

    function granaryFlame(name){//name：粮仓名称编号
        var granary = gltf.scene.getObjectByName(name);
        var pos = new THREE.Vector3();
        granary.getWorldPosition(pos);//获取粮仓granary世界坐标设置火焰位置
        var flame = createFlame();//创建一个对象        
        flame.position.copy(pos);
        if (granary.parent.name == "立筒仓") {
            flame.position.y += 36;//加上粮仓顶部高度
        } else if (granary.parent.name == "浅圆仓") {
            flame.position.y += 20;
        } else if (granary.parent.name == "平房仓") {
            flame.position.y += 17;
        }
        flame.position.y += -4;//适当向下偏移
        return flame;
    }

    var P_05Flame = granaryFlame('P_05');//平房仓 P_05
    group.add(P_05Flame);//火焰模型添加到model中
    // 通过定时器测试 火焰熄灭
    // 通过定时器测试 火焰熄灭
    // setTimeout(function(){
    //     P_05Flame.stop();//隐藏火焰模型
    //     model.remove(P_05Flame);//从场景中移出火焰模型对象     
    // },3000);//3秒后火焰熄灭


    // // 假设1秒后Q_05粮仓火灾
    // setTimeout(function () {
    // var Q_05Flame = granaryFlame('Q_05');// 浅圆仓 Q_05
    // model.add(Q_05Flame);//火焰网格模型添加到model中
    // }, 1000);
})

export { group ,granaryArr}