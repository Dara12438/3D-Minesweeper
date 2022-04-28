import * as Dat from 'dat.gui';
import { Scene, Color, Vector2, Raycaster } from 'three';
import * as THREE from 'three';
import { Flower, Land, Cube } from 'objects';
import { BasicLights } from 'lights';
// import { Grid } from '../Grids';
import { HollowGrid } from "../Grids";

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 0,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        const land = new Land();
        // const grid = new Grid();
        this.grid = new HollowGrid();
        // grid.initializeCubes();
        const cube = new Cube();
        const lights = new BasicLights();
        for (let i = 0; i < this.grid.cubes.length; i++) {
            this.add(this.grid.cubes[i].mesh);
        }
        this.add(lights);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    getNearestCube(event, camera) {
        // event.preventDefault();
        const mouse3D = new Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
        const raycaster = new Raycaster();
        raycaster.setFromCamera(mouse3D, camera);
        const intersects = raycaster.intersectObjects(this.children, false);
        // let intersects = new Raycaster().intersectObjects(this.children);
        // console.log(intersects.length);
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
        // console.log("reveal");
        // console.log(cube);
        if (cube != undefined && !cube.isBomb && !cube.reveal) {
            cube.reveal = true;
            if (cube.numNeighbors == 0) {
                const revealMat = new THREE.MeshMatcapMaterial({ color: 0x9e9e9e });
                cube.material = revealMat;
                // this.revealNeighboringCubes(cube);
            }
            else {
                const revealTex = new THREE.TextureLoader().load( 'src/components/images/'+cube.numNeighbors+'.png');
                const revealMat = new THREE.MeshMatcapMaterial({ map: revealTex });
                cube.material = revealMat;
            }
        }

        if (cube != undefined && cube.isBomb) {
            cube.reveal = true;
            const revealTex = new THREE.TextureLoader().load( 'src/components/images/bomb.png');
            const revealMat = new THREE.MeshMatcapMaterial({ map: revealTex });
            cube.material = revealMat;
        }
    }

    revealBombs() {

    }
    
    flagCube(event, camera) {
        const cube = this.getNearestCube(event, camera);
        if (cube != undefined && !cube.reveal && cube.flag == 0) {
            const flagTex = new THREE.TextureLoader().load( 'src/components/images/exclaim.png' );
            const flagMat = new THREE.MeshMatcapMaterial({ map: flagTex });
            cube.material = flagMat;
            cube.flag = 1;     
        }
        else if (cube != undefined && !cube.reveal && cube.flag == 1) {
            const flagTex = new THREE.TextureLoader().load( 'src/components/images/question.png' );
            const flagMat = new THREE.MeshMatcapMaterial({ map: flagTex });
            cube.material = flagMat; 
            cube.flag = 2;
        }
        else if (cube != undefined && !cube.reveal && cube.flag == 2) {
            const flagMat = new THREE.MeshMatcapMaterial();
            cube.material = flagMat; 
            cube.flag = 0;
        }
    }

    revealNeighboringCubes(cube) {
        if (cube.numNeighbors != 0) {
            return;
        }

        for (let i = 0; i < this.grid.cubeMeshs.length; i++) {
            const pos = cube.position.clone();

            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setX(pos.x - 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }
            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setX(pos.x - 1).setY(pos.y - 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }
            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setX(pos.x - 1).setY(pos.y - 1).setZ(pos.z - 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }
            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setX(pos.x - 1).setY(pos.y - 1).setZ(pos.z + 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }
            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setX(pos.x - 1).setY(pos.y + 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }
            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setX(pos.x - 1).setY(pos.y + 1).setZ(pos.z - 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }
            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setX(pos.x - 1).setY(pos.y + 1).setZ(pos.z + 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }
            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setX(pos.x - 1).setZ(pos.z - 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }
            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setX(pos.x - 1).setZ(pos.z + 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }

            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setX(pos.x + 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }
            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setX(pos.x + 1).setY(pos.y - 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }
            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setX(pos.x + 1).setY(pos.y - 1).setZ(pos.z - 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }
            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setX(pos.x + 1).setY(pos.y - 1).setZ(pos.z + 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }
            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setX(pos.x + 1).setY(pos.y + 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }
            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setX(pos.x + 1).setY(pos.y + 1).setZ(pos.z - 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }
            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setX(pos.x + 1).setY(pos.y + 1).setZ(pos.z + 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }
            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setX(pos.x + 1).setZ(pos.z - 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }
            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setX(pos.x + 1).setZ(pos.z + 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }


            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setY(pos.y - 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }
            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setY(pos.y - 1).setZ(pos.z - 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }
            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setY(pos.y - 1).setZ(pos.z + 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }

            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setY(pos.y + 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }
            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setY(pos.y + 1).setZ(pos.z - 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }
            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setY(pos.y + 1).setZ(pos.z + 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }

            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setZ(pos.z - 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }
            if (this.grid.cubeMeshs[i].position.equals(pos.clone().setZ(pos.z + 1))) {
                this.revealNeighboringCubes(this.grid.cubeMeshs[i]);
            }
        }
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default SeedScene;
