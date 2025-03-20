<template>
    <div class="common-layout">
        <el-container direction="vertical">
            <TopBar />
            <el-container>
                <el-aside width="200px" style="height: calc(100%-122px); position: absolute;">
                    <el-scrollbar class="asider">
                        <el-menu unique-opened router>
                            <el-menu-item-group>
                                <el-menu-item index="01">1.Three案例</el-menu-item>
                            </el-menu-item-group>
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
.common-layout:deep(.el-main){
    height: 800px;
    overflow: auto;
    scrollbar-width: thin;
    scrollbar-color: grey transparent;
   
}

/* 隐藏滚动条 */
.common-layout:deep(.el-main::-webkit-scrollbar){
    width: 10px;
    height: 10px;
    background-color: grey;
    border-radius: 5px;

}
</style>
