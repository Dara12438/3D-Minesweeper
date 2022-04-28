import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { BasicLights } from 'lights';
import { FilledGrid } from "../Grids";


class FilledScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            updateList: [],
        };
        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // const grid = new Grid();
        const grid = new FilledGrid();
        // grid.initializeCubes();
        const lights = new BasicLights();
        for (let i = 0; i < grid.cubes.length; i++) {
            this.add(grid.cubes[i]);
        }
        this.add(lights);
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

export default FilledScene;