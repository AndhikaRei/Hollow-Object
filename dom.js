'use strict';

const resetDefault = () => {
    // Reset translate.
    translateXSlider.value = 0;
    translateXValue.innerHTML = 0;
    webglManager.translateValue[0] = 0;
    translateYSlider.value = 0;
    translateYValue.innerHTML = 0;
    webglManager.translateValue[1] = 0;
    translateZslider.value = 0;
    translateZValue.innerHTML = 0;
    webglManager.translateValue[2] = 0;
    
    // Reset rotate
    rotateXSlider.value = 0;
    rotateXValue.innerHTML = 0;
    webglManager.rotateAngle[0] = 0;
    rotateYSlider.value = 0;
    rotateYValue.innerHTML = 0;
    webglManager.rotateAngle[1] = 0;
    rotateZSlider.value = 0;
    rotateZValue.innerHTML = 0;
    webglManager.rotateAngle[2] = 0;

    // Reset scale
    scaleXSlider.value = 1;
    scaleXValue.innerHTML = 1;
    webglManager.scaleValue[0] = 1;
    scaleYSlider.value = 1;
    scaleYValue.innerHTML = 1;
    webglManager.scaleValue[1] = 1;
    scaleZSlider.value = 1;
    scaleZValue.innerHTML = 1;
    webglManager.scaleValue[2] = 1;

    // Reset camera
    cameraRadiusSlider.value = 5;
    cameraRadiusValue.innerHTML = 5;
    webglManager.cameraRadius = 5;
    cameraRotateSlider.value = 0;
    cameraRotateValue.innerHTML = 0;
    webglManager.cameraRotation = 0;

    // Reset projection type.
    projectionView.value = 2;
    webglManager.projectionType = 2;

    webglManager.drawHollowObjectScene();
}

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
        webglManager.drawHollowObjectScene();
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
        translateXSlider.value/ (webglManager.gl.canvas.clientWidth/4) ;
    webglManager.drawHollowObjectScene();
});
translateYSlider.addEventListener('input', () => {
    webglManager.translateValue[1] =
        translateYSlider.value/ (webglManager.gl.canvas.clientHeight/4);
    translateYValue.innerHTML = translateYSlider.value;
    webglManager.drawHollowObjectScene();
});
translateZslider.addEventListener('input', () => {
    // TODO: Implement action in webglManager.
    webglManager.translateValue[2] = translateZslider.value / 100;
    translateZValue.innerHTML = translateZslider.value;
    webglManager.drawHollowObjectScene();
});

// Rotate slider.
rotateXSlider.addEventListener('input', () => {
    webglManager.rotateAngle[0] = rotateXSlider.value;
    rotateXValue.innerHTML = rotateXSlider.value;
    webglManager.drawHollowObjectScene();
});
rotateYSlider.addEventListener('input', () => {
    webglManager.rotateAngle[1] = rotateYSlider.value;
    rotateYValue.innerHTML = rotateYSlider.value;
    webglManager.drawHollowObjectScene();
});
rotateZSlider.addEventListener('input', () => {
    webglManager.rotateAngle[2] = rotateZSlider.value;
    rotateZValue.innerHTML = rotateZSlider.value;
    webglManager.drawHollowObjectScene();
});

// Scale slider.
scaleXSlider.addEventListener('input', () => {
    webglManager.scaleValue[0] = scaleXSlider.value;
    scaleXValue.innerHTML = scaleXSlider.value;
    webglManager.drawHollowObjectScene();
});
scaleYSlider.addEventListener('input', () => {
    webglManager.scaleValue[1] = scaleYSlider.value;
    scaleYValue.innerHTML = scaleYSlider.value;
    webglManager.drawHollowObjectScene();
});
scaleZSlider.addEventListener('input', () => {
    webglManager.scaleValue[2] = scaleZSlider.value;
    scaleZValue.innerHTML = scaleZSlider.value;
    webglManager.drawHollowObjectScene();
});

// Camera slider.
cameraRadiusSlider.addEventListener('input', () => {
    webglManager.cameraRadius = cameraRadiusSlider.value;
    cameraRadiusValue.innerHTML = cameraRadiusSlider.value;
    webglManager.drawHollowObjectScene();
});
cameraRotateSlider.addEventListener('input', () => {
    webglManager.cameraRotation = cameraRotateSlider.value;
    cameraRotateValue.innerHTML = cameraRotateSlider.value;
    webglManager.drawHollowObjectScene();
});

// Projection View
projectionView.addEventListener('change', () => {
    webglManager.projectionType = projectionView.value;
    webglManager.drawHollowObjectScene();
});

// Default View.
defaultViewButton.addEventListener('click', () => {
    resetDefault();
});