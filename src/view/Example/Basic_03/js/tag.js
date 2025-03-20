import { CSS2DObject,CSS2DRenderer  } from 'three/addons/renderers/CSS2DRenderer.js';


function tag(domID){
    var dom = document.getElementById(domID);
    //dom元素包装为CSS2模型对象CSS2DObject
    var label = new CSS2DObject(dom);
    dom.style.pointerEvents = 'none';//避免HTML标签遮挡三维场景的鼠标事件
    // 设置HTML元素标签在three.js世界坐标中位置
    // label.position.set(x, y, z);
    return label;//返回CSS2模型标签     
}



const css2Renderer = new CSS2DRenderer()
css2Renderer.setSize(window.innerWidth, window.innerHeight)
//将css2rRenderer的canvas画布与，renderer的画布重合，方便标签渲染计算
css2Renderer.domElement.style.position = 'absolute'
css2Renderer.domElement.style.top = '0px'

//指定在什么情况下 (如果有) 某个特定的图形元素可以成为鼠标事件的 target
css2Renderer.domElement.style.pointerEvents = 'none'
document.body.appendChild(css2Renderer.domElement)

export {tag,css2Renderer}