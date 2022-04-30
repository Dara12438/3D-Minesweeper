import { Group } from 'three';
import { Cube } from 'objects';
import * as THREE from 'three';

class FilledGrid extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        this.name = 'filled';
        this.numBombs = 20;
        this.size = 10;
        this.cubes = [];
        const offset = this.size/2;

        // create cubes
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                for (let z = 0; z < this.size; z++) {
                    const cube = new Cube();
                    cube.mesh.position.copy(new THREE.Vector3(x, y, z).subScalar(offset));
                    this.cubes.push(cube.mesh);
                }
            }
        }
        
        // create bombs
        this.bombs = [];
        let index = 0;
        while (index < this.numBombs) {
            const rand = Math.floor(Math.random() * this.cubes.length);

            if (!this.cubes[rand].isBomb) {
                this.cubes[rand].isBomb = true;
                this.bombs.push(this.cubes[rand]);
                index++;
            }
        }

        // determine neighboring bombs
        for (let i = 0; i < this.cubes.length; i++) {
            for (let j = 0; j < this.bombs.length; j++) {
                const pos = this.cubes[i].position.clone();
                const curr = this.bombs[j];

                const isNeighbor = curr.position.equals(pos.clone().setX(pos.x - 1)) ||
                curr.position.equals(pos.clone().setX(pos.x - 1).setY(pos.y - 1)) ||
                curr.position.equals(pos.clone().setX(pos.x - 1).setY(pos.y - 1).setZ(pos.z - 1)) ||
                curr.position.equals(pos.clone().setX(pos.x - 1).setY(pos.y - 1).setZ(pos.z + 1)) ||
                curr.position.equals(pos.clone().setX(pos.x - 1).setY(pos.y + 1)) ||
                curr.position.equals(pos.clone().setX(pos.x - 1).setY(pos.y + 1).setZ(pos.z - 1)) ||
                curr.position.equals(pos.clone().setX(pos.x - 1).setY(pos.y + 1).setZ(pos.z + 1)) ||
                curr.position.equals(pos.clone().setX(pos.x - 1).setZ(pos.z - 1)) ||
                curr.position.equals(pos.clone().setX(pos.x - 1).setZ(pos.z + 1)) ||
                curr.position.equals(pos.clone().setX(pos.x + 1)) ||
                curr.position.equals(pos.clone().setX(pos.x + 1).setY(pos.y - 1)) ||
                curr.position.equals(pos.clone().setX(pos.x + 1).setY(pos.y - 1).setZ(pos.z - 1)) ||
                curr.position.equals(pos.clone().setX(pos.x + 1).setY(pos.y - 1).setZ(pos.z + 1)) ||
                curr.position.equals(pos.clone().setX(pos.x + 1).setY(pos.y + 1)) ||
                curr.position.equals(pos.clone().setX(pos.x + 1).setY(pos.y + 1).setZ(pos.z - 1)) ||
                curr.position.equals(pos.clone().setX(pos.x + 1).setY(pos.y + 1).setZ(pos.z + 1)) ||
                curr.position.equals(pos.clone().setX(pos.x + 1).setZ(pos.z - 1)) ||
                curr.position.equals(pos.clone().setX(pos.x + 1).setZ(pos.z + 1)) ||
                curr.position.equals(pos.clone().setY(pos.y - 1)) ||
                curr.position.equals(pos.clone().setY(pos.y - 1).setZ(pos.z - 1)) ||
                curr.position.equals(pos.clone().setY(pos.y - 1).setZ(pos.z + 1)) ||
                curr.position.equals(pos.clone().setY(pos.y + 1)) ||
                curr.position.equals(pos.clone().setY(pos.y + 1).setZ(pos.z - 1)) ||
                curr.position.equals(pos.clone().setY(pos.y + 1).setZ(pos.z + 1)) ||
                curr.position.equals(pos.clone().setZ(pos.z - 1)) ||
                curr.position.equals(pos.clone().setZ(pos.z + 1));

                if (isNeighbor) {
                    this.cubes[i].numNeighbors++;
                }
            }
        }
    }

    // cubeMeshes() {
    //     const mesh = [];
    //     for (const cubes of this.cubes) {
    //         mesh.push(cubes.mesh);
    //     }
    //     return mesh
    // }

    unrevealedCubes() {
        const unrevealed = [];
        for (const cubes of this.cubes) {
            if (!cubes.reveal) {
                unrevealed.push(cubes);
            }
        }
        return unrevealed
    }

    // removeCube(cube) {
    //     this.cubes.splice(this.cubes.findIndex(element => element.mesh.uuid == cube.uuid), 1);
    // }
}

export default FilledGrid;