var canvas_in = document.getElementById("canvas_in");
var canvas_out = document.getElementById("canvas_out");

var img = new Image();
img.onload = function() {
    var w = this.width; 
    var h = this.height;
    canvas_in.width = canvas_out.width = w;
    canvas_in.height = canvas_out.height = h;
    
    var ctx = canvas_in.getContext("2d");
    var gl = canvas_out.getContext("experimental-webgl");
    gl.viewport(0, 0, w, h);

    var vtx_shader = gl.createShader(gl.VERTEX_SHADER);
    var frag_shader = gl.createShader(gl.FRAGMENT_SHADER);
    
    var vtx_shader_source = "attribute vec2 a_vpos;                         \
                             attribute vec2 a_tpos;                         \
                             varying vec2 v_tpos;                           \
                             void main(void) {                              \
                                 gl_Position = vec4(a_vpos, 0.0, 1.0);      \
                                 v_tpos = a_tpos;                           \
                             }";
    
    var frag_shader_source = "precision highp float;                                            \
                              varying vec2 v_tpos;                                              \
                              uniform vec2 u_size;                                              \
                              uniform sampler2D u_texture;                                      \
                              uniform mat3 u_kernel;                                            \
                              void main(void) {                                                 \
                                vec2 delta = 1.0/u_size;                                        \
                                vec4 color = vec4(0,0,0,0);                                     \
                                for (int i=0; i<=2; i++) {                                      \
                                    for (int j=0; j<=2; j++) {                                  \
                                        vec2 offset = v_tpos + vec2(i-1, j-1)*delta;            \
                                        color += u_kernel[i][j]*texture2D(u_texture, offset);   \
                                    }                                                           \
                                }                                                               \
                                gl_FragColor = color;                                           \
                              }";

    gl.shaderSource(vtx_shader, vtx_shader_source);
    gl.shaderSource(frag_shader, frag_shader_source);
    gl.compileShader(vtx_shader);
    gl.compileShader(frag_shader);
   
    if (!gl.getShaderParameter(vtx_shader, gl.COMPILE_STATUS)){
        console.log(gl.getShaderInfoLog(vtx_shader));
    }
    if (!gl.getShaderParameter(frag_shader, gl.COMPILE_STATUS)){
        console.log(gl.getShaderInfoLog(frag_shader));
    }
    
    var program = gl.createProgram();
    gl.attachShader(program, vtx_shader);
    gl.attachShader(program, frag_shader);
    gl.linkProgram(program);
    gl.useProgram(program);
    
    var a_vpos = gl.getAttribLocation(program, "a_vpos");   // vertex coordinate
    var a_tpos = gl.getAttribLocation(program, "a_tpos");   // texture coordinate
    var u_size = gl.getUniformLocation(program, "u_size");  // size of the texture
    var u_texture = gl.getUniformLocation(program, "u_texture"); // texture id, use 0 for TEXTURE0
    var u_kernel = gl.getUniformLocation(program, "u_kernel");   // 3x3 kernel to apply

    gl.enableVertexAttribArray(a_vpos);
    gl.enableVertexAttribArray(a_tpos);
    gl.uniform2fv(u_size, new Float32Array([w, h]));
    gl.uniform1i(u_texture, 0);
    
    var gaussian = new Float32Array([0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625]); 
    gl.uniformMatrix3fv(u_kernel, false, gaussian);     
    
    var vpos_buf = gl.createBuffer();
    var tpos_buf = gl.createBuffer();
    var idx_buf = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vpos_buf);
    // order: Bottom-Left, Bottom-Right, Top-Right, Top-Left
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, 1,1, -1,1]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_vpos, 2, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, tpos_buf);
    // corresponding texture coordinate
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0, 1,0, 1,1, 0,1]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_tpos, 2, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idx_buf);
    // We will draw the square as triangle strip
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,3,2]), gl.STATIC_DRAW);
    
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
    // The way texImage2D reading the texture will make the texture upside down as it
    // fill the bottom of the texture first
    // we need to pre-flip the texture
    ctx.translate(0, 400);
    ctx.scale(1, -1);
    ctx.drawImage(img, 0, 0, w, h);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas_in);
    gl.activeTexture(gl.TEXTURE0);

    // execute shader!
    gl.drawElements(gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_SHORT, 0);
    
    // draw the unflipped image for comparision 
    ctx.translate(0, 400);
    ctx.scale(1, -1);
    ctx.drawImage(img, 0, 0, w, h);
};

// If you are using Safari, make sure the image is hosted under the same domain, otherwise it will violate CORS
img.src = "../../images/gpgpu1-lena.png";