<template>
    <div class="common-layout">
        <el-container direction="vertical">
            <TopBar />
            <el-container>
                    <el-main style="position: absolute;left: 0;right: 0;top: 60px;">
                        <router-view></router-view>
                    </el-main>
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
