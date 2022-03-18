'use strict';

// Object Definition.
/**
 * Shape Class Definition.
 * Represent shape that can be drawn in CAD.
 */
class Shape {
    /**
     * Constructor.
     * @param {string} id - Shape id.
     * @param {string} type - Gl method to draw this shape, ex: gl.LINES.
     * @param {number[]} vertices - Shape array of coordinate, ex [0.5, 0.5, 0.5].
     * @param {number[]} rgbVal - Shape array of rgb color, ex [0.5, 0.5, 0.5].
     * @param {array} edges - Shape name.
     */
    constructor(id, type, vertices, rgbVal, shapeName) {
        this.id = id;
        this.type = type;
        this.shapeName = shapeName;
        this.vertices = vertices;
        this.rgbVal = rgbVal;
    }
}

/**
 * Shape Point Class Definition.
 * Represent edge in shape.
 */
class ShapePoint {
    /**
     * Constructor.
     * @param {number} object_id - Corresponding shape id.
     * @param {number[]} vertices - Array of , ex [0.5, 0.5, 0.5].
     */
    constructor(object_id, vertices) {
        this.object_id = object_id;
        this.vertices = vertices;
    }
}


// Vertex Shader configuration.
/** @type {string} */
const vert = `
	// Attribute that receive data from buffer.
	attribute vec2 position;	
	
	// Vertex Shader main program.
	void main() {
		// Special variable in vertex shader. 
		gl_Position = vec4(position, 0.0, 1.0);
	}
`;

// Fragmen Shader configuration.
/** @type {string} */
const frag = `
	// Fragment shader precision.
	precision highp float;
	
	// Attribute that receive data from buffer.
	uniform vec4 color;
	
	// Fragment Shader main program.
	void main() {
  		gl_FragColor = color;
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


// Utility.
/** @type {number} */
const middleX = canvas.width / 2;
/** @type {number} */
const middleY = canvas.height / 2;
/** @type {boolean} */
let isHelpActive = false;

const toggleRecoloring = (state) => {
    if (isDragging || isResizing) {
        return alert('Anda sedang melakukan resizing/dragging.');
    }
    if (state === undefined || state === null) {
        isRecoloring = !isRecoloring;
    } else {
        isRecoloring = state;
    }

    if (isRecoloring) {
        showTask('Mengubah warna');
        container.classList.add('bucket');
    } else {
        hideTask();
        container.classList.remove('bucket');
    }
};

const toggleDragging = (state) => {
    if (isResizing || isRecoloring) {
        return alert('Anda sedang melakukan resizing/recoloring.');
    }
    if (state === undefined || state === null) {
        isDragging = !isDragging;
    } else {
        isDragging = state;
    }

    if (isDragging) {
        container.classList.add('grabbing');
        const task = setTimeout(() => {
            showTask('Mengubah posisi ' + draggingMetadata.shapeName);
            clearTimeout(task);
        }, 10);
    } else {
        container.classList.remove('grabbing');
        hideTask();
    }
};

const toggleResizing = (state) => {
    if (isDragging || isRecoloring) {
        return alert('Anda sedang melakukan dragging/recoloring.');
    }
    if (state === undefined || state === null) {
        isResizing = !isResizing;
    } else {
        isResizing = state;
    }

    if (isResizing) {
        showTask('Meresize bentuk');
        container.classList.add('resizing');
    } else {
        hideTask();
        container.classList.remove('resizing');
    }
};
