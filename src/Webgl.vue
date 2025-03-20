<template>
    <div class="common-layout">
        <el-container direction="vertical">
            <TopBar />
            <el-container>
                <el-aside width="200px" style="height: calc(100%-61px); position: absolute;">
                    <el-scrollbar height="600px" class="asider">
                        <el-menu unique-opened router>
                            <el-sub-menu index="1">
                                <template #title>
                                    数学函数
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="01">1.abs</el-menu-item>
                                    <el-menu-item index="02">2.sign</el-menu-item>
                                    <el-menu-item index="03">3.Ceil</el-menu-item>
                                    <el-menu-item index="04">4.floor</el-menu-item>
                                    <el-menu-item index="05">5.smoothstep</el-menu-item>
                                    <el-menu-item index="06">6.step</el-menu-item>
                                    <el-menu-item index="07">7.min</el-menu-item>
                                    <el-menu-item index="08">8.max</el-menu-item>
                                    <el-menu-item index="09">9.mod</el-menu-item>
                                    <el-menu-item index="10">10.mix</el-menu-item>
                                    <el-menu-item index="11">11.clamp</el-menu-item>
                                    <el-menu-item index="12">12.fract</el-menu-item>
                                    <el-menu-item index="13">13.radians_and_degree</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="2">
                                <template #title>
                                    三角函数
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="14">1.sin_and_cos</el-menu-item>
                                    <el-menu-item index="15">2.tan</el-menu-item>
                                    <el-menu-item index="16">3.asin_and_acos</el-menu-item>
                                    <el-menu-item index="17">4.atan</el-menu-item>
                                    <el-menu-item index="18">5.example1</el-menu-item>
                                    <el-menu-item index="19">6.example2</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="3">
                                <template #title>
                                    几何函数
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="20">1.length_and_distance</el-menu-item>
                                    <el-menu-item index="21">2.pow</el-menu-item>
                                    <el-menu-item index="22">3.exp</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="4">
                                <template #title>
                                    矢量与矩阵
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="23">1.vec</el-menu-item>
                                    <el-menu-item index="24">2.tansform</el-menu-item>
                                    <el-menu-item index="25">3.rotate</el-menu-item>
                                    <el-menu-item index="26">4.scale</el-menu-item>
                                    <el-menu-item index="27">5.Matrix</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="5">
                                <template #title>
                                    随机数与分型
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="28">1.random</el-menu-item>
                                    <el-menu-item index="29">2.噪音</el-menu-item>
                                    <el-menu-item index="30">3.分型</el-menu-item>
                                    <el-menu-item index="31">4.坐标系模拟</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                            <el-sub-menu index="6">
                                <template #title>
                                    案例
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="32">1.fire</el-menu-item>
                                    <el-menu-item index="33">2.雷达扫描</el-menu-item>
                                    <el-menu-item index="34">3.幻境</el-menu-item>
                                    <el-menu-item index="35">4.五星红旗</el-menu-item>
                                    <el-menu-item index="36">5.电池充电</el-menu-item>
                                    <el-menu-item index="37">5.大海</el-menu-item>
                                    <el-menu-item index="38">6.雨夜</el-menu-item>
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
