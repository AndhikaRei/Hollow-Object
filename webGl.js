// References: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Creating_3D_objects_using_WebGL
// Github: https://github.com/mdn/webgl-examples/tree/gh-pages/tutorial/sample5

'use strict';

// ==================================================================================================
class Buffers {
    /**
     * Constructor
     * @param {WebGLBuffer} position 
     * @param {WebGLBuffer} color 
     * @param {WebGLBuffer} indices 
     */
    constructor(position, color, indices) {
        /**
         * @type {WebGLBuffer}
         * @description WebGLBuffer of position.
         * @public
         */
        this.position = position;
        
        /**
         * @type {WebGLBuffer}
         * @description WebGLBuffer of color.
         * @public
         */
        this.color = color;
        
        /**
         * @type {WebGLBuffer}
         * @description WebGLBuffer of indices.
         * @public
         */
        this.indices = indices;
    }
}

/**
 * Class programInfo.
 * @classdesc hold the information of program.
 */
class programInfo {
    /**
     * @description Create programInfo object.
     * @param {WebGLProgram} program 
     * @param {WebGL2RenderingContext} gl 
     */
    constructor(program, gl) {
        /**
         * @description WebGLProgram object.
         * @type {WebGLProgram}
         * @public
         */
        this.program = program;
        this.gl = gl;
        
        /**
         * @description WebGL attribute location.
         * @namespace
         * @property {number} vertexPosition - Attribute location of vertex position.
         * @property {number} vertexColor - Attribute location of vertex color.
         * @public
         */
        this.attribLocations = {
            vertexPosition: this.gl.getAttribLocation(program, 'aVertexPosition'),
            vertexColor: this.gl.getAttribLocation(program, 'aVertexColor'),
        };

        /**
         * @description WebGL uniform location.
         * @namespace
         * @property {number} modelViewMatrix - Uniform location of model view matrix.
         * @property {number} projectionMatrix - Uniform location of projection matrix.
         * @public
         */
        this.uniformLocations = {
            projectionMatrix: this.gl.getUniformLocation(program, 'uProjectionMatrix'),
            modelViewMatrix: this.gl.getUniformLocation(program, 'uModelViewMatrix'),
        };
    }
}

/**
 * Class WebGLManager
 * @classdesc Manage WebGL context.
 */
class WebGlManager {
    /**
     * @description Constructor of webgl manager.
     * @param {WebGL2RenderingContext} gl - WebGL context
     * @param {WebGLShader} vertexShader - Vertex shader source code.
     * @param {WebGLShader} fragmentShader - Fragment shader source code.
     * @param {WebGLProgram} program - WebGLProgram object. 
     */
    constructor(gl, vertexShader, fragmentShader, program) {
        
        /**
         * gl - WebGL context.
         * @type {WebGLRenderingContext}
         * @public
         */
        // Init WebGL context.
        this.gl = gl

        // Set webgl viewport.
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        // Initialize a shader program; this is where all the lighting
        // for the vertices and so forth is established.
        /**
         * vertexShader - Vertex shader.
         * @type {WebGLShader}
         * @public
         **/
        this.vertexShader = vertexShader;
        /**
         * fragmentShader - Fragment shader.
         * @type {WebGLShader}
         * @public
         */
        this.fragmentShader = fragmentShader;
        /**
         * shaderProgram - Shader program.
         * @type {WebGLProgram}
         * @public
         */
        this.program = program

        // Collect all the info needed to use the shader program.
        // Look up which attributes our shader program is using
        // for aVertexPosition, aVertexColor and also
        // look up uniform locations.
        /**
         * programInfo - Program info.
         * @type {programInfo}
         * @public
         */
        this.programInfo = new programInfo(this.program, this.gl);
    }

    /**
     * @description Create shader.
     * @param {number} type - gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
     * @param {string} source - shader source code
     * @returns {WebGLShader} shader or null if failed
     */
    initShader(type, source) {
        // Create and compile the shader.
        let shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        // Check compile status.
        // If success then return the created shader.
        let success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        // If there is an error, log it and delete the shader.
        console.error(this.gl.getShaderInfoLog(shader));
        alert('Failed to initialize the shader.');
        this.gl.deleteShader(shader);
    };

    /**
     * @description Create shader program.
     * @returns
     */
    createProgram(){
        // Create program.
        let program = this.gl.createProgram();

        // Attach shader to program.
        this.gl.attachShader(program, this.vertexShader);
        this.gl.attachShader(program, this.fragmentShader);

        // Link program.
        this.gl.linkProgram(program);

        // Check link status.
        // If success then return the created program.
        var success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
        if (success) {
            return program;
        }

        // If there is an error, log it and delete the program.
        console.error(this.gl.getProgramInfoLog(program));
        alert('Failed to initialize the shader program.');
        this.gl.deleteProgram(program);
    };

