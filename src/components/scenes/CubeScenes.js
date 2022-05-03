import { Scene, Color, Vector2, Raycaster } from 'three';
import { BasicLights } from 'lights';
import { CubeGrids } from '../grids';

class CubeScenes extends Scene {
    constructor(isFilled, difficulty, size, images) {
        // Call parent Scene() constructor
        super();

        this.background = new Color(0x7ec0ee);
        this.gameOver = false;
        this.gameOverText = 'You Win!';

        // Add meshes to scene
        const lights = new BasicLights();
        this.add(lights);
        this.grid = new CubeGrids(isFilled, difficulty, size, images);
        for (const cubes of this.grid.cubes) {
            this.add(cubes);
        }

        this.divElements = [];
        this.displayBombsLeft();
    }

    // Create html text
    createText(str, top, left, size) {
        const text = document.createElement('div');
        document.body.appendChild(text);
        text.innerHTML = str;
        text.style.fontFamily = 'Monaco';
        text.style.fontSize = size;
        text.style.position = 'absolute';
        text.style.left = left;
        text.style.top = top;
        return text;
    }

    // Displays difference of number of bombs and marked (!) cubes
    displayBombsLeft() {
        if (this.divElements.length == 1) {
            this.divElements.forEach((startingPart) => startingPart.remove());
            this.divElements = [];
        }

        const text = 'Bombs Left: ';
        const flagText = this.createText(
            text + this.grid.unMarkedBombs,
            '20px',
            '20px',
            '20px'
        );
        flagText.style.color = 'red';
        flagText.style.padding = '10px';
        flagText.style.backgroundColor = 'black';
        this.divElements.push(flagText);
    }

    // Places markers on unrevealed cubes
    flagCube(event, camera) {
        const cube = this.getNearestCube(event, camera);
        if (cube != undefined) {
            this.grid.flag(cube);
            return 1;
        }
    }

    // Returns first unrevealed cube that the mouse intersects
    getNearestCube(event, camera) {
        const mouse = new Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
        const raycaster = new Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(this.children, false);
        if (intersects.length > 0 && !intersects[0].object.reveal) {
            return intersects[0].object;
        }
    }

    // Highlights unrevealed cube
    highlightCube(event, camera) {
        const cube = this.getNearestCube(event, camera);
        for (const cubes of this.grid.cubes) {
            this.grid.highlight(cube, cubes);
        }
    }

    // Reveals selected cube
    revealCube(event, camera) {
        const cube = this.getNearestCube(event, camera);
        if (cube != undefined && !cube.isBomb) {
            this.grid.revealCubes(cube, this);
            this.grid.removeRevealedCubes();
            this.gameOver = this.grid.checkWin();
        } else if (cube != undefined && cube.isBomb) {
            this.grid.revealBombs();
            this.gameOver = true;
            this.gameOverText = 'You hit a bomb!';
        }

        // Game over message
        if (this.gameOver) {
            const message = this.createText(
                this.gameOverText,
                '10%',
                '0px',
                '40px'
            );
            message.style.left =
                (window.innerWidth - message.clientWidth) / 2 + 'px';

            if (this.gameOverText == 'You Win!') {
                message.style.color = 'green';
            } else {
                message.style.color = 'red';
            }
            this.divElements.push(message);
        }

        if (cube != undefined) {
            return 1;
        }
    }

    // Centers game over message
    update() {
        if (this.gameOver) {
            this.divElements[1].style.left =
                (window.innerWidth - this.divElements[1].clientWidth) / 2 +
                'px';
        }
    }
}

export default CubeScenes;
