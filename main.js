'use strict';

// Main
/**@type {HollowObject} */
let hollowObject = null;
/**@type {WebGlManager} */
let webglManager = null;

main();

/**
 * @description Main function of WebglProgram.
 * 
 */
function main() {
	// Init webgl.
	// Get gl context.
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

	// Init webglManager.
	webglManager = new WebGlManager(gl, vertexShader, fragmentShader, shaderProgram);

// 	// Object to be used in init buffers.
// 	// Now create an array of positions for the cube.
// 	const vertices = [
// 		// Front face
// 		-1.0, -1.0,  1.0,
// 		1.0, -1.0,  1.0,
// 		1.0,  1.0,  1.0,
// 		-1.0,  1.0,  1.0,

// 		// Back face
// 		-1.0, -1.0, -1.0,
// 		-1.0,  1.0, -1.0,
// 		1.0,  1.0, -1.0,
// 		1.0, -1.0, -1.0,

// 		// Top face
// 		-1.0,  1.0, -1.0,
// 		-1.0,  1.0,  1.0,
// 		1.0,  1.0,  1.0,
// 		1.0,  1.0, -1.0,

// 		// Bottom face
// 		-1.0, -1.0, -1.0,
// 		1.0, -1.0, -1.0,
// 		1.0, -1.0,  1.0,
// 		-1.0, -1.0,  1.0,

// 		// Right face
// 		1.0, -1.0, -1.0,
// 		1.0,  1.0, -1.0,
// 		1.0,  1.0,  1.0,
// 		1.0, -1.0,  1.0,

// 		// Left face
// 		-1.0, -1.0, -1.0,
// 		-1.0, -1.0,  1.0,
// 		-1.0,  1.0,  1.0,
// 		-1.0,  1.0, -1.0,
// 	];   

//   // Now set up the colors for the faces. We'll use solid colors
//   // for each face.
//   const faceColors = [
// 		[1.0,  1.0,  1.0,  1.0],    // Front face: white
// 		[1.0,  0.0,  0.0,  1.0],    // Back face: red
// 		[0.0,  1.0,  0.0,  1.0],    // Top face: green
// 		[0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
// 		[1.0,  1.0,  0.0,  1.0],    // Right face: yellow
// 		[1.0,  0.0,  1.0,  1.0],    // Left face: purple
//   ];

  	// Here's where we call the routine that builds all the
  	// objects we'll be drawing.
  	// Load cube.
  	hollowObject = loadHollowH();

  	// console.log(JSON.stringify(hollowObject));
  	webglManager.initBuffersHollow(hollowObject);
	webglManager.drawHollowObjectScene();
}



