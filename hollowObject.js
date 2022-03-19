'use strict';

/**
 * Class Edge.
 * @classdesc Edge is representation of 'rusuk' in hollow object. Remember that edge in hollow object is a
 * 3d line.
 */
class Edge {
    /**
     * @description Constructor of edge class.
     * @param {number[][]} topology - List of list of vertices that represent edge faces. 
     * @param {number[][]} color - List of list of integer that represent edge faces color.
     */
    constructor(topology, color) {
        /**
         * @description List of list of vertices that represent edge faces.
         * @type {number[][]}
         * @public
         * @example [[0, 1, 2, 3]] means there are 1 face with 4 vertices. Vertices index 0, 1, 2, and 3.
         * You can find the corresponding vertices in hollow object class.
         */
        this.topology = topology;
        
        /**
         * @description List of list of integer that represent edge faces color.
         * @type {number[][4]}
         * @public
         */
        this.color = color;
    }
}

/**
 * Class HollowObject.
 * @classdesc HollowObject is representation of hollow object. Hollow object is a 3d object that can be
 * drawn in CAD that contain only edge.
 */
class HollowObject {
    /**
     * @description Constructor of hollow object class.
     * @param {number[][]} vertices - List of list of vertices in hollow object.
     * @param {Edge[]} edges - List of edge in hollow object.
     **/
    constructor(vertices, edges) {
        /**
         * @description List of list of vertices in hollow object.
         * @type {number[][]}
         * @public
         */
        this.vertices = vertices;
        
        /**
         * @description List of edge in hollow object.
         * @type {Edge[]}
         * @public
         */
        this.edge = edges;
    }

    /**
     * @typedef {Object} WebGLBufferData
     * @property {number[][]} glVertices - Transformed vertices. 
     * @property {number[][]} glFaceColors - Transformed shape color.
     */

    /**
     * @description Transform vertices and shape color so it can be used in WebGL.
     * @return {WebGLBufferData} Flattened vertices and shape color.
     */
    getWebGlBufferData() {
        /**
         * @type {number[][]}
         */
        let glVertices = [];

        /**
         * @type {number[][]}
         */
        let glFaceColors = [];

        let NumEdges = this.edge.length;
        for (let i = 0; i < NumEdges; i++) {
            let currentEdge = this.edge[i];
            let currentTopology = currentEdge.topology;
            /**
            * @type {number[]}
            */
            let currentEdgeVertices = []
            /**
            * @type {number[]}
            */
            let currentEdgeColors = []
            let NumFaces = currentTopology.length;
            
            for (let j = 0; j < NumFaces; j++) {
                let currentFace = currentTopology[j];
                let NumVertices = currentFace.length;
                for (let k = 0; k < NumVertices; k++) {
                    let currentVertex = this.vertices[currentFace[k]];
                    currentEdgeVertices.push(...currentVertex);
                }
                let currentColor = currentEdge.color[j];
                currentEdgeColors.push(currentColor);
            }
            glVertices.push(currentEdgeVertices);
            glFaceColors.push(currentEdgeColors);
        }

        return {
            glVertices: glVertices,
            glFaceColors: glFaceColors
        };
    }
}

/**
 * @description Create basic hollow object with shape like a cube.
 * @returns {HollowObject}
 */
const loadBasicCube = () => {
    // All vertices in hollow object.
    let vertices = [
		[-1.0, -1.0, 1.0], // 0
        [1.0, -1.0, 1.0], // 1
        [1.0, 1.0, 1.0], // 2
        [-1.0, 1.0, 1.0], // 3
        [-1.0, -1.0, -1.0], // 4
        [1.0, -1.0, -1.0], // 5
        [1.0, 1.0, -1.0], // 6
        [-1.0, 1.0, -1.0] // 7
	];

    // All edges in hollow object.
    // Because cube is not hollow then each edge only contain one faces and one color.
    let edges = [
        new Edge([
            [0, 1, 2, 3], // Front Face
            [4, 5, 6, 7], // Back Face
            [2, 3, 7, 6], // Top Face
            [0, 1, 5, 4], // Bottom Face
            [1, 2, 6, 5], // Right Face
            [0, 3, 7, 4], // Left Face
        ], [
            [1.0, 1.0, 1.0, 1.0], // Front Face: white
            [1.0, 0.0, 0.0, 1.0], // Back Face: red
            [0.0, 1.0, 0.0, 1.0], // Top Face: green
            [0.0, 0.0, 1.0, 1.0], // Bottom Face: blue
            [1.0, 1.0, 0.0, 1.0], // Right Face: yellow
            [1.0, 0.0, 1.0, 1.0] // Left Face: purple
        ])
    ];

    return new HollowObject(vertices, edges);
}
