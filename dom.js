'use strict';

/**
 * @description imports json file to render, json file from export above
 */
 const importData = () => {
    var fileInput = document.getElementById('fileinput');
    var data = fileInput.files[0];

    if (!data) {
        alert('File gagal di-import');
        return;
    }

    var reader = new FileReader();
    reader.onload = (e) => {
        try {
            let hollowObj = JSON.parse(e.target.result);
            if (!hollowObj) return;
            // Construct new egde object from parsed json.
            let edges = [];
            for (let i = 0; i < hollowObj.edge.length; i++) {
                let currentEdge = hollowObj.edge[i];
                let currentTopology = currentEdge.topology;
                let newTopology = [];
                for (let j = 0; j < currentTopology.length; j++) {
                    let currentFace = currentTopology[j];
                    let newFace = [];
                    for (let k = 0; k < currentFace.length; k++) {
                        let currentVertex = currentFace[k];
                        newFace.push(currentVertex);
                    }
                    newTopology.push(newFace);
                }
                let newEdge = new Edge(currentEdge.color, newTopology);
                edges.push(newEdge);
            }

            // Construct new vertex object from parsed json.
            let vertices = [];
            for (let i = 0; i < hollowObj.vertices.length; i++) {
                let currentVertex = hollowObj.vertices[i];
                vertices.push(currentVertex);
            }

            // Construct new hollow object from parsed json.
            hollowObject = new HollowObject(vertices, edges);
            webglManager.initBuffersHollow(hollowObject);
        } catch (e) {
            alert('File gagal di-import');
            return;
        }


    };
    reader.readAsText(data);
};

