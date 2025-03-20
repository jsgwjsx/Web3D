import { CSS3DObject,CSS3DRenderer  } from 'three/addons/renderers/CSS3DRenderer.js';


function tag(){
   var div = document.createElement('div')
     div.innerHTML = name
     div.style.visibility = 'hidden'
     div.style.padding = '5px 10px'
     div.style.color = '#fff'
     div.style.fontSize = '16px'
     div.style.position = 'absolute'
     div.style.backgroundColor = 'rgba(25,25,25,0.5)'
     div.style.borderRadius = '5px'
     //dom元素包装为CSS2模型对象CSS2DObject
     var label = new CSS3DObject(div);
     div.style.pointerEvents = 'none';//避免HTML标签遮挡三维场景的鼠标事件
     // 设置HTML元素标签在three.js世界坐标中位置
     label.scale.set(0.05,0.05,0.05)
     // label.position.set(x, y, z);
     return label;//返回CSS2模型标签         
}



const css3Renderer = new CSS3DRenderer()
css3Renderer.setSize(window.innerWidth, window.innerHeight)
//将css2rRenderer的canvas画布与，renderer的画布重合，方便标签渲染计算
css3Renderer.domElement.style.position = 'absolute'
css3Renderer.domElement.style.top = '0px'

//指定在什么情况下 (如果有) 某个特定的图形元素可以成为鼠标事件的 target
css3Renderer.domElement.style.pointerEvents = 'none'
document.body.appendChild(css3Renderer.domElement)

export {tag,css3Renderer}