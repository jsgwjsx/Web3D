<script setup>
import router from '../router';


</script>

<template>
    <el-header class="header" height="60px">
        <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" background-color="#545c64"
            text-color="#fff" active-text-color="#ffd04b" @select="handleSelect" router>
            <el-sub-menu index="1">
                <template #title>
                    Threejs学习
                </template>
             
                <el-sub-menu index="Three1">
                    <template #title>Threejs快速入门</template>
                    <el-menu-item index="/page/01">1.基本构成</el-menu-item>
                    <el-menu-item index="/page/02">2.three的三维空间</el-menu-item>
                    <el-menu-item index="/page/03">3.three光照对物体的影响</el-menu-item>
                    <el-menu-item index="/page/04">4.three相机控制器OrbitControls</el-menu-item>
                    <el-menu-item index="/page/05">5.平行光与环境光</el-menu-item>
                    <el-menu-item index="/page/06">6.动画循环渲染与stats显示帧数</el-menu-item>
                    <el-menu-item index="/page/07">7.画布宽高自适应</el-menu-item>
                    <el-menu-item index="/page/08">8.绘制多个立方体检测性能</el-menu-item>
                    <el-menu-item index="/page/09">9.three中常见的几何体与高光材质</el-menu-item>
                    <el-menu-item index="/page/10">10.Webgl渲染器设置</el-menu-item>
                    <el-menu-item index="/page/11">11.gui.js库的使用</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="Three2">
                    <template #title>
                        几何体BufferGeometry
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/page/12">1.几何体的顶点数据和点模型对象</el-menu-item>
                        <el-menu-item index="/page/13">2.线模型对象</el-menu-item>
                        <el-menu-item index="/page/14">3.面模型对象</el-menu-item>
                        <el-menu-item index="/page/15">4.索引buffer与顶点法向量</el-menu-item>
                        <el-menu-item index="/page/16">5.geometry的仿射变换</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-sub-menu index="Three3">
                    <template #title>
                        模型对象与材质
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/page/17">1.三维向量vec3与模型位置,缩放属性</el-menu-item>
                        <el-menu-item index="/page/18">2.欧拉对象Euler与颜色对象Color</el-menu-item>
                        <el-menu-item index="/page/19">3.模型对象的属性与克隆复制</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-sub-menu index="Three4">
                    <template #title>
                        层级模型
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/page/20">1.组对象group与递归遍历查询模型节点</el-menu-item>
                        <el-menu-item index="/page/21">2.世界坐标与局部坐标</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-sub-menu index="Three5">
                    <template #title>
                        顶点uv坐标与纹理贴图
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/page/22">1.纹理贴图创建与uv坐标定义</el-menu-item>
                        <el-menu-item index="/page/23">2.纹理贴图texture阵列与加载透明贴图</el-menu-item>
                        <el-menu-item index="/page/24">3.uv坐标动画</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-sub-menu index="Three6">
                    <template #title>
                        加载外部模型(gltf)
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/page/25">1.gltf模型导入与webgl编码修改</el-menu-item>
                        <el-menu-item index="/page/26">2.通过递归traverse统一修改模型的材质</el-menu-item>
                        <el-menu-item index="/page/27">3.纹理encoding与渲染器</el-menu-item>
                        <el-menu-item index="/page/28">4.gltf更换颜色贴图</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-sub-menu index="Three7">
                    <template #title>
                        PRB材质与纹理贴图
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/page/29">1.PRB材质金属度和粗糙度</el-menu-item>
                        <el-menu-item index="/page/30">2.scene环境贴图与模型环境贴图</el-menu-item>
                        <el-menu-item index="/page/31">3.MeshPhysicalmaterial材质属性</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-sub-menu index="Three8">
                    <template #title>
                        渲染器与前端ui交互
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/page/32">1.ui界面与3d交互与背景透明</el-menu-item>
                        <el-menu-item index="/page/33">2.three渲染结果保存为图片</el-menu-item>
                        <el-menu-item index="/page/34">3.gltf模型加载进度条</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>

                <el-sub-menu index="Three9">
                    <template #title>
                        curve与几何体
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/page/35">1.生成圆弧顶点</el-menu-item>
                        <el-menu-item index="/page/36">2.Curve生成圆弧顶点绘制圆弧</el-menu-item>
                        <el-menu-item index="/page/37">3.椭圆与圆</el-menu-item>
                        <el-menu-item index="/page/38">4.样条曲线</el-menu-item>
                        <el-menu-item index="/page/39">5.贝塞尔曲线</el-menu-item>
                        <el-menu-item index="/page/40">6.直线与拼接曲线</el-menu-item>
                        <el-menu-item index="/page/41">7.曲线(Tube)路径管道</el-menu-item>
                        <el-menu-item index="/page/42">8.旋转成型(lathe)</el-menu-item>
                        <el-menu-item index="/page/43">9.轮廓填充几何体ShapeGeometry</el-menu-item>
                        <el-menu-item index="/page/44">10.拉伸几何体ExtrudeGeometry</el-menu-item>
                        <el-menu-item index="/page/45">11.轮廓对象shape的使用</el-menu-item>
                        <el-menu-item index="/page/46">12.轮廓对象shape的打孔使用</el-menu-item>
                        <el-menu-item index="/page/47">13.边缘几何体EdgesGeometry</el-menu-item>
                        <el-menu-item index="/page/48">14.attributes中的color属性与颜色渐变</el-menu-item>
                        <el-menu-item index="/page/49">15.山脉地形高度可视化</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-sub-menu index="Three10">
                    <template #title>
                        相机基础
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/page/50">1.正交投影相机与包围盒</el-menu-item>
                        <el-menu-item index="/page/51">2.相机动画</el-menu-item>
                        <el-menu-item index="/page/52">3.不同方向上的投影视图</el-menu-item>
                        <el-menu-item index="/page/53">4.管道漫游</el-menu-item>
                        <el-menu-item index="/page/54">5.聚光源SpotLight</el-menu-item>
                        <el-menu-item index="/page/55">6.平行光模拟太阳进行阴影计算</el-menu-item>
                        <el-menu-item index="/page/56">7.gui控制实现太阳光效果</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-sub-menu index="Three11">
                    <template #title>
                        精灵贴图
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/page/57">1.精灵模型与标注场景</el-menu-item>
                        <el-menu-item index="/page/58">2.精灵模型模拟下雨，下雪</el-menu-item>
                        <el-menu-item index="/page/59">3.后处理基本操作</el-menu-item>
                        <el-menu-item index="/page/60">4.工厂模型设置发光描边</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-sub-menu index="Three12">
                    <template #title>
                        射线拾取模型
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/page/61">1.射线</el-menu-item>
                        <el-menu-item index="/page/62">2.射线拾取模型</el-menu-item>
                        <el-menu-item index="/page/63">3.射线拾取层级模型</el-menu-item>
                        <el-menu-item index="/page/64">4.射线拾取sprite精灵模型控制场景</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-sub-menu index="Three13">
                    <template #title>
                        场景标注标签
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/page/65">1.css2Renderer使用</el-menu-item>
                        <el-menu-item index="/page/66">2.css2Renderer组合应用</el-menu-item>
                        <el-menu-item index="/page/67">3.css3Renderer使用</el-menu-item>
                        <el-menu-item index="/page/68">4.批量创建标签</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-sub-menu index="Three14">
                    <template #title>
                        关键帧动画
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/page/69">1.关键帧动画</el-menu-item>
                        <el-menu-item index="/page/70">2.解析外部模型动画</el-menu-item>
                        <el-menu-item index="/page/71">3.物体变形动画原理</el-menu-item>
                        <el-menu-item index="/page/72">4.人体变形(定制人物)</el-menu-item>
                        <el-menu-item index="/page/73">5.骨骼关节</el-menu-item>
                        <el-menu-item index="/page/74">6.骨骼动画</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-sub-menu index="Three15">
                    <template #title>
                        数学几何计算基础
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/page/75">1.tween.js动画库操作相机相机</el-menu-item>
                        <el-menu-item index="/page/76">2.tween.js配合threejs实现视角移动动画</el-menu-item>
                        <el-menu-item index="/page/77">3.tween.js动画库操作相机相机</el-menu-item>
                        <el-menu-item index="/page/78">4.跟随视线方向平移相机</el-menu-item>
                        <el-menu-item index="/page/79">5.使用vector3进行顶点法线可视化</el-menu-item>
                        <el-menu-item index="/page/80">6.匀速动画</el-menu-item>
                        <el-menu-item index="/page/81">7.物体下落动画(重力加速度)</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-sub-menu index="Three16">
                    <template #title>
                        向量的点乘与叉乘
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/page/82">1.点乘计算三角形夹角</el-menu-item>
                        <el-menu-item index="/page/83">2.点乘判断物体在人前或人后</el-menu-item>
                        <el-menu-item index="/page/84">3.点乘判断物体在扇形里面或外面</el-menu-item>
                        <el-menu-item index="/page/85">4.点乘判断平行向量的方向异同</el-menu-item>
                        <el-menu-item index="/page/86">5.叉乘判断物体在人左还是人右</el-menu-item>
                        <el-menu-item index="/page/87">6.叉乘判断两点是否在线段同侧</el-menu-item>
                        <el-menu-item index="/page/88">7.叉乘计算三角形(Object3D模型)面积</el-menu-item>
                        <el-menu-item index="/page/89">8.叉乘计算点到直线的距离</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>

                <el-sub-menu index="Three17">
                    <template #title>
                        四元数与欧拉角
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/page/90">1.欧拉角Euler改变物体姿态</el-menu-item>
                        <el-menu-item index="/page/91">2.四元数Quaternion改变物体姿态</el-menu-item>
                        <el-menu-item index="/page/92">3.四元数用来表示两个向量的旋转</el-menu-item>
                        <el-menu-item index="/page/93">4.three中的Matrix4</el-menu-item>
                        <el-menu-item index="/page/94">5.模型本地矩阵matrix与世界矩阵matixWorld</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-sub-menu index="Three18">
                    <template #title>
                        cannonjs物理引擎
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/page/95">1.八叉树模型库</el-menu-item>
                        <el-menu-item index="/page/96">2.cannonjs引入模拟乒乓球下落</el-menu-item>
                        <el-menu-item index="/page/97">3.cannonjs引入模拟gltf箱子下落</el-menu-item>
                        <el-menu-item index="/page/98">4.cannonjs与three通过geometry构建凸多面体ConvexPolyhedron</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>

                <el-sub-menu index="Three19">
                    <template #title>
                        Shader使用
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/page/99">1.shaderMaterial</el-menu-item>
                        <el-menu-item index="/page/100">2.Varying插值计算</el-menu-item>
                        <el-menu-item index="/page/101">3.顶点位置插值计算</el-menu-item>
                        <el-menu-item index="/page/102">4.颜色贴图map使用</el-menu-item>
                        <el-menu-item index="/page/103">5.shader传入自定义attribute数据</el-menu-item>
                        <el-menu-item index="/page/104">6.onBeforeCompile修改shader形成光纹效果</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>

   
            </el-sub-menu>
            <el-sub-menu index="2">
                <template #title>Cesium学习</template>
                <el-sub-menu index="Cesium1">
                                <template #title>
                                    Cesium入门
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="/Cesium/01">1.初始化地图</el-menu-item>
                                    <el-menu-item index="/Cesium/02">2.绘制形状(Entity与CZML)</el-menu-item>
                                    <el-menu-item index="/Cesium/03">3.加载并控制3dtiles</el-menu-item>
                                    <el-menu-item index="/Cesium/04">4.材质Material</el-menu-item>
                                    <el-menu-item index="/Cesium/05">5.Camera控制</el-menu-item>
                                    <el-menu-item index="/Cesium/06">6.加载geojson数据</el-menu-item>
                                    <el-menu-item index="/Cesium/07">7.自定义形状-扇形</el-menu-item>
                                    <el-menu-item index="/Cesium/08">8.polyline弧段类型</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="Cesium2">
                                <template #title>
                                    Cesium中级
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="/Cesium/09">1.渐变纹理</el-menu-item>
                                    <el-menu-item index="/Cesium/10">2.四种贴地线</el-menu-item>
                                    <el-menu-item index="/Cesium/11">3.地球纹理</el-menu-item>
                                    <el-menu-item index="/Cesium/12">4.CZML动态路径</el-menu-item>
                                    <el-menu-item index="/Cesium/13">5.Heatmap热力图</el-menu-item>
                                    <el-menu-item index="/Cesium/14">6.鹰眼图</el-menu-item>
                                    <el-menu-item index="/Cesium/15">7.动态纹理-颜色</el-menu-item>
                                    <el-menu-item index="/Cesium/16">8.Entity聚合</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="Cesium3">
                                <template #title>
                                    Cesium高级
                                </template>
                                <el-menu-item-group>
                                    <el-scrollbar height="600px">
                                    <el-menu-item index="/Cesium/17">1.Animation主题</el-menu-item>
                                    <el-menu-item index="/Cesium/18">2.纯色地图</el-menu-item>
                                    <el-menu-item index="/Cesium/19">3.连续飞行</el-menu-item>
                                    <el-menu-item index="/Cesium/20">4.气泡窗口</el-menu-item>
                                    <el-menu-item index="/Cesium/21">5.气泡探窗不受遮挡</el-menu-item>
                                    <el-menu-item index="/Cesium/22">6.Entity选中效果修改</el-menu-item>
                                    <el-menu-item index="/Cesium/23">7.限制地图范围</el-menu-item>
                                    <el-menu-item index="/Cesium/24">8.Primitive类</el-menu-item>
                                    <el-menu-item index="/Cesium/25">9.Primitive自定义形状</el-menu-item>
                                    <el-menu-item index="/Cesium/26">10.ray射线</el-menu-item>
                                    <el-menu-item index="/Cesium/27">11.水面特效</el-menu-item>
                                    <el-menu-item index="/Cesium/28">12.自定义entity与primative动态纹理</el-menu-item>
                                    <el-menu-item index="/Cesium/29">13.在原有的primitive基础上自定义形状</el-menu-item>
                                    <el-menu-item index="/Cesium/30">14.模型Entity与primitive旋转</el-menu-item>
                                    <el-menu-item index="/Cesium/31">15.多个模型朝向一个点</el-menu-item>
                                    <el-menu-item index="/Cesium/32">16.多边形带孔</el-menu-item>
                                    <el-menu-item index="/Cesium/33">17.geojson点样式</el-menu-item>
                                    <el-menu-item index="/Cesium/34">18.Cesium粒子系统</el-menu-item>
                                    <el-menu-item index="/Cesium/35">19.修改运动中物体朝向</el-menu-item>
                                    <el-menu-item index="/Cesium/36">20.流动线</el-menu-item>
                                    <el-menu-item index="/Cesium/37">21.虚线圆</el-menu-item>
                                    <el-menu-item index="/Cesium/38">22.加载arcgis底图</el-menu-item>
                                    <el-menu-item index="/Cesium/39">23.turf进行缓冲区计算</el-menu-item>
                                    <el-menu-item index="/Cesium/40">24.显示多边形内底图</el-menu-item>
                                    <el-menu-item index="/Cesium/41">25.纹理裁剪</el-menu-item>
                                    <el-menu-item index="/Cesium/42">26.彩虹</el-menu-item>
                                    <el-menu-item index="/Cesium/43">27.lookat效果</el-menu-item>
                                    <el-menu-item index="/Cesium/44">28.太极特效</el-menu-item>
                                    <el-menu-item index="/Cesium/45">29.geojson设置水面材质</el-menu-item>
                                    <el-menu-item index="/Cesium/46">30.射线拾取物体</el-menu-item>
                                    <el-menu-item index="/Cesium/47">31.视角跟随</el-menu-item>
                                    <el-menu-item index="/Cesium/48">32.自定义条带状</el-menu-item>
                                    <el-menu-item index="/Cesium/49">33.卫星拍摄效果</el-menu-item>
                                    <el-menu-item index="/Cesium/50">34.立方体自定义纹理</el-menu-item>
                                    <el-menu-item index="/Cesium/51">35.仿three的BufferGrometry示例</el-menu-item>
                                    <el-menu-item index="/Cesium/52">36.仿THREE的Materials/Car示例</el-menu-item>
                                    <el-menu-item index="/Cesium/53">37.多重纹理叠加</el-menu-item>
                                    <el-menu-item index="/Cesium/54">38.根据顶点和垂足两点绘制三角形</el-menu-item>
                                    <el-menu-item index="/Cesium/55">39.根据距离，起点，角度找到目标点(turf)</el-menu-item>
                                    <el-menu-item index="/Cesium/56">40.通过点选获取地形或物体上的位置</el-menu-item>
                                    <el-menu-item index="/Cesium/57">41.LED投射灯效果</el-menu-item>
                                    <el-menu-item index="/Cesium/58">42.根据矢量方向拉伸</el-menu-item>
                                    <el-menu-item index="/Cesium/59">43.彩色文字</el-menu-item>
                                    <el-menu-item index="/Cesium/60">44.动态虚线</el-menu-item>
                                    <el-menu-item index="/Cesium/61">45.发光线颜色修改</el-menu-item>
                                    <el-menu-item index="/Cesium/62">46.闪电</el-menu-item>
                                    <el-menu-item index="/Cesium/63">47.绘制公里网络</el-menu-item>
                                    <el-menu-item index="/Cesium/64">48.顶点着色器改大小</el-menu-item>
                                    <el-menu-item index="/Cesium/65">49.CZML动点连线</el-menu-item>
                                    <el-menu-item index="/Cesium/66">50.道路效果</el-menu-item>
                                    <el-menu-item index="/Cesium/67">51.旗帜模拟效果</el-menu-item>
                                    <el-menu-item index="/Cesium/68">52.polygon随时间变化</el-menu-item>
                                    <el-menu-item index="/Cesium/69">53.模型侧面绘圆</el-menu-item>
                                    <el-menu-item index="/Cesium/70">54.3D雷达</el-menu-item>
                                    <el-menu-item index="/Cesium/71">55.判断点在圆锥内</el-menu-item>
                                    <el-menu-item index="/Cesium/72">56.polylineVolumn重构</el-menu-item>
                                    <el-menu-item index="/Cesium/73">57.动态path添加点线(path)</el-menu-item>
                                    <el-menu-item index="/Cesium/74">58.射线与地球相交</el-menu-item>
                                    <el-menu-item index="/Cesium/75">59.斜线填充多边形</el-menu-item>
                                    <el-menu-item index="/Cesium/76">60.3Dtile风格调整(shader自定义)</el-menu-item>
                                    <el-menu-item index="/Cesium/77">61.两点构建圆锥</el-menu-item>
                                    <el-menu-item index="/Cesium/78">62.gltf模型颜色渐变</el-menu-item>
                                    <el-menu-item index="/Cesium/79">63.视图后处理</el-menu-item>
                                    <el-menu-item index="/Cesium/80">64.视频显示</el-menu-item>
                                    <el-menu-item index="/Cesium/81">65.闪电Plus</el-menu-item>
                                    <el-menu-item index="/Cesium/82">66.视椎体底部坐标</el-menu-item>
                                    <el-menu-item index="/Cesium/83">67.视椎体底部坐标(旋转矩阵获得)</el-menu-item>
                                    <el-menu-item index="/Cesium/84">68.坐标轴</el-menu-item>
                                    <el-menu-item index="/Cesium/85">69.雾</el-menu-item>
                                    <el-menu-item index="/Cesium/86">70.多边形边缘渐变</el-menu-item>
                                    <el-menu-item index="/Cesium/87">71.体渲染</el-menu-item>
                                    <el-menu-item index="/Cesium/88">72.爆炸特效</el-menu-item>
                                    <el-menu-item index="/Cesium/89">73.爆炸特效Plus</el-menu-item>
                                    <el-menu-item index="/Cesium/90">74.显示多个球</el-menu-item>
                                    <el-menu-item index="/Cesium/91">75.显示Turf构成的TIN</el-menu-item>
                                    <el-menu-item index="/Cesium/92">74.entities后处理</el-menu-item>
                                    <el-menu-item index="/Cesium/93">75.动态热力图</el-menu-item>
                                    <el-menu-item index="/Cesium/94">76.发光效果后处理</el-menu-item>
                                    <el-menu-item index="/Cesium/95">77.天空盒</el-menu-item>
                                    <el-menu-item index="/Cesium/96">78.下雨效果</el-menu-item>
                                    <el-menu-item index="/Cesium/97">79.下雪效果</el-menu-item>
                                    <el-menu-item index="/Cesium/98">80.淹没分析</el-menu-item>
                                    <el-menu-item index="/Cesium/99">81.水效果</el-menu-item>
                                    <el-menu-item index="/Cesium/100">82.卷帘效果</el-menu-item>
                                </el-scrollbar>
                                </el-menu-item-group>
                        </el-sub-menu>
            </el-sub-menu>
            <el-sub-menu index="3">
                <template #title>webgl学习</template>
                <el-sub-menu index="webgl1">
                                <template #title>
                                    数学函数
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="/webgl/01">1.abs</el-menu-item>
                                    <el-menu-item index="/webgl/02">2.sign</el-menu-item>
                                    <el-menu-item index="/webgl/03">3.Ceil</el-menu-item>
                                    <el-menu-item index="/webgl/04">4.floor</el-menu-item>
                                    <el-menu-item index="/webgl/05">5.smoothstep</el-menu-item>
                                    <el-menu-item index="/webgl/06">6.step</el-menu-item>
                                    <el-menu-item index="/webgl/07">7.min</el-menu-item>
                                    <el-menu-item index="/webgl/08">8.max</el-menu-item>
                                    <el-menu-item index="/webgl/09">9.mod</el-menu-item>
                                    <el-menu-item index="/webgl/10">10.mix</el-menu-item>
                                    <el-menu-item index="/webgl/11">11.clamp</el-menu-item>
                                    <el-menu-item index="/webgl/12">12.fract</el-menu-item>
                                    <el-menu-item index="/webgl/13">13.radians_and_degree</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="webgl2">
                                <template #title>
                                    三角函数
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="/webgl/14">1.sin_and_cos</el-menu-item>
                                    <el-menu-item index="/webgl/15">2.tan</el-menu-item>
                                    <el-menu-item index="/webgl/16">3.asin_and_acos</el-menu-item>
                                    <el-menu-item index="/webgl/17">4.atan</el-menu-item>
                                    <el-menu-item index="/webgl/18">5.example1</el-menu-item>
                                    <el-menu-item index="/webgl/19">6.example2</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="webgl3">
                                <template #title>
                                    几何函数
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="/webgl/20">1.length_and_distance</el-menu-item>
                                    <el-menu-item index="/webgl/21">2.pow</el-menu-item>
                                    <el-menu-item index="/webgl/22">3.exp</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="webgl4">
                                <template #title>
                                    矢量与矩阵
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="/webgl/23">1.vec</el-menu-item>
                                    <el-menu-item index="/webgl/24">2.tansform</el-menu-item>
                                    <el-menu-item index="/webgl/25">3.rotate</el-menu-item>
                                    <el-menu-item index="/webgl/26">4.scale</el-menu-item>
                                    <el-menu-item index="/webgl/27">5.Matrix</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="webgl5">
                                <template #title>
                                    随机数与分型
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="/webgl/28">1.random</el-menu-item>
                                    <el-menu-item index="/webgl/29">2.噪音</el-menu-item>
                                    <el-menu-item index="/webgl/30">3.分型</el-menu-item>
                                    <el-menu-item index="/webgl/31">4.坐标系模拟</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="webgl6">
                                <template #title>
                                    案例
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="/webgl/32">1.fire</el-menu-item>
                                    <el-menu-item index="/webgl/33">2.雷达扫描</el-menu-item>
                                    <el-menu-item index="/webgl/34">3.幻境</el-menu-item>
                                    <el-menu-item index="/webgl/35">4.五星红旗</el-menu-item>
                                    <el-menu-item index="/webgl/36">5.电池充电</el-menu-item>
                                    <el-menu-item index="/webgl/37">5.大海</el-menu-item>
                                    <el-menu-item index="/webgl/38">6.雨夜</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            
                
            </el-sub-menu >
            <el-menu-item index="/examples">
                案例
            </el-menu-item>
        </el-menu>
    </el-header>
</template>
<style>
.common-layout {
    height: 100%;
    width: 100%;
    position: fixed;
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.header {
    /* background-color: var(--el-color-primary-light-7); */
    line-height: 60px;
    color: var(--el-text-color-primary);
    font-size: 18px;
    position: relative;
    padding: 0;
}

.asider {
    scrollbar-width: none;
}
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: 60%;
}

</style>