import { Group, BoxGeometry, MeshMatcapMaterial, Mesh } from 'three';

class Cube extends Group {
    constructor(isFilled) {
        // Call parent Group() constructor
        super();

        this.name = 'cube';

        // create mesh
        let geometry = new BoxGeometry(0.995, 0.995, 0.995);
        if (isFilled) {
            geometry = new BoxGeometry(0.9, 0.9, 0.9);
        }
        const material = new MeshMatcapMaterial();
        this.mesh = new Mesh(geometry, material);

        // cube instance variables
        this.mesh.isBomb = false;
        this.mesh.numNeighbors = 0;
        this.mesh.reveal = false;
        this.mesh.flag = 0;
    }
}

export default Cube;
