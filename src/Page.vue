<template>
    <div class="common-layout">
        <el-container direction="vertical">
               <TopBar/>
            <el-container>
                <el-aside width="200px" style="height: calc(100%-61px)">
                    <el-scrollbar height="600px" class="asider">
                        <el-menu unique-opened router>
                            <el-sub-menu index="1">
                                <template #title>
                                    Threejs快速入门
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="01">1.基本构成</el-menu-item>
                                    <el-menu-item index="02">2.three的三维空间</el-menu-item>
                                    <el-menu-item index="03">3.three光照对物体的影响</el-menu-item>
                                    <el-menu-item index="04">4.three相机控制器OrbitControls</el-menu-item>
                                    <el-menu-item index="05">5.平行光与环境光</el-menu-item>
                                    <el-menu-item index="06">6.动画循环渲染与stats显示帧数</el-menu-item>
                                    <el-menu-item index="07">7.画布宽高自适应</el-menu-item>
                                    <el-menu-item index="08">8.绘制多个立方体检测性能</el-menu-item>
                                    <el-menu-item index="09">9.three中常见的几何体与高光材质</el-menu-item>
                                    <el-menu-item index="10">10.Webgl渲染器设置</el-menu-item>
                                    <el-menu-item index="11">11.gui.js库的使用</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="2">
                                <template #title>
                                    几何体BufferGeometry
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="12">1.几何体的顶点数据和点模型对象</el-menu-item>
                                    <el-menu-item index="13">2.线模型对象</el-menu-item>
                                    <el-menu-item index="14">3.面模型对象</el-menu-item>
                                    <el-menu-item index="15">4.索引buffer与顶点法向量</el-menu-item>
                                    <el-menu-item index="16">5.geometry的仿射变换</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="3">
                                <template #title>
                                    模型对象与材质
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="17">1.三维向量vec3与模型位置,缩放属性</el-menu-item>
                                    <el-menu-item index="18">2.欧拉对象Euler与颜色对象Color</el-menu-item>
                                    <el-menu-item index="19">3.模型对象的属性与克隆复制</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="4">
                                <template #title>
                                    层级模型
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="20">1.组对象group与递归遍历查询模型节点</el-menu-item>
                                    <el-menu-item index="21">2.世界坐标与局部坐标</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="5">
                                <template #title>
                                    顶点uv坐标与纹理贴图
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="22">1.纹理贴图创建与uv坐标定义</el-menu-item>
                                    <el-menu-item index="23">2.纹理贴图texture阵列与加载透明贴图</el-menu-item>
                                    <el-menu-item index="24">3.uv坐标动画</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="6">
                                <template #title>
                                    加载外部模型(gltf)
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="25">1.gltf模型导入与webgl编码修改</el-menu-item>
                                    <el-menu-item index="26">2.通过递归traverse统一修改模型的材质</el-menu-item>
                                    <el-menu-item index="27">3.纹理encoding与渲染器</el-menu-item>
                                    <el-menu-item index="28">4.gltf更换颜色贴图</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="7">
                                <template #title>
                                    PRB材质与纹理贴图
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="29">1.PRB材质金属度和粗糙度</el-menu-item>
                                    <el-menu-item index="30">2.scene环境贴图与模型环境贴图</el-menu-item>
                                    <el-menu-item index="31">3.MeshPhysicalmaterial材质属性</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="8">
                                <template #title>
                                    渲染器与前端ui交互
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="32">1.ui界面与3d交互与背景透明</el-menu-item>
                                    <el-menu-item index="33">2.three渲染结果保存为图片</el-menu-item>
                                    <el-menu-item index="34">3.gltf模型加载进度条</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>

                            <el-sub-menu index="9">
                                <template #title>
                                    curve与几何体
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="35">1.生成圆弧顶点</el-menu-item>
                                    <el-menu-item index="36">2.Curve生成圆弧顶点绘制圆弧</el-menu-item>
                                    <el-menu-item index="37">3.椭圆与圆</el-menu-item>
                                    <el-menu-item index="38">4.样条曲线</el-menu-item>
                                    <el-menu-item index="39">5.贝塞尔曲线</el-menu-item>
                                    <el-menu-item index="40">6.直线与拼接曲线</el-menu-item>
                                    <el-menu-item index="41">7.曲线(Tube)路径管道</el-menu-item>
                                    <el-menu-item index="42">8.旋转成型(lathe)</el-menu-item>
                                    <el-menu-item index="43">9.轮廓填充几何体ShapeGeometry</el-menu-item>
                                    <el-menu-item index="44">10.拉伸几何体ExtrudeGeometry</el-menu-item>
                                    <el-menu-item index="45">11.轮廓对象shape的使用</el-menu-item>
                                    <el-menu-item index="46">12.轮廓对象shape的打孔使用</el-menu-item>
                                    <el-menu-item index="47">13.边缘几何体EdgesGeometry</el-menu-item>
                                    <el-menu-item index="48">14.attributes中的color属性与颜色渐变</el-menu-item>
                                    <el-menu-item index="49">15.山脉地形高度可视化</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="10">
                                <template #title>
                                    相机基础
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="50">1.正交投影相机与包围盒</el-menu-item>
                                    <el-menu-item index="51">2.相机动画</el-menu-item>
                                    <el-menu-item index="52">3.不同方向上的投影视图</el-menu-item>
                                    <el-menu-item index="53">4.管道漫游</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="11">
                                <template #title>
                                    光源与阴影
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="54">1.聚光源SpotLight</el-menu-item>
                                    <el-menu-item index="55">2.平行光模拟太阳进行阴影计算</el-menu-item>
                                    <el-menu-item index="56">3.gui控制实现太阳光效果</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="12">
                                <template #title>
                                    精灵贴图
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="57">1.精灵模型与标注场景</el-menu-item>
                                    <el-menu-item index="58">2.精灵模型模拟下雨，下雪</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="13">
                                <template #title>
                                    后处理EffectComposer
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="59">1.后处理基本操作</el-menu-item>
                                    <el-menu-item index="60">2.工厂模型设置发光描边</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="14">
                                <template #title>
                                    射线拾取模型
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="61">1.射线</el-menu-item>
                                    <el-menu-item index="62">2.射线拾取模型</el-menu-item>
                                    <el-menu-item index="63">3.射线拾取层级模型</el-menu-item>
                                    <el-menu-item index="64">4.射线拾取sprite精灵模型控制场景</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="15">
                                <template #title>
                                    场景标注标签
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="65">1.css2Renderer使用</el-menu-item>
                                    <el-menu-item index="66">2.css2Renderer组合应用</el-menu-item>
                                    <el-menu-item index="67">3.css3Renderer使用</el-menu-item>
                                    <el-menu-item index="68">4.批量创建标签</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="16">
                                <template #title>
                                    关键帧动画
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="69">1.关键帧动画</el-menu-item>
                                    <el-menu-item index="70">2.解析外部模型动画</el-menu-item>
                                    <el-menu-item index="71">3.物体变形动画原理</el-menu-item>
                                    <el-menu-item index="72">4.人体变形(定制人物)</el-menu-item>
                                    <el-menu-item index="73">5.骨骼关节</el-menu-item>
                                    <el-menu-item index="74">6.骨骼动画</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="17">
                                <template #title>
                                    tweenjs动画库
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="75">1.tween.js动画库操作相机相机</el-menu-item>
                                    <el-menu-item index="76">2.tween.js配合threejs实现视角移动动画</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="18">
                                <template #title>
                                    数学几何计算基础
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="77">1.tween.js动画库操作相机相机</el-menu-item>
                                    <el-menu-item index="78">2.跟随视线方向平移相机</el-menu-item>
                                    <el-menu-item index="79">3.使用vector3进行顶点法线可视化</el-menu-item>
                                    <el-menu-item index="80">4.匀速动画</el-menu-item>
                                    <el-menu-item index="81">5.物体下落动画(重力加速度)</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="19">
                                <template #title>
                                    向量的点乘与叉乘
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="82">1.点乘计算三角形夹角</el-menu-item>
                                    <el-menu-item index="83">2.点乘判断物体在人前或人后</el-menu-item>
                                    <el-menu-item index="84">3.点乘判断物体在扇形里面或外面</el-menu-item>
                                    <el-menu-item index="85">4.点乘判断平行向量的方向异同</el-menu-item>
                                    <el-menu-item index="86">5.叉乘判断物体在人左还是人右</el-menu-item>
                                    <el-menu-item index="87">6.叉乘判断两点是否在线段同侧</el-menu-item>
                                    <el-menu-item index="88">7.叉乘计算三角形(Object3D模型)面积</el-menu-item>
                                    <el-menu-item index="89">8.叉乘计算点到直线的距离</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>

                            <el-sub-menu index="20">
                                <template #title>
                                    四元数与欧拉角
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="90">1.欧拉角Euler改变物体姿态</el-menu-item>
                                    <el-menu-item index="91">2.四元数Quaternion改变物体姿态</el-menu-item>
                                    <el-menu-item index="92">2.四元数用来表示两个向量的旋转</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>

                            <el-sub-menu index="21">
                                <template #title>
                                    Matrix矩阵
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="93">1.three中的Matrix4</el-menu-item>
                                    <el-menu-item index="94">1.模型本地矩阵matrix与世界矩阵matixWorld</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>

                            <el-sub-menu index="22">
                                <template #title>
                                    Octree扩展库
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="95">1.八叉树模型库</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>

                            <el-sub-menu index="23">
                                <template #title>
                                    cannonjs物理引擎
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="96">1.cannonjs引入模拟乒乓球下落</el-menu-item>
                                    <el-menu-item index="97">2.cannonjs引入模拟gltf箱子下落</el-menu-item>
                                    <el-menu-item index="98">3.cannonjs与three通过geometry构建凸多面体ConvexPolyhedron</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>

                            <el-sub-menu index="24">
                                <template #title>
                                    Shader使用
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="99">1.shaderMaterial</el-menu-item>
                                    <el-menu-item index="100">2.Varying插值计算</el-menu-item>
                                    <el-menu-item index="101">3.顶点位置插值计算</el-menu-item>
                                    <el-menu-item index="102">4.颜色贴图map使用</el-menu-item>
                                    <el-menu-item index="103">5.shader传入自定义attribute数据</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>

                            <el-sub-menu index="25">
                                <template #title>
                                    onBeforeCompile使用
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="104">1.onBeforeCompile修改shader形成光纹效果</el-menu-item>
                                  
                                </el-menu-item-group>
                            </el-sub-menu>
                        </el-menu>
                    </el-scrollbar>
                </el-aside>

                <el-container>
                    <el-main>
                        <router-view></router-view>
                    </el-main>
                </el-container>

            </el-container>
        </el-container>
    </div>
</template>
<script setup>
import TopBar from './components/Tapbar.vue';
</script>

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
    background-color: var(--el-color-primary-light-7);
    line-height: 60px;
    color: var(--el-text-color-primary);
    font-size: 18px;
}

.asider {
    scrollbar-width: none;
}
</style>
