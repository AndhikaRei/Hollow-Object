'use strict';
var cubeRotation = 0.0;

main();

//
// Start here
//
function main() {
	// Init webgl.
	const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	
	// If we don't have a GL context, give up now
	if (!gl) {
		alert('Unable to initialize WebGL. Your browser or machine may not support it.');
		return;
	}


  	// Set webgl viewport.
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// Initialize a shader program; this is where all the lighting
	// for the vertices and so forth is established.
	const vertexShader = initShader(gl, gl.VERTEX_SHADER, vert);
	const fragmentShader = initShader(gl, gl.FRAGMENT_SHADER, frag);
	const shaderProgram = createProgram(gl, vertexShader, fragmentShader);

	// Collect all the info needed to use the shader program.
	// Look up which attributes our shader program is using
	// for aVertexPosition, aVertexColor and also
	// look up uniform locations.
	const programInfo = {
		program: shaderProgram,
			attribLocations: {
				vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
				vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
		}
	};

  // Object to be used in init buffers.
  // Now create an array of positions for the cube.
  const vertices = [
	// Front face
	-1.0, -1.0,  1.0,
	 1.0, -1.0,  1.0,
	 1.0,  1.0,  1.0,
	-1.0,  1.0,  1.0,

	// Back face
	-1.0, -1.0, -1.0,
	-1.0,  1.0, -1.0,
	 1.0,  1.0, -1.0,
	 1.0, -1.0, -1.0,

	// Top face
	-1.0,  1.0, -1.0,
	-1.0,  1.0,  1.0,
	 1.0,  1.0,  1.0,
	 1.0,  1.0, -1.0,

	// Bottom face
	-1.0, -1.0, -1.0,
	 1.0, -1.0, -1.0,
	 1.0, -1.0,  1.0,
	-1.0, -1.0,  1.0,

	// Right face
	 1.0, -1.0, -1.0,
	 1.0,  1.0, -1.0,
	 1.0,  1.0,  1.0,
	 1.0, -1.0,  1.0,

	// Left face
	-1.0, -1.0, -1.0,
	-1.0, -1.0,  1.0,
	-1.0,  1.0,  1.0,
	-1.0,  1.0, -1.0,
  ];   

  // Now set up the colors for the faces. We'll use solid colors
  // for each face.
  const faceColors = [
	[1.0,  1.0,  1.0,  1.0],    // Front face: white
	[1.0,  0.0,  0.0,  1.0],    // Back face: red
	[0.0,  1.0,  0.0,  1.0],    // Top face: green
	[0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
	[1.0,  1.0,  0.0,  1.0],    // Right face: yellow
	[1.0,  0.0,  1.0,  1.0],    // Left face: purple
  ];

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  const indices = [
	0,  1,  2,      0,  2,  3,    // front
	4,  5,  6,      4,  6,  7,    // back
	8,  9,  10,     8,  10, 11,   // top
	12, 13, 14,     12, 14, 15,   // bottom
	16, 17, 18,     16, 18, 19,   // right
	20, 21, 22,     20, 22, 23,   // left
  ];

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl, vertices, faceColors, indices);

  var then = 0;
  // Draw the scene repeatedly
  function render(now) {
	now *= 0.001;  // convert to seconds
	const deltaTime = now - then;
	then = now;

	drawScene(gl, programInfo, buffers, deltaTime);

	requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}



