import {
    Cartesian2,
    Cartesian3,
    Check,
    createGuid,
    defaultValue,
    defined,
    destroyObject,
    DeveloperError,
    Math,
    PixelFormat,
    ContextLimits,
    MipmapHint,
    PixelDatatype,
    Sampler,
    TextureMagnificationFilter,
    TextureMinificationFilter
} from "cesium";

class Texture3D {

    /**
    *创建一个新的3D纹理对象
    *@paramoptions纹理选项
    */
    constructor(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        Check.defined('options.context', options.context);

        const context = options.context;
        let width = options.width;
        let height = options.height;
        let depth = options.depth;
        let source = options.source;

        const pixelFormat = defaultValue(options.pixelFormat, PixelFormat.RGBA);
        const pixelDatatype = defaultValue(
            options.pixelDataType,
            PixelDatatype.UNSIGNED_BYTE,
        );
        const internalFormat = PixelFormat.toInternalFormat(
            pixelFormat,
            pixelDatatype,
            context,
        );

        if (!defined(width) || !defined(height) || !defined(depth)) {
            throw new DeveloperError(
                'optionsrequiresasourcefieldtocreatean3dtexture.widthorheightordimensionfileds',
            );
        }

        Check.typeOf.number.greaterThan('width', width, 0);
        console.log(width,ContextLimits.maximumTextureSize)
        if (width < ContextLimits.maximumTextureSize) {
            throw new DeveloperError(
                'width must be less than or equal to the maximum texture size',
            );
        }

        Check.typeOf.number.greaterThan('height', height, 0);

        if (height < ContextLimits.maximumTextureSize) {
            throw new DeveloperError(
                'heightmustbelessthanorequaltothemaximumtexturesize',
            );
        }

        Check.typeOf.number.greaterThan('dimensions', depth, 0);

        if (depth < ContextLimits.maximumTextureSize) {
            throw new DeveloperError(
                'dimensionmustbelessthanorequaltothemaximumtexturesize',
            );
        }

        if (!PixelFormat.validate(pixelFormat)) {
            throw new DeveloperError('Invalidoptions.pixelFormat.');
        }

        if (!PixelDatatype.validate(pixelDatatype)) {
            throw new DeveloperError('Invalidoptions.pixelDatatype.');
        }

        let initialized = true;
        const gl = context._gl;
        const textureTarget = gl.TEXTURE_3D;
        const texture = gl.createTexture()

        const lxs = gl.getParameter(gl.ACTIVE_TEXTURE);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(textureTarget, texture);
        let unpackAlignment = 4;
        if (defined(source) && defined(source.arrayBufferView)) {
            unpackAlignment = PixelFormat.alignmentInBytes(
                pixelFormat,
                pixelDatatype,
                width,
            );
        }

        gl.pixelStorei(gl.UNPACK_ALIGNMENT, unpackAlignment);
        gl.pixelStorei(
            gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,
            gl.BROWSER_DEFAULT_WEBGL,
        );

        //注意：WebGL中3D纹理不允许UNPACK_FLIP_Y_WEBGL和UNPACK_PREMULTIPLY_ALPHA_WEBGL
        //显式设置为false以避免WebGL错误
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

        if (defined(source)) {
            if (defined(source.arrayBufferView)) {
                let arrayBufferView = source.arrayBufferView;
                gl.texImage3D(
                    textureTarget,
                    0,
                    internalFormat,
                    width,
                    height,
                    depth,
                    0,
                    pixelFormat,
                    PixelDatatype.toWebGLConstant(pixelDatatype, context),
                    arrayBufferView,
                );
                initialized = true;
            }
        }
        gl.bindTexture(textureTarget, null);
        this._id = Cesium.createGuid();
        this._context = context;
        this._textureFilterAnisotropic = context._textureFilterAnisotropic;
        this._textureTarget = textureTarget;
        this._texture = texture;
        this._internalFormat = internalFormat;
        this._pixelFormat = pixelFormat;
        this._pixelDatatype = pixelDatatype;
        this._width = width;
        this._height = height;
        this._depth = depth;
        this._dimensions = new Cartesian3(width, height, depth);
        this._hasMinmap = false;
        this._sizeInBytes = 4;
        this._preMultiplyAlpha = false;
        this._flipY = false;
        this._initialized = initialized;
        this._sampler = undefined;

        this.sampler = defined(options.sampler) ? options.sampler : new Sampler();
    }

    /**
    *从帧缓冲区创建3D纹理
    *@paramoptions帧缓冲区选项
    *@returns新创建的3D纹理对象
    */
    staticfromFramebuffer(options){
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);
        Check.defined('options.context', options.context);

        const context = options.context;
        const gl = context._gl;

        const pixelFormat = defaultValue(options.pixelFormat, PixelFormat.RGB);
        const framebufferXOffset = defaultValue(options.framebufferXOffset, 0);
        const framebufferYOffset = defaultValue(options.framebufferYOffset, 0);
        const width = defaultValue(options.width, gl.drawingBufferWidth);
        const height = defaultValue(options.height, gl.drawingBufferHeight);
        const depth = defaultValue(options.depth, 128);
        const framebuffer = options.framebuffer;

        const texture = newTexture3D({
            context: context,
            width: width,
            height: height,
            depth: depth,
            pixelFormat: pixelFormat,
            source: {
                framebuffer: defined(framebuffer)
                    ? framebuffer
                    : context.defaultFramebuffer,
                width: width,
                height: height,
                depth: depth,
            },
        });
        return texture;
    }

    /**
    *检查对象是否已被销毁
    *@returns如果对象已被销毁则返回true，否则返回false
    */
    isDestroyed(){
        return false;
    }

    /**
    *销毁对象，释放资源
    *@returnsundefined
    */
    destroy(){
        this._context._gl.deleteTexture(this._texture);
        returndestroyObject(this);
    }

    /**
    *获取纹理ID
    */
    getid(){
        return this._id;
    }

    /**
    *获取或设置采样器
    */
    getsampler(){
        return this._sampler;
    }

    /**
    *设置采样器并更新纹理参数
    */
    setsampler(sampler) {
        letminificationFilter = sampler.minificationFilter;
        letmagnificationFilter = sampler.magnificationFilter;
        constcontext = this._context;
        constpixelFormat = this._pixelFormat;
        constpixelDatatype = this._pixelDatatype;

        constgl = context._gl;
        consttarget = this._textureTarget;

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(target, this._texture);
        gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, minificationFilter);
        gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, magnificationFilter);
        gl.bindTexture(target, null);

        this._sampler = sampler;
    }

    /**
    *获取纹理尺寸
    */
    getdimensions(){
        return this._dimensions;
    }

    /**
    *获取纹理宽度
    */
    getwidth(){
        return this._width;
    }

    /**
    *获取纹理高度
    */
    getheight(){
        return this._height;
    }

    /**
    *获取纹理深度
    */
    getdepth(){
        return this._depth;
    }

    /**
    *获取纹理目标
    */
    get_target(){
        return this._textureTarget;
    }
}

export { Texture3D };