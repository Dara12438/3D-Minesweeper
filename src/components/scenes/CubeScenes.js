import { Scene, Color } from 'three';
import * as THREE from 'three';
import { BasicLights } from 'lights';
import { CubeGrids } from "../Grids";

class CubeScenes extends Scene {
    constructor(isFilled, difficulty, size, images) {
        // Call parent Scene() constructor
        super();

        this.background = new Color(0x7ec0ee);
        this.gameOver = false;
        this.gameOverText = "You Win!";

        // Add meshes to scene
        const lights = new BasicLights();
        this.add(lights);
        this.grid = new CubeGrids(isFilled, difficulty, size, images);
        for (const cubes of this.grid.cubes) {
            this.add(cubes);
        }
        

        this.divElements = [];
        const text = "Bombs Left: ";
        const flagText = this.createText(text + this.bombsLeft(), '20px', '20px', '20px');
        this.divElements.push(flagText);
    }

    bombsLeft() {
        return this.grid.unMarkedBombs;
    }

    createText(str, top, left, size) {
        const text = document.createElement('div');
        document.body.appendChild(text);
        text.innerHTML = str;
        text.style.fontFamily = 'Monaco';
        text.style.fontSize = size;
        text.style.position = 'absolute';
        text.style.left = left;
        text.style.top = top;
        return text;
    }

    displayBombsLeft() {
        if (this.divElements.length == 1) {
            this.divElements.forEach((startingPart) => startingPart.remove());
            this.divElements = [];
        }
        
        const text = "Bombs Left: ";
        const flagText = this.createText(text + this.bombsLeft(), '20px', '20px', '20px');
        this.divElements.push(flagText);
    }
    
    // places markers on unrevealed cubes
    flagCube(event, camera) {
        const cube = this.getNearestCube(event, camera);
        if (cube != undefined) {
            this.grid.flag(cube);
            return 1;
        }
    }

    // returns first unrevealed cube that the mouse intersects
    getNearestCube(event, camera) {
        const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
        const raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(this.children, false);
        if (intersects.length > 0 && !intersects[0].object.reveal) {
            return intersects[0].object;
        }
    }

    // highlights unrevealed cube
    highlightCube(event, camera) {
        const cube = this.getNearestCube(event, camera);
        for (const cubes of this.grid.cubes) {
            this.grid.highlight(cube, cubes);
        }
    }

    // reveals clicked cube
    revealCube(event, camera) {
        const cube = this.getNearestCube(event, camera);
        if (cube != undefined && !cube.isBomb) {
            // reveals cluster of blank cubes 
            this.grid.revealCubes(cube, this);
            this.grid.removeRevealedCubes();
            this.gameOver = this.grid.checkWin();
        }
        // bomb was hit
        else if (cube != undefined && cube.isBomb) {
            this.grid.revealBombs();
            this.gameOver = true;
            this.gameOverText = "You hit a bomb!";
        }

        if (this.gameOver) {
            const message = this.createText(this.gameOverText, '20%', '10px', '40px');
            message.style.left = (window.innerWidth - message.clientWidth) / 2 + 'px';
            if (this.gameOverText == "You Win!") {
                message.style.color = 'green';
            }
            else {
                message.style.color = 'red'; 
            }
            this.divElements.push(message);
        }

        if (cube != undefined) {
            return 1;
        }
    }
}

export default CubeScenes;
