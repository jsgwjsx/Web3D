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
                                    <el-menu-item index="58">42.根据矢量方向拉伸面</el-menu-item>
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
