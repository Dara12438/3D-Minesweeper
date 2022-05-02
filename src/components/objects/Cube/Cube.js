import { Group } from 'three';
import * as THREE from 'three';

class Cube extends Group {
    constructor(isFilled) {
        // Call parent Group() constructor
        super();

        this.name = 'cube';

        let geometry = new THREE.BoxGeometry(0.995, 0.995, 0.995);
        if (isFilled) {
            geometry = new THREE.BoxGeometry( 0.9, 0.9, 0.9 );
        }
        const material = new THREE.MeshMatcapMaterial();
        this.mesh = new THREE.Mesh(geometry, material);

        this.mesh.isBomb = false;
        this.mesh.numNeighbors = 0;
        this.mesh.reveal = false;
        this.mesh.flag = 0;

    }
}

export default Cube;