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

/**
 * Event listener
 */
// Translate slider.
translateXSlider.addEventListener('input', () => {
    translateXValue.innerHTML = translateXSlider.value;
    webglManager.translateValue[0] = 
        translateXSlider.value/ webglManager.gl.canvas.clientWidth ;
    webglManager.drawHollowObjectScene();
});
translateYSlider.addEventListener('input', () => {
    webglManager.translateValue[1] =
        translateYSlider.value/ webglManager.gl.canvas.clientHeight;
    translateYValue.innerHTML = translateYSlider.value;
    webglManager.drawHollowObjectScene();
});
translateZslider.addEventListener('input', () => {
    // TODO: Implement action in webglManager.
    webglManager.translateValue[2] = translateZslider.value;
    translateZValue.innerHTML = translateZslider.value;
    webglManager.drawHollowObjectScene();
});

// Rotate slider.
rotateXSlider.addEventListener('input', () => {
    // TODO: Implement action in webglManager.
    rotateXValue.innerHTML = rotateXSlider.value;
});
rotateYSlider.addEventListener('input', () => {
    // TODO: Implement action in webglManager.
    rotateYValue.innerHTML = rotateYSlider.value;
});
rotateZSlider.addEventListener('input', () => {
    // TODO: Implement action in webglManager.
    rotateZValue.innerHTML = rotateZSlider.value;
});

// Scale slider.
scaleXSlider.addEventListener('input', () => {
    // TODO: Implement action in webglManager.
    scaleXValue.innerHTML = scaleXSlider.value;
});
scaleYSlider.addEventListener('input', () => {
    // TODO: Implement action in webglManager.
    scaleYSlider.value = scaleYSlider.value;
});
scaleZSlider.addEventListener('input', () => {
    // TODO: Implement action in webglManager.
    scaleZValue.innerHTML = scaleZSlider.value;
});

// Camera slider.
cameraRadiusSlider.addEventListener('input', () => {
    // TODO: Implement action in webglManager.
    cameraRadiusSlider.value = cameraRadiusSlider.value;
});
cameraRotateSlider.addEventListener('input', () => {
    // TODO: Implement action in webglManager.
    cameraRotateValue.innerHTML = cameraRotateSlider.value;
});


