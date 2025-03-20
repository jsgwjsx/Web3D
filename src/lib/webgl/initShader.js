export default function initShaders(gl, vertextSource, fragmentSource) {
    let vertextShader = createShader(gl, gl.VERTEX_SHADER, vertextSource)
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
    let program = createProgram(gl, vertextShader, fragmentShader)
    if (program) {
        //为了获得program的作用域
        gl.program = program//吧program挂载到webgl大对象里面作为一个属性
        //加载使用program
        gl.useProgram(program)
        return true
    } else {
        return false
    }
}
//创建shader函数
function createShader(gl, type, source) {
    let shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    //查看编译shader的错误处理
    let complied = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    //编译成功return shader,否则rentun null并报错
    if (complied) {
        return shader
    } else {
        let error = gl.getShaderInfoLog(shader)
        console.log(error)
        gl.deleteShader(shader)//删除shader，防止内存泄漏
        return null
    }
}
//创建program函数
function createProgram(gl, vertextShader, fragmentShader) {
    let program = gl.createProgram()
    //创建出错的话
    if (!program) return null
    gl.attachShader(program, vertextShader)
    gl.attachShader(program, fragmentShader)
    //指明要加载的program
    gl.linkProgram(program)
    //link错误处理
    let linked = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (linked) {
        return program
    } else {
        let error = gl.getProgramInfoLog(shader)
        console.log(error)
        gl.deleteProgram(program)
        gl.deleteShader(vertextShader)
        gl.deleteShader(fragmentShader)
        return null
    }


}