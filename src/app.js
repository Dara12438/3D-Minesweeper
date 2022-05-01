/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, Box2 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CubeScenes, Launch } from 'scenes';

// Initialize core ThreeJS components
//const scene = new Launch();

// true - FilledScene; false - HollowScene
const scene = new CubeScenes(true);
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });
let mouseX;
let mouseY;

// Set up camera
// camera.position.set(6, 3, -10);
camera.position.set(25, 25, -25);
camera.lookAt(new Vector3(0, 0, 0));



// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling

let htmlStyle = '.slidecontainer {width: 100%;}' +
'.slider {-webkit-appearance: none; appearance: none; width: 100%; height: 25px; background: #d3d3d3; outline: none; opacity: 0.7; -webkit-transition: .2s; transition: opacity .2s;}' +
'.slider:hover {opacity: 1;}' +
'.slider::-webkit-slider-thumb {-webkit-appearance: none; appearance: none;width: 25px; height: 25px; background: #04AA6D; cursor: pointer;}' +
'.slider::-moz-range-thumb {width: 25px; +height: 25px; background: #04AA6D; cursor: pointer; }';
let style = document.createElement("style");
style.innerHTML = htmlStyle;
document.head.appendChild(style);

let page = document.createElement("BODY");
page.style.cssText = 'background: #9e9e9e;';
document.body = page;

let html =
'<button onclick="setScene()">Click Here to Begin!</button>'+
'<script>' +
'var slider = document.getElementById("myRange");' +
'var output = document.getElementById("demo");' +
'var output2 = document.getElementById("demo2");' +
'var output3 = document.getElementById("demo3");' +
'output.innerHTML = slider.value;' +
'output2.innerHTML = slider.value;' +
'output3.innerHTML = document.slider.value;' +
'slider.oninput = function() {' +
'output.innerHTML = this.value;' +
'output2.innerHTML = this.value;' +
'output3.innerHTML = this.value;}' +
'</script>';


let beginText = document.createElement("div");
document.body.appendChild(beginText);
beginText.innerHTML = '<center><h2>How to Play:</h2></center>' +
'<p>This game takes the classic Minesweeper and moves it to a 3D cube. When you click on a block you can reveal either a number, an empty space, or a bomb. Your goal is to reveal every block without a bomb inside. Numbered blocks will tell you whether there is a bomb anywhere in its vicinity (anywhere in the 3x3 space centered around that cube). However, if you reveal a bomb you lose and the game ends. </p>' +
'<center><h3>Controls</h3></center>' +
'<p><b>Left Click and Drag:</b> Rotate cube</p>' +
'<p><b>Left Click Cube:</b> Reveal highlighted block</p>' +
'<p><b>Right Click:</b> Flag highlighted block (right click again to change or remove flag)</p>' +
'<br><center><h2>Choose Cube\'s Size:</h2></center>';

// Elements to control input of the mines
var sliderMines = document.createElement("input");
sliderMines.type = "range";
sliderMines.min = 5;
sliderMines.max = 15;
sliderMines.value = 10;
sliderMines.className = "slider";
sliderMines.id = "minesSlider";
var faceSize = sliderMines.value;
sliderMines.oninput = faceResize;
document.body.appendChild(sliderMines);

var sizeOutput = document.createElement("div");
sizeOutput.id = "sizeText";
sizeOutput.innerHTML = '<center><h2>Cube Size: ' + faceSize + " x " + faceSize + " x " + faceSize + '</h2></center>';
document.body.appendChild(sizeOutput);

function faceResize() {
    faceSize = document.getElementById('minesSlider').value;
    document.getElementById("sizeText").innerHTML = '<center><h2>Cube Size: ' + faceSize + " x " + faceSize + " x " + faceSize + '</h2></center>';
}

//Difficulty header
const diffText = document.createElement("div");
diffText.innerHTML = '<center><h2>Choose Your Difficulty:</h2>';
document.body.appendChild(diffText);

// Difficulty dropdown elements
const diffDropdown = document.createElement('select');
diffDropdown.name = "difficulty";
diffDropdown.id = "diff";
diffDropdown.className = "dropdown";
diffDropdown.style.fontSize = "24px";
diffDropdown.style.width = "100%";

var option0 = document.createElement('option');
option0.value = 1;
option0.text = "Easy";
diffDropdown.appendChild(option0);
var option1 = document.createElement('option');
option1.value = 2;
option1.text = "Medium";
diffDropdown.appendChild(option1);
var option2 = document.createElement('option');
option2.value = 3;
option2.text = "Hard";
diffDropdown.appendChild(option2);
var diffValue = 0;
diffDropdown.onchange = diffChange;
document.body.appendChild(diffDropdown);

function diffChange () {
    diffValue = document.getElementById("diff").value;
}

//Cube header
const cubeText = document.createElement("div");
cubeText.innerHTML = '<center><h2>Choose Your Playing Field:</h2>';
document.body.appendChild(cubeText);

// Cube dropdown elements
const cubeDropdown = document.createElement('select');
cubeDropdown.name = "cubeField";
cubeDropdown.id = "cubeSpace";
cubeDropdown.className = "dropdown";
cubeDropdown.style.fontSize = "24px";
cubeDropdown.style.width = "100%";

var cubeOption0 = document.createElement('option');
cubeOption0.value = false;
cubeOption0.text = "Hollow Cube";
cubeDropdown.appendChild(cubeOption0);
var cubeOption1 = document.createElement('option');
cubeOption1.value = true;
cubeOption1.text = "Filled Cube";
cubeDropdown.appendChild(cubeOption1);
var cubeValue = false;
cubeDropdown.onchange = cubeChange;
document.body.appendChild(cubeDropdown);

function cubeChange () {
    cubeValue = document.getElementById("cubeSpace").value;
    
}

const button = document.createElement('button');
//button.innerHTML = "Start the Game!";
document.body.appendChild(button);
//button.addEventListener("click", startGame, false);



function startGame(event) {
document.body.innerHTML = "";
document.body.appendChild(canvas);
}

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 25;
controls.update();


window.addEventListener("keydown", cameraMovement, false);
canvas.addEventListener("mousemove", onMouseMove, false);
canvas.addEventListener("mousedown", onMouseDown, false);
canvas.addEventListener("mouseup", onMouseUp, false);
// canvas.addEventListener("mouseover", onMouseOver, false);
// canvas.addEventListener("mouseout", onMouseOut, false);

function cameraMovement(event) {
    const keyMap = {
         ArrowUp: new Vector3(0,  1,  0),
         ArrowDown: new Vector3(0,  -1,  0),
         ArrowLeft: new Vector3(-1,  0,  0),
         ArrowRight: new Vector3(1,  0,  0),
       };
     const key = keyMap[event.key];
     if (key !== undefined) {
     camera.position.add(key);
    }
}

function onMouseMove(event) {
    if (!scene.gameOver) {
        scene.highlightCube(event, camera);
    }
}

function onMouseDown(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function onMouseUp(event) {
    if (Math.abs(mouseX - event.clientX) + Math.abs(mouseY - event.clientY) > 4) {
        return;
    }
    if (!scene.gameOver) {
        if (event.button == 0) {
            scene.revealCube(event, camera);
        }
        else {
            scene.flagCube(event,camera);
        }
    }
}

// function onMouseOver(event) {
//     if (!scene.gameOver) {
//         scene.highlightCube(event, camera);
//     }
// }

// function onMouseOut(event) {
//     if (!scene.gameOver) {
//         scene.unHighlightCube(event, camera);
//     }
// }

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    renderer.render(scene, camera);
    // scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);


// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
