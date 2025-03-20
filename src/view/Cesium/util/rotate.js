import * as Cesium from 'cesium'




function trasnlate(transformin,tileset,m){
    //获取当前实体位置的中心坐标
    let pcenter =  Cesium.Cartesian3.clone(tileset.boundingSphere.center);
    //记录当前模型的姿态
    var transformMat = Cesium.Matrix4.fromArray(m);
    //获取矩阵的旋转部分，并赋值给matRotation
    var matRotation = Cesium.Matrix4.getMatrix3(transformMat, new Cesium.Matrix3());
    //矩阵转置
    var inverseMatRotation = Cesium.Matrix3.inverse(matRotation, new Cesium.Matrix3());
    //模型的坐标的x,y,平移向量
    var matTranslation = Cesium.Matrix4.getTranslation(transformMat, new Cesium.Cartesian3());
    
    //原点中心位置构建一个矩阵
    var transformation = Cesium.Transforms.eastNorthUpToFixedFrame(pcenter);
    //获取变换矩阵的旋转部分
    var transformRotation = Cesium.Matrix4.getMatrix3 (transformation, new Cesium.Matrix3());
    //获取变换矩阵的平移部分
    var transformTranslation = Cesium.Matrix4.getTranslation(transformation, new Cesium.Cartesian3());


    //原点中心与矩阵的偏移量
    var matToTranslation = Cesium.Cartesian3.subtract(matTranslation, transformTranslation, new Cesium.Cartesian3());
    matToTranslation = Cesium.Matrix4.fromTranslation(matToTranslation, new Cesium.Matrix4());

    //计算旋转矩阵的变换并最后为逆矩阵
    var matToTransformation = Cesium.Matrix3.multiply(inverseMatRotation, transformRotation, new Cesium.Matrix3());
    matToTransformation = Cesium.Matrix3.inverse(matToTransformation, new Cesium.Matrix3());
    //从matrix3变成matrix4放射矩阵
    matToTransformation = Cesium.Matrix4.fromRotationTranslation(matToTransformation);

    //计算需要旋转的矩阵，将其从matrix3变为matrix4
    var rotationTranslation = Cesium.Matrix4.fromRotationTranslation(transformin);

    //模型的原点矩阵基础上旋转偏移量
    Cesium.Matrix4.multiply(transformation, rotationTranslation, transformation);
    //模型的姿态根据原来的调整幅度逆调整回去
    Cesium.Matrix4.multiply(transformation, matToTransformation, transformation);
    //模型根据偏移量回到原点
    Cesium.Matrix4.multiply(transformation, matToTranslation, transformation);
    tileset.modelMatrix =transformation;
}
//放大缩小
export function scale(value,tileset){
    var m1 = Cesium.Matrix3.fromScale(new Cesium.Cartesian3(value, value, value));
    trasnlate(m1,tileset,m);
}

//旋转
export function rotatex(anglex,tileset,m) {
    let m1 = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(anglex));
    trasnlate(m1,tileset,m);
}

export function rotatey(angley,tileset,m) {
    let m1 = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(angley));
    trasnlate(m1,tileset,m);
}

export function rotatez(anglez,tileset,m) {
    let m1 = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(anglez));
    trasnlate(m1,tileset,m);
}