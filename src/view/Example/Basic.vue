<script setup lang="ts">
</script>
<template>
    <div>
        <div class="Oneheader">Web3D案例</div>
        <div class="Twoheader">1.物联网相关</div>
        <div class="content">
            <!-- <el-card class="card">
                <img src="/model/example/Basic_01/image.png" alt="" width="100%" height="100%">
                <template #footer>
                    <a href="/TollBath" class="jump">收费站案例</a>
                </template>
            </el-card> -->
            <el-card class="card">
                <img src="/model/example/Basic_02/backimg.png" alt="" width="100%" height="100%">
                <template #footer>
                    <a href="/Roam" class="jump">漫游案例</a>
                </template>
            </el-card>
            <el-card class="card">
                <img src="/model/example/Basic_03/back.png" alt="" width="100%" height="100%">
                <template #footer>
                    <a href="/Things" class="jump">物联网粮仓</a>
                </template>
            </el-card>
            <el-card class="card">
                <img src="/model/example/Basic_04/back.png" alt="" width="100%" height="100%">
                <template #footer>
                    <a href="/Phone" class="jump">手机产品展示</a>
                </template>
            </el-card>
            <el-card class="card">
                <img src="/model/example/Basic_05/back.png" alt="" width="100%" height="100%">
                <template #footer>
                    <a href="/Car" class="jump">汽车产品展示</a>
                </template>
            </el-card>
        </div>
        <div class="Twoheader">2.3D地图相关</div>
        <div class="content">
            <el-card class="card">
                <img src="/model/example/Basic_06/back_world.png" alt="" width="100%" height="100%">
                <template #footer>
                    <a href="/Map" class="jump">地图可视化</a>
                </template>
            </el-card>
            <el-card class="card">
                <img src="/model/example/Basic_06/back_china1.png" alt="" width="100%" height="100%">
                <template #footer>
                    <a href="/ChinaMap" class="jump">中国GDP可视化</a>
                </template>
            </el-card>
            <el-card class="card">
                <img src="/model/example/Basic_06/back_henan.png" alt="" width="100%" height="100%">
                <template #footer>
                    <a href="/henanMap" class="jump">河南GDP可视化</a>
                </template>
            </el-card>

            <el-card class="card">
                <img src="/model/example/Basic_06/back_china2.png" alt="" width="100%" height="100%">
                <template #footer>
                    <a href="/ChinaCir" class="jump">中国pm可视化</a>
                </template>
            </el-card>
            <el-card class="card">
                <img src="/model/example/Basic_06/back_china3.png" alt="" width="100%" height="100%">
                <template #footer>
                    <a href="/ChinaCyl" class="jump">中国GDP可视化(Cyl)</a>
                </template>
            </el-card>
            <el-card class="card">
                <img src="/model/example/Basic_06/back_china4.png" alt="" width="100%" height="100%">
                <template #footer>
                    <a href="/ChinaPot" class="jump">微博活动点</a>
                </template>
            </el-card>
            <el-card class="card">
                <img src="/model/example/Basic_06/back_china5.png" alt="" width="100%" height="100%">
                <template #footer>
                    <a href="/flyLine" class="jump">中国飞线GDP</a>
                </template>
            </el-card>
        </div>
        <div class="Twoheader">3.3D地球相关</div>
        <div class="content" style="margin-bottom: 10%;">
            <el-card class="card">
                <img src="/model/example/Basic_07/back1.png" alt="" width="100%" height="100%">
                <template #footer>
                    <a href="/Earth" class="jump">地球可视化</a>
                </template>
            </el-card>

            <el-card class="card">
                <img src="/model/example/Basic_07/back2.png" alt="" width="100%" height="100%">
                <template #footer>
                    <a href="/EarthMark" class="jump">地球可视化标注</a>
                </template>
            </el-card>

            <el-card class="card">
                <img src="/model/example/Basic_07/back3.png" alt="" width="100%" height="100%">
                <template #footer>
                    <a href="/EarthMesh" class="jump">地球Mesh模型可视化</a>
                </template>
            </el-card>


            <el-card class="card">
                <img src="/model/example/Basic_07/back4.png" alt="" width="100%" height="100%">
                <template #footer>
                    <a href="/EarthPoint" class="jump">地球Mesh点阵</a>
                </template>
            </el-card>
            
            <el-card class="card">
                <img src="/model/example/Basic_07/back5.png" alt="" width="100%" height="100%">
                <template #footer>
                    <a href="/Earthpop" class="jump">地球人口密度</a>
                </template>
            </el-card>

            <el-card class="card">
                <img src="/model/example/Basic_07/back6.png" alt="" width="100%" height="100%">
                <template #footer>
                    <a href="/EarthFly" class="jump">地球飞线</a>
                </template>
            </el-card>
        </div>
        <div class="Twoheader">4.智慧城市相关</div>
        <div class="content" style="margin-bottom: 10%;">
            <el-card class="card">
                <img src="/model/example/Basic_07/back1.png" alt="" width="100%" height="100%">
                <template #footer>
                    <a href="/City" class="jump">智慧城市</a>
                </template>
            </el-card>
        </div>
        <div class="Twoheader">5.渲染相关</div>
        <div class="content" style="margin-bottom: 10%;">
            <el-card class="card">
                <img src="/model/example/sky/bluesky.png" alt="" width="100%" height="100%">
                <template #footer>
                    <a href="/Bluesky" class="jump">动态天空</a>
                </template>
            </el-card>
        </div>
    </div>
</template>
<style scoped>
.Oneheader {
    font-size: 36px;
    margin-bottom: 10px;
}

.Twoheader {
    font-size: 18px;
    font-weight: 800;
    /* margin-bottom: 10px; */
    overflow: hidden;
}

.content {
    display: flex;
    flex-direction: row;
    justify-content: start;
    flex-wrap: wrap;

}

.card {
    flex: 1;
    max-width: 300px;
    width: 300px;
    margin: 20px;
    min-width: 300px;
}

.jump:hover {
    color: skyblue;
    cursor: pointer;
}

.jump {
    text-decoration: none;
    color: black;
}
</style>