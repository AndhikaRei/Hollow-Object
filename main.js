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
  	hollowObject = loadHollowH();

  	webglManager.initBuffersHollow(hollowObject);
	webglManager.drawHollowObjectScene();
}



