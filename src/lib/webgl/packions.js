

export function initArrayBuffer(gl, data, num, type, attribute) {
    // 先创建一个缓冲区对象
    var buffer = gl.createBuffer();

    // 把数据写入到缓冲区中
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    // 将图元分配到图元装配空间中去，并存储起来
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    // 开启图元装配
    gl.enableVertexAttribArray(a_attribute);

    return true;
}

export function initTextures(gl, n, u_sample, url) {
    let texture = gl.createTexture();
    let u_Sampler = gl.getUniformLocation(gl.program, u_sample);
    let image = new Image();
    image.onload = function () {
        loadTexture(gl, n, texture, u_Sampler, image);
    };
    image.src = url;
    return true;
}


function loadTexture(gl, n, texture, u_Sampler, image) {
    // 图像y轴翻转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, 0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (let index = 0; index < 10; index++) {
        glMatrix.mat4.translate(MVPMatrix, MVPMatrix, [0, index / 10, 0]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, MVPMatrix);
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    }
}