    /**
     * @description Initialize buffers in GPU before drawing the object.
     * @param {number[]} vertices - vertices of shape.
     * @param {number[]} faceColors - colors of each face.
     * @param {number[]} indices - vertices topology.
     * @returns {Buffers} program buffer.
     */
    initBuffers(vertices, faceColors, indices){
        // Binding data
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

        // Convert the array of colors into a table for all the vertices.
        let colors = [];
        for (var j = 0; j < faceColors.length; ++j) {
            const c = faceColors[j];
            // Repeat each color four times for the four vertices of the face
            colors = colors.concat(c, c, c, c);
        }
        // Create the color buffer.
        const colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

        // Build the element array buffer; this specifies the indices
        // into the vertex arrays for each face's vertices.
        const indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        // Now send the element array to GL
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);

        return new Buffers(positionBuffer, colorBuffer, indexBuffer);
    };

    /**
     * @description Draw scenarion.
     * @param {Buffers} buffers - buffers.
     * @param {number} deltaTime - delta time.
     * @param {number} vertexCount - the number of vertext to draw.
     * @param {number} cubeRotation - cube rotation.
     */
    drawScene(buffers, deltaTime, vertexCount) {
        this.gl.clearColor(0.8, 0.8, 0.8, 1);  // Clear to white, fully opaque
        this.gl.clearDepth(1.0);                 // Clear everything
        this.gl.enable(this.gl.DEPTH_TEST);           // Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL);            // Near things obscure far things
      
        // Clear the canvas before we start drawing on it.
      
       this. gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      
        // Create a perspective matrix, a special matrix that is
        // used to simulate the distortion of perspective in a camera.
        // Our field of view is 45 degrees, with a width/height
        // ratio that matches the display size of the canvas
        // and we only want to see objects between 0.1 units
        // and 100 units away from the camera.
      
        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();
      
        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        mat4.perspective(projectionMatrix,
                         fieldOfView,
                         aspect,
                         zNear,
                         zFar);
      
        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        const modelViewMatrix = mat4.create();
      
        // Now move the drawing position a bit to where we want to
        // start drawing the square.
      
        mat4.translate(modelViewMatrix,     // destination matrix
                       modelViewMatrix,     // matrix to translate
                       [-0.0, 0.0, -6.0]);  // amount to translate
        mat4.rotate(modelViewMatrix,  // destination matrix
                    modelViewMatrix,  // matrix to rotate
                    cubeRotation,     // amount to rotate in radians
                    [0, 0, 1]);       // axis to rotate around (Z)
        mat4.rotate(modelViewMatrix,  // destination matrix
                    modelViewMatrix,  // matrix to rotate
                    cubeRotation * .7,// amount to rotate in radians
                    [0, 1, 0]);       // axis to rotate around (X)
      
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute
        {
          const numComponents = 3;
          const type = this.gl.FLOAT;
          const normalize = false;
          const stride = 0;
          const offset = 0;
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.position);
          this.gl.vertexAttribPointer(
              this.programInfo.attribLocations.vertexPosition,
              numComponents,
              type,
              normalize,
              stride,
              offset);
          this.gl.enableVertexAttribArray(
              this.programInfo.attribLocations.vertexPosition);
        }
      
        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        {
          const numComponents = 4;
          const type = this.gl.FLOAT;
          const normalize = false;
          const stride = 0;
          const offset = 0;
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.color);
          this.gl.vertexAttribPointer(
              this.programInfo.attribLocations.vertexColor,
              numComponents,
              type,
              normalize,
              stride,
              offset);
          this.gl.enableVertexAttribArray(
              this.programInfo.attribLocations.vertexColor);
        }
      
        // Tell WebGL which indices to use to index the vertices
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
      
        // Tell WebGL to use our program when drawing
        this.gl.useProgram(this.programInfo.program);
      
        // Set the shader uniforms
        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);
      
        {
            const type = this.gl.UNSIGNED_SHORT;
            const offset = 0;
            this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
        }
      
        // Update the rotation for the next draw
      
        cubeRotation += deltaTime;
      }
}

// ==================================================================================================

// ==================================================================================================
/**
 * @description Create shader.
 * @param {WebGLRenderingContext} gl - WebGL context.
 * @param {number} type - gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
 * @param {string} source - shader source code
 * @returns {WebGLShader} shader or null if failed
 */
 const initShader = (gl, type, source) => {
    // Create and compile the shader.
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // Check compile status.
    // If success then return the created shader.
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    // If there is an error, log it and delete the shader.
    console.error(gl.getShaderInfoLog(shader));
    alert('Failed to initialize the shader.');
    gl.deleteShader(shader);
};

/**
 * @description Create shader program.
 * @param {WebGLRenderingContext} gl - WebGL context.
 * @param {WebGLShader} vertexShader - Vertex shader.
 * @param {WebGLShader} fragmentShader - Fragment shader.
 * @returns
 */
const createProgram = (gl, vertexShader, fragmentShader) => {
    // Create program.
    let program = gl.createProgram();

    // Attach shader to program.
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // Link program.
    gl.linkProgram(program);

    // Check link status.
    // If success then return the created program.
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    // If there is an error, log it and delete the program.
    console.error(gl.getProgramInfoLog(program));
    alert('Failed to initialize the shader program.');
    gl.deleteProgram(program);
};
// ==================================================================================================