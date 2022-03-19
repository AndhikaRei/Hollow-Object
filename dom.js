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
        let hollowObj = null;
        try {
            hollowObj = JSON.parse(e.target.result);
            if (!hollowObj) return;
            
        } catch (e) {
            // Alert error message.
            alert(e.message);
            return;
        }

        // Construct new egde object from parsed json.
        let edges = [];
        for (let i = 0; i < hollowObj.edge.length; i++) {
            let currentEdge = hollowObj.edge[i];
            let newEdge = new Edge(currentEdge.topology, currentEdge.color);
            edges.push(newEdge);
        }

        // Construct new vertex object from parsed json.
        let vertices = hollowObj.vertices;

        // Construct new hollow object from parsed json.
        hollowObject = null;
        hollowObject = new HollowObject(vertices, edges);
        webglManager.clearScreen();
        webglManager.initBuffersHollow(hollowObject);
        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(render);

    };
    reader.readAsText(data);
};

