import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './cube.gltf';
import * as THREE from 'three';

class Cube extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        // Load object
        // const loader = new GLTFLoader();
        // const loader = new THREE.TextureLoader();

        this.name = 'cube';
        // this.isBomb = false;
        // this.numNeighbors = 0;
        // this.reveal = false;

        // const texture = new THREE.TextureLoader().load( 'src/components/images/tiles-1_dragged.png' );

        const geometry = new THREE.BoxGeometry( 0.95, 0.95, 0.95 );
        // const geometry = new THREE.BoxGeometry( 0.5, 0.5, .5 );
        // const geometry = new THREE.BoxGeometry( 0.99, 0.99, 0.99 );
        const material = new THREE.MeshMatcapMaterial();
        
        // const material = new THREE.MeshMatcapMaterial({ map: texture });
        // const material = new THREE.MeshStandardMaterial();
        this.mesh = new THREE.Mesh( geometry, material);
        // this.mesh.material.transparent = true;

        this.mesh.isBomb = false;
        this.mesh.numNeighbors = 0;
        this.mesh.reveal = false;
        this.mesh.flag = 0;
        // scene.add( cube );

        // loader.load(MODEL, (gltf) => {
        //     this.scale.multiplyScalar(.1);
        //     this.add(gltf.scene);
        // });
    }
}

export default Cube;