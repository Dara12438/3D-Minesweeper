import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './cube.gltf';

class Cube extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        // Load object
        const loader = new GLTFLoader();

        this.name = 'cube';
        this.isBomb = false;
        this.numNeighbors = 0;
        this.reveal = false;

        loader.load(MODEL, (gltf) => {
            this.scale.multiplyScalar(.08);
            this.add(gltf.scene);
        });
    }
}

export default Cube;