import { Group, TextureLoader, MeshMatcapMaterial, MeshStandardMaterial, Vector3 } from 'three';
import { Cube } from 'objects';

class CubeGrids extends Group {
    constructor(isFilled, difficulty, size, images) {
        // Call parent Group() constructor
        super();

        this.name = 'cubeGrids';
        this.gridType = isFilled;
        this.size = size;
        this.numBombs;
        this.unMarkedBombs;
        this.cubes = [];
        const offset = this.size/2;
        

        // cube textures
        this.revealMat = [];
        for (let i = 0; i < images.length; i++) {
            const revealTex = new TextureLoader().load(images[i]);
            this.revealMat.push(new MeshMatcapMaterial({ map: revealTex }));
        }

        // create cubes
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                for (let z = 0; z < this.size; z++) {
                    if (isFilled || (x == 0 || x == this.size - 1 || y == 0 || y == this.size - 1 || z == 0 || z == this.size - 1)) {
                        const cube = new Cube(isFilled);
                        cube.mesh.position.copy(new Vector3(x, y, z).subScalar(offset));
                        this.cubes.push(cube.mesh);
                    }
                }
            }
        }

        this.numBombs = (!isFilled && ((difficulty == 1) * (Math.floor(this.cubes.length * 0.08)) || (difficulty == 2) * (Math.floor(this.cubes.length * 0.14)) || (difficulty == 3) * (Math.floor(this.cubes.length * 0.20)))) ||
                        ( isFilled && ((difficulty == 1) * (Math.floor(this.cubes.length * 0.06)) || (difficulty == 2) * (Math.floor(this.cubes.length * 0.10)) || (difficulty == 3) * (Math.floor(this.cubes.length * 0.14)))) || 1;
        this.unMarkedBombs = this.numBombs;

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

        // determine number of neighboring bombs for each cube
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

    // if all non-bomb cubes are revealed, the user wins
    checkWin() {
        for (const cubes of this.cubes) {
            if (!cubes.isBomb && !cubes.reveal) {
                return false;
            }
        }
        // console.log("You Win!");
        this.removeAllCubes();
        return true;
    }

    // changes cube texture from white -> !, ! -> ?, or ? -> white
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
            cube.material = new MeshMatcapMaterial(); 
            cube.flag = 0;
        }
        // console.log(this.unMarkedBombs+" bombs left");
    }

    // highlights cube on the mouse and removes the highlights of other cubes
    highlight(cube, cubes) {
        if (cube != undefined && cubes.uuid == cube.uuid) {
            cubes.material = new MeshStandardMaterial({ color: 0xf7f914 });
        }
        else {
            if (cubes.flag == 0) {
                cubes.material = new MeshMatcapMaterial();
            }
            else if (cubes.flag == 1) {
                cubes.material = this.revealMat[27];
            }
            else if (cubes.flag == 2) {
                cubes.material = this.revealMat[28];
            }
        }
    }

    // makes the remaining cubes transparent and sets cubes to an empty array (to use less data); occurs when game is over or reset
    removeAllCubes() {
        if (this.gridType) {
            for (const cube of this.cubes) {
                cube.material = new MeshStandardMaterial({ color: 0xffffff });
                cube.material.transparent = true;
                cube.material.opacity = 0.15;
            }
        }
        this.cubes = [];
    }

    // remove revealed cubes from cubes array to use less data
    removeRevealedCubes() {
        for (let i = 0; i < this.cubes.length; i++) {
            if (this.cubes[i].reveal) {
                this.cubes.splice(i, 1);
                i--;
            }
        } 
    }

    // reveals all bombs; occurs when user loses
    revealBombs() {
        for (const bomb of this.bombs) {
            bomb.reveal = true;
            bomb.material = this.revealMat[0];
        }
        this.removeRevealedCubes();
        this.removeAllCubes();
        // console.log("You hit a bomb!");
    }

    // changes texture of given cube to reveal it
    revealCubes(cube, parent) {
        cube.reveal = true;

        // revealing flagged cube
        if (cube.flag == 1) {
            this.unMarkedBombs++;
            // console.log(this.unMarkedBombs+" bombs left");
        }

        // changing material to reveal cube
        if (cube.numNeighbors == 0) {
            const revealMat = new MeshMatcapMaterial({ color: 0x9e9e9e });
            cube.material = revealMat;
            this.revealNeighboringCubes(cube, parent);
        }
        else {
            cube.material = this.revealMat[cube.numNeighbors];
            if (this.gridType) {
                cube.material.transparent = true;
                cube.material.opacity = 0.6 - 0.035 * (this.size - 5);
            }
        }
    }

    // reveals clusters of cubes with 0 neighboring bombs
    revealNeighboringCubes(cube, parent) {
        for (const currCube of this.cubes) {
            const pos = cube.position.clone();

            // true if currCube is an unrevealed neighboring cube of cube
            const isNeighbor = !currCube.reveal && (currCube.position.equals(pos.clone().setX(pos.x - 1)) ||
            currCube.position.equals(pos.clone().setX(pos.x - 1).setY(pos.y - 1)) ||
            currCube.position.equals(pos.clone().setX(pos.x - 1).setY(pos.y - 1).setZ(pos.z - 1)) ||
            currCube.position.equals(pos.clone().setX(pos.x - 1).setY(pos.y - 1).setZ(pos.z + 1)) ||
            currCube.position.equals(pos.clone().setX(pos.x - 1).setY(pos.y + 1)) ||
            currCube.position.equals(pos.clone().setX(pos.x - 1).setY(pos.y + 1).setZ(pos.z - 1)) ||
            currCube.position.equals(pos.clone().setX(pos.x - 1).setY(pos.y + 1).setZ(pos.z + 1)) ||
            currCube.position.equals(pos.clone().setX(pos.x - 1).setZ(pos.z - 1)) ||
            currCube.position.equals(pos.clone().setX(pos.x - 1).setZ(pos.z + 1)) ||
            currCube.position.equals(pos.clone().setX(pos.x + 1)) ||
            currCube.position.equals(pos.clone().setX(pos.x + 1).setY(pos.y - 1)) ||
            currCube.position.equals(pos.clone().setX(pos.x + 1).setY(pos.y - 1).setZ(pos.z - 1)) ||
            currCube.position.equals(pos.clone().setX(pos.x + 1).setY(pos.y - 1).setZ(pos.z + 1)) ||
            currCube.position.equals(pos.clone().setX(pos.x + 1).setY(pos.y + 1)) ||
            currCube.position.equals(pos.clone().setX(pos.x + 1).setY(pos.y + 1).setZ(pos.z - 1)) ||
            currCube.position.equals(pos.clone().setX(pos.x + 1).setY(pos.y + 1).setZ(pos.z + 1)) ||
            currCube.position.equals(pos.clone().setX(pos.x + 1).setZ(pos.z - 1)) ||
            currCube.position.equals(pos.clone().setX(pos.x + 1).setZ(pos.z + 1)) ||
            currCube.position.equals(pos.clone().setY(pos.y - 1)) ||
            currCube.position.equals(pos.clone().setY(pos.y - 1).setZ(pos.z - 1)) ||
            currCube.position.equals(pos.clone().setY(pos.y - 1).setZ(pos.z + 1)) ||
            currCube.position.equals(pos.clone().setY(pos.y + 1)) ||
            currCube.position.equals(pos.clone().setY(pos.y + 1).setZ(pos.z - 1)) ||
            currCube.position.equals(pos.clone().setY(pos.y + 1).setZ(pos.z + 1)) ||
            currCube.position.equals(pos.clone().setZ(pos.z - 1)) ||
            currCube.position.equals(pos.clone().setZ(pos.z + 1)));

            if (isNeighbor) {
                this.revealCubes(currCube, parent);
            }
            // removes cubes with 0 neighboring bombs from scene
            if (this.gridType) {
                parent.remove(cube);
            }
        }
    }
}

export default CubeGrids;