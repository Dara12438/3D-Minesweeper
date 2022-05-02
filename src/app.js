/*
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, Audio, AudioListener, AudioLoader } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CubeScenes } from 'scenes';

// audio
import easyAudio from "../src/components/audio/easy.mp3";
import mediumAudio from "../src/components/audio/medium.mp3";
import hardAudio from "../src/components/audio/hard.mp3";
import reveal from "../src/components/audio/reveal.mp3";
import win from "../src/components/audio/victory.mp3";
import lose from "../src/components/audio/bomb.mp3";

// images
import img1 from '../src/components/images/1.png';
import img2 from '../src/components/images/2.png';
import img3 from '../src/components/images/3.png';
import img4 from '../src/components/images/4.png';
import img5 from '../src/components/images/5.png';
import img6 from '../src/components/images/6.png';
import img7 from '../src/components/images/7.png';
import img8 from '../src/components/images/8.png';
import img9 from '../src/components/images/9.png';
import img10 from '../src/components/images/10.png';
import img11 from '../src/components/images/11.png';
import img12 from '../src/components/images/12.png';
import img13 from '../src/components/images/13.png';
import img14 from '../src/components/images/14.png';
import img15 from '../src/components/images/15.png';
import img16 from '../src/components/images/16.png';
import img17 from '../src/components/images/17.png';
import img18 from '../src/components/images/18.png';
import img19 from '../src/components/images/19.png';
import img20 from '../src/components/images/20.png';
import img21 from '../src/components/images/21.png';
import img22 from '../src/components/images/22.png';
import img23 from '../src/components/images/23.png';
import img24 from '../src/components/images/24.png';
import img25 from '../src/components/images/25.png';
import img26 from '../src/components/images/26.png';
import bombPic from '../src/components/images/bomb.png';
import exclaimPic from '../src/components/images/exclaim.png';
import questionPic from '../src/components/images/question.png';
const images = [bombPic, img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16, img17, img18, img19, img20, img21, img22, img23, img24, img25, img26, exclaimPic, questionPic];

// Initialize core ThreeJS components
//const scene = new Launch();

// true - FilledScene; false - HollowScene
let scene = new CubeScenes(false, 1, 2, images);
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });
let mouseX;
let mouseY;

// Set up camera
// camera.position.set(6, 3, -10);
// camera.position.set(25, 25, -25);
// camera.lookAt(new Vector3(0, 0, 0));



// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling


// Setting up html start website
let startingParts = [];
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
'<p>This game takes the classic Minesweeper and moves it to a 3D cube. When you click on a block you can reveal either a number, an empty space, or a bomb. Your goal is to reveal every block without a bomb inside. Numbered blocks will tell you whether there is a bomb anywhere in its vicinity (anywhere in the 3x3 space centered around that cube). However, if you reveal a bomb you lose and the game ends. If you wish to play again, just refresh the page to be taken back here. </p>' +
'<center><h3>Controls</h3></center>' +
'<p><b>Scroll Wheel:</b> Zoom in/out on cube</p>' +
'<p><b>Left Click and Drag:</b> Rotate cube</p>' +
'<p><b>Left Click Cube:</b> Reveal highlighted block</p>' +
'<p><b>Right Click:</b> Flag highlighted block (right click again to change or remove flag)</p>' +
'<br><center><h2>Choose Cube\'s Size:</h2></center>';
startingParts.push(beginText);

// Elements to control size of cube
var sliderBlocks = document.createElement("input");
sliderBlocks.type = "range";
sliderBlocks.min = 5;
sliderBlocks.max = 15;
sliderBlocks.value = 10;
sliderBlocks.className = "slider";
sliderBlocks.id = "minesSlider";
var faceSize = sliderBlocks.value;
sliderBlocks.oninput = faceResize;
document.body.appendChild(sliderBlocks);

var sizeOutput = document.createElement("div");
sizeOutput.id = "sizeText";
sizeOutput.innerHTML = '<center><h2>Cube Size: ' + faceSize + " x " + faceSize + " x " + faceSize + '</h2></center>';
document.body.appendChild(sizeOutput);

function faceResize() {
    faceSize = document.getElementById('minesSlider').value;
    document.getElementById("sizeText").innerHTML = '<center><h2>Cube Size: ' + faceSize + " x " + faceSize + " x " + faceSize + '</h2></center>';
}
startingParts.push(sliderBlocks);
startingParts.push(sizeOutput);

//Difficulty header
const diffText = document.createElement("div");
diffText.innerHTML = '<center><h2>Choose Your Difficulty:</h2>';
document.body.appendChild(diffText);
startingParts.push(diffText);

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
var diffValue = 1;
diffDropdown.onchange = diffChange;
document.body.appendChild(diffDropdown);
startingParts.push(diffDropdown);

function diffChange () {
    diffValue = document.getElementById("diff").value;
}

//Cube type header
const cubeText = document.createElement("div");
cubeText.innerHTML = '<center><h2>Choose Your Playing Field:</h2>';
document.body.appendChild(cubeText);
startingParts.push(cubeText);

// Cube type dropdown elements
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
startingParts.push(cubeDropdown);

function cubeChange () {
    cubeValue = document.getElementById("cubeSpace").value;
}

const button = document.createElement('button');
document.body.appendChild(button);
startingParts.push(button);
button.id = "startButton";
button.style.width = "100%";
button.innerHTML = "Start the Game!";
button.addEventListener("click", startGame, false);

function startGame (event) {
    setGameUp();
}

function setGameUp () {
    startingParts.forEach((startingPart) => startingPart.remove());
    startingParts = null;
    page.style.cssText = '';
    canvas.style.display = 'block'; // Removes padding below canvas
    document.body.style.margin = 0; // Removes margin around page
    document.body.style.overflow = 'hidden'; // Fix scrolling

    scene = new CubeScenes(cubeValue, diffValue, faceSize, images);
    camera.position.set(faceSize, faceSize, -faceSize);
    document.body.appendChild(canvas);
    uploadAudio();
}

// Set up camera
// camera.position.set(6, 3, -10);
camera.lookAt(new Vector3(0, 0, 0));

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = faceSize + 1;
controls.update();


window.addEventListener("keydown", cameraMovement, false);
canvas.addEventListener("mousemove", onMouseMove, false);
canvas.addEventListener("mousedown", onMouseDown, false);
canvas.addEventListener("mouseup", onMouseUp, false);

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

    let soundPlay = 0;
    if (!scene.gameOver) {
        if (event.button == 0) {
            soundPlay = scene.revealCube(event, camera);
            
        }
        else {
            soundPlay = scene.flagCube(event,camera);
        }
        scene.displayBombsLeft();

        if (scene.gameOver) {
            ongoingSound.stop();
            if (scene.gameOverText == "You hit a bomb!") {
                inGameAudio(lose);
            }
            else {
                inGameAudio(win);
            }
        }
        else {
            if (soundPlay == 1) {
                inGameAudio(reveal);
            }
        }
    }
}

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

// add audio
var audioListener = new AudioListener();
camera.add(audioListener);
var ongoingSound = new Audio(audioListener);

function uploadAudio() {
    //var audioListener = new AudioListener();
    //camera.add(audioListener);
    var sound = new Audio(audioListener);
    var audioLoader = new AudioLoader();

    let audioChoice = easyAudio;
    if (diffValue == 2) {
        audioChoice = mediumAudio;
    }
    else if (diffValue == 3) {
        audioChoice = hardAudio;
    }

    audioLoader.load(audioChoice, function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.1);
        sound.play();
        ongoingSound = sound;
    });
}

function inGameAudio(audio) {
    var audioListener = new AudioListener();
    camera.add(audioListener);
    var sound = new Audio(audioListener);
    var audioLoader = new AudioLoader();

    audioLoader.load(audio, function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(false);
        sound.setVolume(0.5);
        sound.play();
    });
}

