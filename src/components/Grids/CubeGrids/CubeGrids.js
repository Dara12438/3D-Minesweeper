import { Group } from 'three';
import { Cube } from 'objects';
import * as THREE from 'three';

class CubeGrids extends Group {
    constructor(isFilled, difficulty, size) {
        // Call parent Group() constructor
        super();

        this.name = 'cubeGrids';
        this.gridType = isFilled;
        this.size = size;
        this.numBombs;
        this.unMarkedBombs = this.numBombs;
        this.cubes = [];
        const offset = this.size/2;

        // cube textures
        this.revealMat = [];
        var revealTex = new THREE.TextureLoader().load( 'src/components/images/bomb.png');
        this.revealMat.push(new THREE.MeshMatcapMaterial({ map: revealTex }));
        for (let i = 1; i < 27; i++) {
            revealTex = new THREE.TextureLoader().load( 'src/components/images/'+i+'.png');
            this.revealMat.push(new THREE.MeshMatcapMaterial({ map: revealTex }));
        }
        this.revealMat.push(new THREE.MeshMatcapMaterial({ map: new THREE.TextureLoader().load( 'src/components/images/exclaim.png') }));
        this.revealMat.push(new THREE.MeshMatcapMaterial({ map: new THREE.TextureLoader().load( 'src/components/images/question.png') }));

        // create cubes
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                for (let z = 0; z < this.size; z++) {
                    if (isFilled || (x == 0 || x == this.size - 1 || y == 0 || y == this.size - 1 || z == 0 || z == this.size - 1)) {
                        const cube = new Cube();
                        cube.mesh.position.copy(new THREE.Vector3(x, y, z).subScalar(offset));
                        this.cubes.push(cube.mesh);
                    }
                }
            }
        }

        this.numBombs = (!isFilled && ((difficulty == 1) * (Math.floor(this.cubes.length * 0.10)) || (difficulty == 2) * (Math.floor(this.cubes.length * 0.15)) || (difficulty == 3) * (Math.floor(this.cubes.length * 0.20)))) ||
                        ( isFilled && ((difficulty == 1) * (Math.floor(this.cubes.length * 0.06)) || (difficulty == 2) * (Math.floor(this.cubes.length * 0.10)) || (difficulty == 3) * (Math.floor(this.cubes.length * 0.15)))) || 1;
        
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

    checkWin() {
        for (const cubes of this.cubes) {
            if (!cubes.isBomb && !cubes.reveal) {
                return false;
            }
        }
        console.log("You Win!");
        this.removeAllCubes();
        return true;
    }

    flag(cube) {
        if (cube.flag == 0) {
            cube.material = this.revealMat[27];
            cube.flag = 1;
            this.unMarkedBombs--;     
        }
        else if (cube.flag == 1) {
            cube.material = this.revealMat[28];
            cube.flag = 2;
            this.unMarkedBombs++;
        }
        else if (cube.flag == 2) {
            cube.material = new THREE.MeshMatcapMaterial(); 
            cube.flag = 0;
        }
        console.log(this.grid.unMarkedBombs+" bombs left");
    }

    highlight(cube, cubes) {
        if (cube != undefined && cubes.uuid == cube.uuid) {
            cubes.material = new THREE.MeshStandardMaterial();
            cubes.material.color = new THREE.Color(0xf7f914);
        }
        else {
            if (cubes.flag == 0) {
                cubes.material = new THREE.MeshMatcapMaterial();
            }
            else if (cubes.flag == 1) {
                cubes.material = this.revealMat[27];
            }
            else if (cubes.flag == 2) {
                cubes.material = this.revealMat[28];
            }
        }
    }

    removeAllCubes() {
        if (this.gridType) {
            for (const cube of this.cubes) {
                cube.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
                cube.material.transparent = true;
                cube.material.opacity = 0.15;
            }
        }
        this.cubes = [];
    }

    removeRevealedCubes() {
        for (let i = 0; i < this.cubes.length; i++) {
            if (this.cubes[i].reveal) {
                this.cubes.splice(i, 1);
                i--;
            }
        } 
    }

    revealBombs() {
        for (const bomb of this.bombs) {
            bomb.reveal = true;
            bomb.material = this.revealMat[0];
        }
        this.removeRevealedCubes();
        this.removeAllCubes();
        console.log("You hit a bomb!");
    }

    revealCubes(cube, parent) {
        cube.reveal = true;
        if (cube.flag == 1) {
            this.unMarkedBombs++;
            console.log(this.grid.unMarkedBombs+" bombs left");
        }

        if (cube.numNeighbors == 0) {
            const revealMat = new THREE.MeshMatcapMaterial({ color: 0x9e9e9e });
            cube.material = revealMat;
            this.revealNeighboringCubes(cube, parent);
        }
        else {
            cube.material = this.revealMat[cube.numNeighbors];
            if (this.gridType) {
                cube.material.transparent = true;
                cube.material.opacity = 0.6;
            }
        }
    }

    revealNeighboringCubes(cube, parent) {
        for (const cubes of this.cubes) {
            const pos = cube.position.clone();

            const isNeighbor = !cubes.reveal && (cubes.position.equals(pos.clone().setX(pos.x - 1)) ||
            cubes.position.equals(pos.clone().setX(pos.x - 1).setY(pos.y - 1)) ||
            cubes.position.equals(pos.clone().setX(pos.x - 1).setY(pos.y - 1).setZ(pos.z - 1)) ||
            cubes.position.equals(pos.clone().setX(pos.x - 1).setY(pos.y - 1).setZ(pos.z + 1)) ||
            cubes.position.equals(pos.clone().setX(pos.x - 1).setY(pos.y + 1)) ||
            cubes.position.equals(pos.clone().setX(pos.x - 1).setY(pos.y + 1).setZ(pos.z - 1)) ||
            cubes.position.equals(pos.clone().setX(pos.x - 1).setY(pos.y + 1).setZ(pos.z + 1)) ||
            cubes.position.equals(pos.clone().setX(pos.x - 1).setZ(pos.z - 1)) ||
            cubes.position.equals(pos.clone().setX(pos.x - 1).setZ(pos.z + 1)) ||
            cubes.position.equals(pos.clone().setX(pos.x + 1)) ||
            cubes.position.equals(pos.clone().setX(pos.x + 1).setY(pos.y - 1)) ||
            cubes.position.equals(pos.clone().setX(pos.x + 1).setY(pos.y - 1).setZ(pos.z - 1)) ||
            cubes.position.equals(pos.clone().setX(pos.x + 1).setY(pos.y - 1).setZ(pos.z + 1)) ||
            cubes.position.equals(pos.clone().setX(pos.x + 1).setY(pos.y + 1)) ||
            cubes.position.equals(pos.clone().setX(pos.x + 1).setY(pos.y + 1).setZ(pos.z - 1)) ||
            cubes.position.equals(pos.clone().setX(pos.x + 1).setY(pos.y + 1).setZ(pos.z + 1)) ||
            cubes.position.equals(pos.clone().setX(pos.x + 1).setZ(pos.z - 1)) ||
            cubes.position.equals(pos.clone().setX(pos.x + 1).setZ(pos.z + 1)) ||
            cubes.position.equals(pos.clone().setY(pos.y - 1)) ||
            cubes.position.equals(pos.clone().setY(pos.y - 1).setZ(pos.z - 1)) ||
            cubes.position.equals(pos.clone().setY(pos.y - 1).setZ(pos.z + 1)) ||
            cubes.position.equals(pos.clone().setY(pos.y + 1)) ||
            cubes.position.equals(pos.clone().setY(pos.y + 1).setZ(pos.z - 1)) ||
            cubes.position.equals(pos.clone().setY(pos.y + 1).setZ(pos.z + 1)) ||
            cubes.position.equals(pos.clone().setZ(pos.z - 1)) ||
            cubes.position.equals(pos.clone().setZ(pos.z + 1)));

            if (isNeighbor) {
                this.revealCubes(cubes, parent);
            }
            if (this.gridType) {
                parent.remove(cube);
            }
        }
    }
}

export default CubeGrids;