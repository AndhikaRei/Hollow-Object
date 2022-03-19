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

        // console.log(vertices);
        
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

const loadHollowCube = () => {
    // Generate random color. Will be used on every face.
    let randomColor = randomRGB();

    // Edge width
    const eW = 0.2;
    // All vertices in hollow object.
    // Not all vertices are going to be used.
    let vertices = [
        // Block 0
        [-1.0, -1.0, 1.0], // 0
        [-1.0 + eW, -1.0, 1.0], // 1
        [-1.0 + eW, -1.0 + eW, 1.0], // 2
        [-1.0, -1.0 + eW, 1.0], // 3
        [-1.0, -1.0, 1.0 - eW], // 4
        [-1.0 + eW, -1.0, 1.0 - eW], // 5
        [-1.0 + eW, -1.0 + eW, 1.0 - eW], // 6
        [-1.0, -1.0 + eW, 1.0 - eW], // 7

        // Block 1
        [1.0 - eW, -1.0, 1.0], // 8
        [1.0, -1.0, 1.0], // 9
        [1.0, -1.0 + eW, 1.0], // 10
        [1.0 - eW, -1.0 + eW, 1.0], // 11
        [1.0 - eW, -1.0, 1.0 - eW], // 12
        [1.0, -1.0, 1.0 - eW], // 13
        [1.0, -1.0 + eW, 1.0 - eW], // 14
        [1.0 - eW, -1.0 + eW, 1.0 - eW], // 15

        // Block 2
        [1.0 - eW, -1.0, -1.0 + eW], // 16
        [1.0 , -1.0, -1.0 + eW], // 17
        [1.0, -1.0 + eW, -1.0 + eW], // 18
        [1.0 - eW, -1.0 + eW, -1.0 + eW], // 19
        [1.0 - eW, -1.0, -1.0], // 20
        [1.0, -1.0, -1.0], // 21
        [1.0, -1.0 + eW, -1.0], // 22
        [1.0 - eW, -1.0 + eW, -1.0], // 23

        // Block 3
        [-1.0, -1.0, -1.0 + eW], // 24
        [-1.0 + eW, -1.0, -1.0 + eW], // 25
        [-1.0 + eW, -1.0 + eW, -1.0 + eW], // 26
        [-1.0, -1.0 + eW, -1.0 + eW], // 27
        [-1.0, -1.0, -1.0], // 28
        [-1.0 + eW, -1.0, -1.0], // 29
        [-1.0 + eW, -1.0 + eW, -1.0], // 30
        [-1.0, -1.0 + eW, -1.0], // 31

        // Block 4
        [-1.0, 1.0 - eW, 1.0], // 32
        [-1.0 + eW, 1.0 - eW, 1.0], // 33
        [-1.0 + eW, 1.0, 1.0], // 34
        [-1.0, 1.0, 1.0], // 35
        [-1.0, 1.0 - eW, 1.0 - eW], // 36
        [-1.0 + eW, 1.0 - eW, 1.0 - eW], // 37
        [-1.0 + eW, 1.0, 1.0 - eW], // 38
        [-1.0, 1.0, 1.0 - eW], // 39

        // Block 5
        [1.0 - eW, 1.0 - eW, 1.0], // 40
        [1.0, 1.0 - eW, 1.0], // 41
        [1.0, 1.0, 1.0], // 42
        [1.0 - eW, 1.0, 1.0], // 43
        [1.0 - eW, 1.0 - eW, 1.0 - eW], // 44
        [1.0, 1.0 - eW, 1.0 - eW], // 45
        [1.0, 1.0, 1.0 - eW], // 46
        [1.0 - eW, 1.0, 1.0 - eW], // 47
        
        // Block 6
        [1.0 - eW, 1.0 - eW, -1.0 + eW], // 48
        [1.0, 1.0 - eW, -1.0 + eW], // 49
        [1.0, 1.0, -1.0 + eW], // 50
        [1.0 - eW, 1.0, -1.0 + eW], // 51
        [1.0 - eW, 1.0 - eW, -1.0], // 52
        [1.0, 1.0 - eW, -1.0], // 53
        [1.0, 1.0, -1.0], // 54
        [1.0 - eW, 1.0, -1.0], // 55

        // Block 7
        [-1.0, 1.0 - eW, -1.0 + eW], // 56
        [-1.0 + eW, 1.0 - eW, -1.0 + eW], // 57
        [-1.0 + eW, 1.0, -1.0 + eW], // 58
        [-1.0, 1.0, -1.0 + eW], // 59
        [-1.0, 1.0 - eW, -1.0], // 60
        [-1.0 + eW, 1.0 - eW, -1.0], // 61
        [-1.0 + eW, 1.0, -1.0], // 62
        [-1.0, 1.0, -1.0] // 63
    ];

    // All edges in hollow object.
    let edges = [
        // Edges from block 0 to block 1.
        new Edge([
            [0, 9, 10, 3], // Front face.
            [4, 13, 14, 7], // Back face.
            [3, 10, 14, 7], // Top face.
            [0, 9, 13, 4], // Bottom face.
            [9, 13, 10, 14], // Right face.
            [0, 3, 7, 4], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor, 
            randomColor, 
            randomColor, 
            randomColor,
            randomColor,
            randomColor
        ]), 
        // Edges from block 1 to block 2.
        new Edge([
            [8, 9, 10, 11], // Front face.
            [20, 21, 22, 23], // Back face.
            [11, 10, 22, 23], // Top face.
            [8, 9, 21, 20], // Bottom face.
            [9, 21, 10, 22], // Right face.
            [8, 11, 23, 20], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 2 to block 3.
        new Edge([
            [24, 17, 18, 27], // Front face.
            [28, 21, 22, 31], // Back face.
            [27, 18, 22, 31], // Top face.
            [24, 17, 21, 28], // Bottom face.
            [17, 21, 18, 22], // Right face.
            [24, 27, 31, 28], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,    
            randomColor
        ]),
        // Edges from block 3 to block 0.
        new Edge([
            [0, 1, 2, 3], // Front face.
            [28, 29, 30, 31], // Back face.
            [3, 2, 30, 31], // Top face.
            [0, 1, 29, 28], // Bottom face.
            [1, 29, 2, 30], // Right face.
            [0, 3, 31, 28], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 4 to block 5.
        new Edge([
            [32, 41, 42, 35], // Front face.
            [36, 45, 46, 39], // Back face.
            [35, 42, 46, 39], // Top face.
            [32, 41, 45, 36], // Bottom face.
            [41, 45, 42, 46], // Right face.
            [32, 35, 39, 36], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 5 to block 6.
        new Edge([
            [40, 41, 42, 43], // Front face.
            [52, 53, 54, 55], // Back face.
            [43, 42, 54, 55], // Top face.
            [40, 41, 53, 52], // Bottom face.
            [41, 53, 42, 54], // Right face.
            [40, 43, 55, 52], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 6 to block 7.
        new Edge([
            [56, 49, 50, 59], // Front face.
            [60, 53, 54, 63], // Back face.
            [59, 50, 54, 63], // Top face.
            [56, 49, 53, 60], // Bottom face.
            [49, 53, 50, 54], // Right face.
            [56, 59, 63, 60], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 7 to block 4.
        new Edge([
            [32, 33, 34, 35], // Front face.
            [60, 61, 62, 63], // Back face.
            [35, 34, 62, 63], // Top face.
            [32, 33, 61, 60], // Bottom face.
            [33, 61, 34, 62], // Right face.
            [32, 35, 63, 60], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]), 
        // Edges from block 0 to block 4.
        new Edge([
            [0, 1, 34, 35], // Front face.
            [4, 5, 38, 39], // Back face.
            [35, 34, 38, 39], // Top face.
            [0, 1, 5, 4], // Bottom face.
            [1, 5, 34, 38], // Right face.
            [0, 35, 39, 4], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 1 to block 5.
        new Edge([
            [8, 9, 42, 43], // Front face.
            [12, 13, 46, 47], // Back face.
            [43, 42, 46, 47], // Top face.
            [8, 9, 13, 12], // Bottom face.
            [9, 13, 42, 46], // Right face.
            [8, 43, 47, 12], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]),
        // Edges from block 2 to block 6.
        new Edge([
            [16, 17, 50, 51], // Front face.
            [20, 21, 54, 55], // Back face.
            [51, 50, 54, 55], // Top face.
            [16, 17, 21, 20], // Bottom face.
            [17, 21, 50, 54], // Right face.
            [16, 51, 55, 20], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ]), 
        // Edges from block 3 to block 7.
        new Edge([
            [24, 25, 58, 59], // Front face.
            [28, 29, 62, 63], // Back face.
            [59, 58, 62, 63], // Top face.
            [24, 25, 29, 28], // Bottom face.
            [25, 29, 58, 62], // Right face.
            [24, 59, 63, 28], // Left face.
        ], [
            // Fill all face with generated color.
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor,
            randomColor
        ])
    ];

    return new HollowObject(vertices, edges);
}
