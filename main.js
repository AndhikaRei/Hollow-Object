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

	const vert = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec4 aVertexColor;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;

      // Apply lighting effect
      highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;

  // Fragment shader program
  const frag = `
    varying lowp vec4 vColor;
    varying highp vec3 vLighting;

    uniform bool uShading;

    void main(void) {
      if (uShading) {
        gl_FragColor = vec4(vColor.rgb * vLighting, vColor.a);
      } else {
        gl_FragColor = vColor;
      }
    }
  `;
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

  	console.log(JSON.stringify(hollowObject));
  	webglManager.initBuffersHollow(hollowObject);
	webglManager.drawHollowObjectScene();
}



