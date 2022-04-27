import * as THREE from 'three';
import { Cube } from 'objects';

function HollowGrid () {
    this.name = 'hollow';
    this.numBombs = 10;
    this.size = 10;
    this.cubes = [];

    // create cubes
    for (let x = 0; x < this.size; x++) {
        for (let y = 0; y < this.size; y++) {
            for (let z = 0; z < this.size; z++) {
                if (x == 0 || x == this.size - 1 || y == 0 || y == this.size - 1 || z == 0 || z == this.size - 1) {
                    const cube = new Cube();
                    cube.position.copy(new THREE.Vector3(x, y, z));
                    this.cubes.push(cube);
                }
            }
        }
    }

    // create bombs
    const bombs = [];
    let index = 0;
    while(index < this.numBombs){
        rand = Math.floor(Math.random() * this.cubes.length);

        if(!this.cubes[rand].isBomb){
            this.cubes[index].isBomb = true;
            bombs.push(this.cubes[rand]);
            index++;
        } 
    }

    // determine neighboring bombs
    for(let i = 0; i < this.cubes.length; i++) {
        for(let j = 0; j < this.bombs.length; j++) {
            const pos = cubes[i].position.clone();

            if (this.bombs[j].position.equals(pos.clone().setX(pos.x - 1))) {
                this.cubes[i].numNeighbors ++;
            }
            if (this.bombs[j].position.equals(pos.clone().setX(pos.x - 1).setY(pos.y - 1))) {
                this.cubes[i].numNeighbors ++;
            }
            if (this.bombs[j].position.equals(pos.clone().setX(pos.x - 1).setY(pos.y - 1).setZ(pos.z - 1))) {
                this.cubes[i].numNeighbors ++;
            }
            if (this.bombs[j].position.equals(pos.clone().setX(pos.x - 1).setY(pos.y - 1).setZ(pos.z + 1))) {
                this.cubes[i].numNeighbors ++;
            }
            if (this.bombs[j].position.equals(pos.clone().setX(pos.x - 1).setY(pos.y + 1))) {
                this.cubes[i].numNeighbors ++;
            }
            if (this.bombs[j].position.equals(pos.clone().setX(pos.x - 1).setY(pos.y + 1).setZ(pos.z - 1))) {
                this.cubes[i].numNeighbors ++;
            }
            if (this.bombs[j].position.equals(pos.clone().setX(pos.x - 1).setY(pos.y + 1).setZ(pos.z + 1))) {
                this.cubes[i].numNeighbors ++;
            }
            if (this.bombs[j].position.equals(pos.clone().setX(pos.x - 1).setZ(pos.z - 1))) {
                this.cubes[i].numNeighbors ++;
            }
            if (this.bombs[j].position.equals(pos.clone().setX(pos.x - 1).setZ(pos.z + 1))) {
                this.cubes[i].numNeighbors ++;
            }

            if (this.size && this.bombs[j].position.equals(pos.clone().setX(pos.x + 1))) {
                this.cubes[i].numNeighbors ++;
            }
            if (this.bombs[j].position.equals(pos.clone().setX(pos.x + 1).setY(pos.y - 1))) {
                this.cubes[i].numNeighbors ++;
            }
            if (this.bombs[j].position.equals(pos.clone().setX(pos.x + 1).setY(pos.y - 1).setZ(pos.z - 1))) {
                this.cubes[i].numNeighbors ++;
            }
            if (this.bombs[j].position.equals(pos.clone().setX(pos.x + 1).setY(pos.y - 1).setZ(pos.z + 1))) {
                this.cubes[i].numNeighbors ++;
            }
            if (this.bombs[j].position.equals(pos.clone().setX(pos.x + 1).setY(pos.y + 1))) {
                this.cubes[i].numNeighbors ++;
            }
            if (this.bombs[j].position.equals(pos.clone().setX(pos.x + 1).setY(pos.y + 1).setZ(pos.z - 1))) {
                this.cubes[i].numNeighbors ++;
            }
            if (this.bombs[j].position.equals(pos.clone().setX(pos.x + 1).setY(pos.y + 1).setZ(pos.z + 1))) {
                this.cubes[i].numNeighbors ++;
            }
            if (this.bombs[j].position.equals(pos.clone().setX(pos.x + 1).setZ(pos.z - 1))) {
                this.cubes[i].numNeighbors ++;
            }
            if (this.bombs[j].position.equals(pos.clone().setX(pos.x + 1).setZ(pos.z + 1))) {
                this.cubes[i].numNeighbors ++;
            }
            

            if (this.bombs[j].position.equals(pos.clone().setY(pos.y - 1))) {
                this.cubes[i].numNeighbors ++;
            }
            if (this.bombs[j].position.equals(pos.clone().setY(pos.y - 1).setZ(pos.z - 1))) {
                this.cubes[i].numNeighbors ++;
            }
            if (this.bombs[j].position.equals(pos.clone().setY(pos.y - 1).setZ(pos.z + 1))) {
                this.cubes[i].numNeighbors ++;
            }

            if (this.size && this.bombs[j].position.equals(pos.clone().setY(pos.y + 1))) {
                this.cubes[i].numNeighbors ++;
            }
            if (this.bombs[j].position.equals(pos.clone().setY(pos.y + 1).setZ(pos.z - 1))) {
                this.cubes[i].numNeighbors ++;
            }
            if (this.bombs[j].position.equals(pos.clone().setY(pos.y + 1).setZ(pos.z + 1))) {
                this.cubes[i].numNeighbors ++;
            }

            if (this.size && this.bombs[j].position.equals(pos.clone().setZ(pos.z - 1))) {
                this.cubes[i].numNeighbors ++;
            }
            if (this.size && this.bombs[j].position.equals(pos.clone().setZ(pos.z + 1))) {
                this.cubes[i].numNeighbors ++;
            }
        }
    } 
}

