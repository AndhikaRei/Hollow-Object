'use strict';

/** 
 * @type {string} 
 * @description Vertex shader source code.
*/
const vert = `
    // Vertex shader attribute.
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;
    
    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
    }
`;

/** 
 * @type {string} 
 * @description Fragment shader source code.
 * */
const frag = `
    varying lowp vec4 vColor;
    void main(void) {
        gl_FragColor = vColor;
    }
`;

// HTML ELEMENTS.
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvasWebGL');
/** @type {HTMLDivElement} */
const container = document.getElementById('container');
/**@type {HTMLInputElement} */
const translateXSlider = document.getElementById('translate-x');
/**@type {HTMLInputElement} */
const translateYSlider = document.getElementById('translate-y');
/**@type {HTMLInputElement} */
const translateZslider = document.getElementById('translate-z');
/** @type {HTMLInputElement} */
const rotateXSlider = document.getElementById('rotate-x');
/** @type {HTMLInputElement} */
const rotateYSlider = document.getElementById('rotate-y');
/** @type {HTMLInputElement} */
const rotateZSlider = document.getElementById('rotate-z');
/** @type {HTMLInputElement} */
const scaleXSlider = document.getElementById('scale-x');
/** @type {HTMLInputElement} */
const scaleYSlider = document.getElementById('scale-y');
/** @type {HTMLInputElement} */
const scaleZSlider = document.getElementById('scale-z');
/** @type {HTMLInputElement} */
const cameraRadiusSlider = document.getElementById('camera-radius');
/** @type {HTMLInputElement} */
const cameraRotateSlider = document.getElementById('camera-rotate');
/**  @type {HTMLInputElement} */
const shaderBtn = document.getElementById('shader-btn');
/** @type {HTMLInputElement} */
const defaultViewButton = document.getElementById('default-view');
/** @type {HTMLSelectElement} */
const projectionView = document.getElementById('projection-view');
/** @type {HTMLButtonElement} */
const helpBtn = document.getElementById('help-button');
/** @type {HTMLButtonElement} */
const content = document.getElementById('help-content');

// Main
/** @type {number} */
let cubeRotation = 0.0;
/**@type {HollowObject} */
let hollowObject = null;
/**@type {WebGlManager} */
let webglManager = null;

// Utility.
/** @type {number} */
const middleX = canvas.width / 2;
/** @type {number} */
const middleY = canvas.height / 2;
/** @type {boolean} */
let isHelpActive = false;

