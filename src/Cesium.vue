<template>
    <div class="common-layout">
        <el-container direction="vertical">
            <TopBar />
            <el-container>
                <el-aside width="200px" style="height: calc(100%-61px); position: absolute;">
                    <el-scrollbar  class="asider" height="600px"> 
                        <el-menu unique-opened router>
                            <el-sub-menu index="1">
                                <template #title>
                                    Cesium入门
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="01">1.初始化地图</el-menu-item>
                                    <el-menu-item index="02">2.绘制形状(Entity与CZML)</el-menu-item>
                                    <el-menu-item index="03">3.加载并控制3dtiles</el-menu-item>
                                    <el-menu-item index="04">4.材质Material</el-menu-item>
                                    <el-menu-item index="05">5.Camera控制</el-menu-item>
                                    <el-menu-item index="06">6.加载geojson数据</el-menu-item>
                                    <el-menu-item index="07">7.自定义形状-扇形</el-menu-item>
                                    <el-menu-item index="08">8.polyline弧段类型</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="2">
                                <template #title>
                                    Cesium中级
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="09">1.渐变纹理</el-menu-item>
                                    <el-menu-item index="10">2.四种贴地线</el-menu-item>
                                    <el-menu-item index="11">3.地球纹理</el-menu-item>
                                    <el-menu-item index="12">4.CZML动态路径</el-menu-item>
                                    <el-menu-item index="13">5.Heatmap热力图</el-menu-item>
                                    <el-menu-item index="14">6.鹰眼图</el-menu-item>
                                    <el-menu-item index="15">7.动态纹理-颜色</el-menu-item>
                                    <el-menu-item index="16">8.Entity聚合</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="3">
                                <template #title>
                                    Cesium高级
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="17">1.Animation主题</el-menu-item>
                                    <el-menu-item index="18">2.纯色地图</el-menu-item>
                                    <el-menu-item index="19">3.连续飞行</el-menu-item>
                                    <el-menu-item index="20">4.气泡窗口</el-menu-item>
                                    <el-menu-item index="21">5.气泡探窗不受遮挡</el-menu-item>
                                    <el-menu-item index="22">6.Entity选中效果修改</el-menu-item>
                                    <el-menu-item index="23">7.限制地图范围</el-menu-item>
                                    <el-menu-item index="24">8.Primitive类</el-menu-item>
                                    <el-menu-item index="25">9.Primitive自定义形状</el-menu-item>
                                    <el-menu-item index="26">10.ray射线</el-menu-item>
                                    <el-menu-item index="27">11.水面特效</el-menu-item>
                                    <el-menu-item index="28">12.自定义entity与primative动态纹理</el-menu-item>
                                    <el-menu-item index="29">13.在原有的primitive基础上自定义形状</el-menu-item>
                                    <el-menu-item index="30">14.模型Entity与primitive旋转</el-menu-item>
                                    <el-menu-item index="31">15.多个模型朝向一个点</el-menu-item>
                                    <el-menu-item index="32">16.多边形带孔</el-menu-item>
                                    <el-menu-item index="33">17.geojson点样式</el-menu-item>
                                    <el-menu-item index="34">18.Cesium粒子系统</el-menu-item>
                                    <el-menu-item index="35">19.修改运动中物体朝向</el-menu-item>
                                    <el-menu-item index="36">20.流动线</el-menu-item>
                                    <el-menu-item index="37">21.虚线圆</el-menu-item>
                                    <el-menu-item index="38">22.加载arcgis底图</el-menu-item>
                                    <el-menu-item index="39">23.turf进行缓冲区计算</el-menu-item>
                                    <el-menu-item index="40">24.显示多边形内底图</el-menu-item>
                                    <el-menu-item index="41">25.纹理裁剪</el-menu-item>
                                    <el-menu-item index="42">26.彩虹</el-menu-item>
                                    <el-menu-item index="43">27.lookat效果</el-menu-item>
                                    <el-menu-item index="44">28.太极特效</el-menu-item>
                                    <el-menu-item index="45">29.geojson设置水面材质</el-menu-item>
                                    <el-menu-item index="46">30.射线拾取物体</el-menu-item>
                                    <el-menu-item index="47">31.视角跟随</el-menu-item>
                                    <el-menu-item index="48">32.自定义条带状</el-menu-item>
                                    <el-menu-item index="49">33.卫星拍摄效果</el-menu-item>
                                    <el-menu-item index="50">34.立方体自定义纹理</el-menu-item>
                                    <el-menu-item index="51">35.仿three的BufferGrometry示例</el-menu-item>
                                    <el-menu-item index="52">36.仿THREE的Materials/Car示例</el-menu-item>
                                    <el-menu-item index="53">37.多重纹理叠加</el-menu-item>
                                    <el-menu-item index="54">38.根据顶点和垂足两点绘制三角形</el-menu-item>
                                    <el-menu-item index="55">39.根据距离，起点，角度找到目标点(turf)</el-menu-item>
                                    <el-menu-item index="56">40.通过点选获取地形或物体上的位置</el-menu-item>
                                    <el-menu-item index="57">41.LED投射灯效果</el-menu-item>
                                    <el-menu-item index="58">42.根据矢量方向拉伸</el-menu-item>
                                    <el-menu-item index="59">43.彩色文字</el-menu-item>
                                    <el-menu-item index="60">44.动态虚线</el-menu-item>
                                    <el-menu-item index="61">45.发光线颜色修改</el-menu-item>
                                    <el-menu-item index="62">46.闪电</el-menu-item>
                                    <el-menu-item index="63">47.绘制公里网络</el-menu-item>
                                    <el-menu-item index="64">48.顶点着色器改大小</el-menu-item>
                                    <el-menu-item index="65">49.CZML动点连线</el-menu-item>
                                    <el-menu-item index="66">50.道路效果</el-menu-item>
                                    <el-menu-item index="67">51.旗帜模拟效果</el-menu-item>
                                    <el-menu-item index="68">52.polygon随时间变化</el-menu-item>
                                    <el-menu-item index="69">53.模型侧面绘圆</el-menu-item>
                                    <el-menu-item index="70">54.3D雷达</el-menu-item>
                                    <el-menu-item index="71">55.判断点在圆锥内</el-menu-item>
                                    <el-menu-item index="72">56.polylineVolumn重构</el-menu-item>
                                    <el-menu-item index="73">57.动态path添加点线(path)</el-menu-item>
                                    <el-menu-item index="74">58.射线与地球相交</el-menu-item>
                                    <el-menu-item index="75">59.斜线填充多边形</el-menu-item>
                                    <el-menu-item index="76">60.3Dtile风格调整(shader自定义)</el-menu-item>
                                    <el-menu-item index="77">61.两点构建圆锥</el-menu-item>
                                    <el-menu-item index="78">62.gltf模型颜色渐变</el-menu-item>
                                    <el-menu-item index="79">63.视图后处理</el-menu-item>
                                    <el-menu-item index="80">64.视频显示</el-menu-item>
                                    <el-menu-item index="81">65.闪电Plus</el-menu-item>
                                    <el-menu-item index="82">66.视椎体底部坐标</el-menu-item>
                                    <el-menu-item index="83">67.视椎体底部坐标(旋转矩阵获得)</el-menu-item>
                                    <el-menu-item index="84">68.坐标轴</el-menu-item>
                                    <el-menu-item index="85">69.雾</el-menu-item>
                                    <el-menu-item index="86">70.多边形边缘渐变</el-menu-item>
                                    <el-menu-item index="87">71.体渲染</el-menu-item>
                                    <el-menu-item index="88">72.爆炸特效</el-menu-item>
                                    <el-menu-item index="89">73.爆炸特效Plus</el-menu-item>
                                    <el-menu-item index="90">74.显示多个球</el-menu-item>
                                    <el-menu-item index="91">75.显示Turf构成的TIN</el-menu-item>
                                    <el-menu-item index="92">74.entities后处理</el-menu-item>
                                    <el-menu-item index="93">75.动态热力图</el-menu-item>
                                    <el-menu-item index="94">76.发光效果后处理</el-menu-item>
                                    <el-menu-item index="95">77.天空盒</el-menu-item>
                                    <el-menu-item index="96">78.下雨效果</el-menu-item>
                                    <el-menu-item index="97">79.下雪效果</el-menu-item>
                                    <el-menu-item index="98">80.淹没分析</el-menu-item>
                                    <el-menu-item index="99">81.水效果</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                        </el-menu>
                    </el-scrollbar>
                </el-aside>
                <el-container>
                    <el-main style="position: absolute;left: 200px;right: 0;top: 60px;">
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
<style scoped>
.common-layout:deep(.el-main) {
    height: 800px;
    overflow: auto;
    scrollbar-width: thin;
    scrollbar-color: grey transparent;

}

/* 隐藏滚动条 */
.common-layout:deep(.el-main::-webkit-scrollbar) {
    width: 10px;
    height: 10px;
    background-color: grey;
    border-radius: 5px;

}
</style>
