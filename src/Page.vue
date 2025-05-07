<template>
    <div class="common-layout">
        <el-container direction="vertical">
               <TopBar/>
                <el-container>
                    <el-main>
                        <router-view></router-view>
                    </el-main>
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
