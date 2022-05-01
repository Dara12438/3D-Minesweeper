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

let html =
'<center><h2>How to Play:</h2></center>' +
'<p>This game takes the classic Minesweeper and moves it to a 3D cube. When you click on a block you can reveal either a number, an empty space, or a bomb. Your goal is to reveal every block without a bomb inside. Numbered blocks will tell you whether there is a bomb anywhere in its vicinity (anywhere in the 3x3 space centered around that cube). However, if you reveal a bomb you lose and the game ends. </p>' +
'<center><h3>Controls</h3></center>' +
'<p>Left Click and Drag: Rotate cube</p>' +
'<p>Left Click Cube: Reveal highlighted block</p>' +
'<p>Right Click: Flag highlighted block (right click again to change or remove flag)</p>' +
'<div class="minenumber">' +
'<center><h2>Choose Cube\'s Size:</h2></center>' +
'<input type="range" min="5" max="50" value="30" class="slider" id="myRange">'+
'</div>'+
'<center><h2>Cube Size: <span id="demo"></span> x <span id="demo2"></span> x <span id="demo3"></span></h2></center>' +
'<div class="diffSetting">' +
    '<center><h2>Choose Your Difficulty:</h2>'+
    '<h2>'+
    '<input type="radio" id="diff1" name="diff" value="1">'+
    '<label for="diff1" style="color:green">Easy</label><br>'+
    '<input type="radio" id="diff2" name="diff" value="2" checked>'+
    '<label for="diff2" style="color:yellow">Medium</label><br>'+
    '<input type="radio" id="diff3" name="diff" value="3">'+
    '<label for="diff3" style="color:red">Hard</label><br>'+
'</h2>'+
'</center>'+
'</div>'+
'<div class="diffSetting">'+
'<center><h2>Choose Block Settings:</h2>'+
'<h2>'+
'<input type="radio" id="hollow" name="cubeSetting" value="1" checked>'+
'<label for="diff1">Hollow Cube (only play on cube faces)</label><br>'+
'<input type="radio" id="diff2" name="cubeSetting" value="2">'+
'<label for="diff2">Filled Cube (play on the inside of the cube)</label><br>'+
'</h2>'+
'</center>'+
'</div>'+
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


let style = document.createElement("style");
style.innerHTML = htmlStyle;

let page = document.createElement("BODY");
page.innerHTML = html;
page.style.cssText = 'background: #9e9e9e;';

document.head.appendChild(style);
document.body = page;
var slideTest = document.getElementById("slider");
console.log(slideTest);
document.body.appendChild(canvas);


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
