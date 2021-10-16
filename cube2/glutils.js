class glutils
{
    constructor(){}

    static getShader(id)
    {
        var script = document.getElementById(id);
        if (!script) {
            return null;
        }

        var shader;
        if (script.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (script.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, script.text);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    static makeProgram(vsName, fsName)
    {
        var out = gl.createProgram();
        
        gl.attachShader(out, glutils.getShader(vsName));
        gl.attachShader(out, glutils.getShader(fsName));
        
        gl.linkProgram(out);

        const numAttribs = gl.getProgramParameter(out, gl.ACTIVE_ATTRIBUTES);
        const numUniforms = gl.getProgramParameter(out, gl.ACTIVE_UNIFORMS);

        let i;
        for (i = 0; i < numAttribs; i++)
        {
            const attribInfo = gl.getActiveAttrib(out, i);
            eval("out." + attribInfo.name + " = gl.getAttribLocation(out, \"" + attribInfo.name + "\");");
        }

        for (i = 0; i < numUniforms; i++)
        {
            const uniformInfo = gl.getActiveUniform(out, i);
            
            if (uniformInfo.name.endsWith("[0]"))
            {
                let fixedName = uniformInfo.name.substring(0, uniformInfo.name.length - 3);
                
                eval("out." + fixedName + " = gl.getUniformLocation(out, \"" + fixedName + "\");");
            }
            else
            {
                eval("out." + uniformInfo.name + " = gl.getUniformLocation(out, \"" + uniformInfo.name + "\");");
            }
        }
        
        return out;
    }
}