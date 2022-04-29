import { Scene, Color} from 'three';
import { BasicLights } from 'lights';
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
        const lights = new BasicLights();
        this.add(lights);
        this.grid = new HollowGrid();
        for (const cubes of this.grid.cubes) {
            this.add(cubes.mesh);
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

    highlightCube(event, camera) {
        const cube = this.getNearestCube(event, camera);
        if (cube != undefined) {
            for (const cubes of this.grid.cubes) {
                if (!cubes.mesh.reveal) {
                    if (cubes.mesh.uuid == cube.uuid) {
                        cubes.mesh.material = new THREE.MeshStandardMaterial();
                        cubes.mesh.material.color = new Color(0xf7f914);
                    }
                    else {
                        if (cubes.mesh.flag == 0) {
                            cubes.mesh.material = new THREE.MeshMatcapMaterial();
                        }
                        else if (cubes.mesh.flag == 1) {
                            cubes.mesh.material = this.revealMat[9];
                        }
                        else if (cubes.mesh.flag == 2) {
                            cubes.mesh.material = this.revealMat[10];
                        }
                    }
                }
            }
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
                cube.material = this.revealMat[cube.numNeighbors];
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
        for (const bombs of this.grid.bombs) {
            if (!bombs.reveal) {
                bombs.reveal = true;
                bombs.material = this.revealMat[0];
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
                cube.material = this.revealMat[10];
                cube.flag = 2;
            }
            else if (cube.flag == 2) {
                cube.material = new THREE.MeshMatcapMaterial(); 
                cube.flag = 0;
            }
        }
    }

    checkWin() {
        for (const cubes of this.grid.cubes) {
            if (!cubes.mesh.isBomb && !cubes.mesh.reveal) {
                return;
            }
        }
        this.gameOver = 1;
        console.log("You Win!");
    }

    revealNeighboringCubes(cube) {
        for (const cubes of this.grid.cubes) {
            const pos = cube.position.clone();
            const curr = cubes.mesh;

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
