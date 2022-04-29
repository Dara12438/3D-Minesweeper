import { Scene, Color} from 'three';
import * as THREE from 'three';
import { HollowGrid } from "../Grids";

class HollowScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        this.background = new Color(0x7ec0ee);
        this.gameOver = false;

        // cube textures
        this.revealMat = [];
        var revealTex = new THREE.TextureLoader().load( 'src/components/images/bomb.png');
        this.revealMat.push(new THREE.MeshMatcapMaterial({ map: revealTex }));
        for (let i = 1; i < 9; i++) {
            revealTex = new THREE.TextureLoader().load( 'src/components/images/'+i+'.png');
            this.revealMat.push(new THREE.MeshMatcapMaterial({ map: revealTex }));
        }
        this.revealMat.push(new THREE.MeshMatcapMaterial({ map: new THREE.TextureLoader().load( 'src/components/images/exclaim.png') }));
        this.revealMat.push(new THREE.MeshMatcapMaterial({ map: new THREE.TextureLoader().load( 'src/components/images/question.png') }));
        
        // Add meshes to scene
        this.grid = new HollowGrid();
        for (let i = 0; i < this.grid.cubes.length; i++) {
            this.add(this.grid.cubes[i].mesh);
        }
    }

    getNearestCube(event, camera) {
        const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
        const raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(this.children, false);
        if (intersects.length > 0) {
            return intersects[0].object;
        }
    }

    checkCube(event, camera) {
        const cube = this.getNearestCube(event, camera);
        // console.log("check");
        // console.log(cube);
        if (cube != undefined && !cube.reveal) {
            // console.log(cube.numNeighbors);
        }
    }

    revealCube(event, camera) {
        const cube = this.getNearestCube(event, camera);
        if (cube != undefined && !cube.isBomb && !cube.reveal) {
            cube.reveal = true;
            if (cube.numNeighbors == 0) {
                const revealMat = new THREE.MeshMatcapMaterial({ color: 0x9e9e9e });
                cube.material = revealMat;
                this.revealNeighboringCubes(cube);
            }
            else {
                cube.material = this.revealMat[cube.numNeighbors];;
            }
        }
        this.checkWin();

        if (cube != undefined && cube.isBomb) {
            cube.reveal = true;
            cube.material = this.revealMat[0];
            this.revealBombs();
            this.gameOver = true;
            console.log("You hit a bomb!")
        }
    }

    revealBombs() {
        for (let i = 0; i < this.grid.bombs.length; i++) {
            if (!this.grid.bombs[i].reveal) {
                this.grid.bombs[i].reveal = true;
                this.grid.bombs[i].material = this.revealMat[0];
            }
        }
    }
    
    flagCube(event, camera) {
        const cube = this.getNearestCube(event, camera);
        if (cube != undefined && !cube.reveal) {
            if (cube.flag == 0) {
                cube.material = this.revealMat[9];
                cube.flag = 1;     
            }
            else if (cube.flag == 1) {
                cube.material = this.revealMat[10];; 
                cube.flag = 2;
            }
            else if (cube.flag == 2) {
                cube.material = new THREE.MeshMatcapMaterial(); 
                cube.flag = 0;
            }
        }
    }

    checkWin() {
        for (let i = 0; i < this.grid.cubes.length; i++) {
            if (!this.grid.cubes[i].mesh.isBomb && !this.grid.cubes[i].mesh.reveal) {
                return;
            }
        }
        this.gameOver = 1;
        console.log("You Win!");
    }

    revealNeighboringCubes(cube) {
        for (let i = 0; i < this.grid.cubes.length; i++) {
            const pos = cube.position.clone();
            const curr = this.grid.cubes[i].mesh;

            const isNeighbor = !curr.reveal && (curr.position.equals(pos.clone().setX(pos.x - 1)) ||
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
            curr.position.equals(pos.clone().setZ(pos.z + 1)));

            if (isNeighbor) {
                curr.reveal = true;
                if (curr.numNeighbors == 0) {
                    const revealMat = new THREE.MeshMatcapMaterial({ color: 0x9e9e9e });
                    curr.material = revealMat;
                    this.revealNeighboringCubes(curr);
                }
                else {
                    curr.material = this.revealMat[curr.numNeighbors];
                }
            }
        }
    }
}

export default HollowScene;
