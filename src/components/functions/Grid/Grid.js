import { Group } from 'three';
import { Cube } from 'objects';
import * as THREE from 'three';

class Grid extends Group {
    constructor () {
        // Call parent Group() constructor
        super();

        this.name = 'grid';
        this.numBombs = 10;
        this.size = 10;
        this.cubes = [];
    }

    initializeCubes () {
        const numCubes = Math.pow(this.size, 3) - Math.pow(this.size - 2, 3);

        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                for (let z = 0; z < this.size; z++) {
                    // if (x == 0 || x == this.size - 1 || y == 0 || y == this.size - 1 || z == 0 || z == this.size - 1) {
                        const cube = new Cube();
                        cube.position.copy(new THREE.Vector3(x, y, z));
                        console.log(cube);
                        this.cubes.push(cube);
                    // }
                }
            }
        }
    }
}

export default Grid;
