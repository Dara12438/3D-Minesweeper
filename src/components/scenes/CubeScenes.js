import { Scene, Color} from 'three';
import { BasicLights } from 'lights';
import * as THREE from 'three';
import { CubeGrids } from "../Grids";

class CubeScenes extends Scene {
    constructor(isFilled) {
        // Call parent Scene() constructor
        super();

        this.background = new Color(0x7ec0ee);
        this.gameOver = false;

        // Add meshes to scene
        const lights = new BasicLights();
        this.add(lights);
        this.grid = new CubeGrids(isFilled);
        for (const cubes of this.grid.cubes) {
            this.add(cubes);
        }
    }

    // returns first unrevealed cube that the mouse intersects
    getNearestCube(event, camera) {
        const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
        const raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(this.grid.cubes, false);
        if (intersects.length > 0) {
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
        if (cube != undefined && !cube.isBomb && !cube.reveal) {
            // reveals cluster of blank cubes 
            this.grid.revealCubes(cube, this);
            this.grid.removeRevealedCubes();
            this.gameOver = this.grid.checkWin();
        }
        // bomb was hit
        else if (cube != undefined && cube.isBomb) {
            this.grid.revealBombs();
            this.gameOver = true;
        }
    }
    
    // places markers on unrevealed cubes
    flagCube(event, camera) {
        const cube = this.getNearestCube(event, camera);
        this.grid.flag(cube);
    }
}

export default CubeScenes;
