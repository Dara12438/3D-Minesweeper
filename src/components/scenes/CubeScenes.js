import { Scene, Color } from 'three';
import * as THREE from 'three';
import { BasicLights } from 'lights';
import { CubeGrids } from "../Grids";

class CubeScenes extends Scene {
    constructor(isFilled, difficulty, size) {
        // Call parent Scene() constructor
        super();

        this.background = new Color(0x7ec0ee);
        this.gameOver = false;
        this.text = "You hit a bomb!";

        // Add meshes to scene
        const lights = new BasicLights();
        this.add(lights);
        this.grid = new CubeGrids(isFilled, difficulty, size);
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
        if (cube != undefined && !cube.isBomb) {
            // reveals cluster of blank cubes 
            this.grid.revealCubes(cube, this);
            this.grid.removeRevealedCubes();
            this.gameOver = this.grid.checkWin();
            if (this.gameOver) {
                this.text = "You Win!";
            }
        }
        // bomb was hit
        else if (cube != undefined && cube.isBomb) {
            this.grid.revealBombs();
            this.gameOver = true;
        }

        // if (this.gameOver) {
        //     const textGeo = new THREE.TextGeometry( this.text, {
        //         font: font,
        //         size: 80,
        //         height: 5,
        //         curveSegments: 12,
        //         bevelEnabled: true,
        //         bevelThickness: 10,
        //         bevelSize: 8,
        //         bevelOffset: 0,
        //         bevelSegments: 5
        //     });
        //     textMesh1 = new THREE.Mesh( textGeo, materials );
        // }
    }
    
    // places markers on unrevealed cubes
    flagCube(event, camera) {
        const cube = this.getNearestCube(event, camera);
        if (cube != undefined) {
            this.grid.flag(cube);
        }
    }
}

export default CubeScenes;
