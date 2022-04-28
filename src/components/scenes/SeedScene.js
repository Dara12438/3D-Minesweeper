import * as Dat from 'dat.gui';
import { Scene, Color, Vector3, Raycaster } from 'three';
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
            rotationSpeed: 1,
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
        const flower = new Flower(this);
        const lights = new BasicLights();
        for (let i = 0; i < this.grid.cubes.length; i++) {
            this.add(this.grid.cubes[i]);
        }
        this.add(flower, lights);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    getNearestCube(event, camera) {
        event.preventDefault();
        const mouse3D = new Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerheight) * 2 - 1, 0);
        const raycaster = new Raycaster();
        raycaster.setFromCamera(mouse3D, camera);
        const intersects = raycaster.intersectObjects(this.grid.cubes);
        // console.log(intersects);
        if (intersects.length > 0) {
            return intersects[0];
        }
    }

    checkCube(event, camera) {
        const cube = this.getNearestCube(event, camera);
        // console.log(cube);
        if (cube != undefined && cube.reveal) {
            console.log(cube.numNeighbors);
        }
    }

    revealCube(event, camera) {
        const cube = this.getNearestCube(event, camera);
        // console.log(cube);
        if (cube != undefined && !cube.isBomb && !cube.reveal) {
            cube.reveal = true;
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
