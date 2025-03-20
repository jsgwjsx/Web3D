import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Helper from './Helper';
export default class CreateTwin {
    constructor(ifhelp=false) {
        this.scene = new THREE.Scene;
        //声明canvas画布的尺寸(单位:px)
        const width = window.innerWidth;  //宽度
        const height = window.innerHeight;  //高度
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 8000)
        this.camera.position.set(1.4, 26.5, 65.7)
        this.camera.lookAt(0, 0, 0)

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,//开启抗锯齿
            logarithmicDepthBuffer: true//开启，来缓解远地方的深度冲突
        });

        this.renderer.setPixelRatio(window.devicePixelRatio)//传递设备像素比，防止模糊
        this.renderer.setSize(width, height)
        this.renderer.render(this.scene, this.camera)
        document.body.appendChild(this.renderer.domElement)



        const draco = new DRACOLoader()
        //DRACOLoader依赖examples\jsm\libs\draco\gltf里面多个解压文件
        draco.setDecoderPath('/draco/')

        this.loader = new GLTFLoader()
        this.loader.setDRACOLoader(draco)

        // function render() {
        //     stats.update()
        //     renderer.render(scene, camera)
        //     window.requestAnimationFrame(render)
        // }
        // render()
        //使用renderer.setAnimationLoop(fun)代替
        this.renderer.setAnimationLoop(() => {
            if(ifhelp){
                this.helper.stats.update()
            }
     
            this.renderer.render(this.scene, this.camera)
        })

        //设置平行光
        this.directionLight = new THREE.DirectionalLight(0xffffff, 1.0, 0.0)
        this.directionLight.position.set(100, 100, 60)
        this.scene.add(this.directionLight)

        //设置controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0)
        this.controls.update()
        //设置环境贴图

        //加载hdr图像，设置为环境贴图
        const rgba = new RGBELoader().load('/model/example/Basic_01/环境tex.hdr', (envMap) => {
            //envMap是texture对象
            this.scene.environment = envMap
            // hdr作为环境贴图生效，设置.mapping为EquirectangularReflectionMapping
            envMap.mapping = THREE.EquirectangularReflectionMapping;
        })
        if(ifhelp){
            this.helper = new Helper(this.scene,this.directionLight)
            this.gui = this.helper.gui
        }
       
        window.onresize = ()=>{
            this.renderer.setSize(window.innerWidth,window.innerHeight)
            this.camera.aspect = window.innerWidth/window.innerHeight
            this.camera.updateProjectionMatrix()
        }



    }

}