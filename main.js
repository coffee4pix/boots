import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';


const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.add(camera);
camera.position.z = 3;
camera.position.x = 280;
camera.position.y = 5;
camera.rotation.y = Math.PI * 0.5;



//loading scene model
const loader = new GLTFLoader();
loader.load( 'model/blend_boots3.glb', function ( gltf ) {

  scene.add( gltf.scene );

}, undefined, function ( error ) {

  console.error( error );

} );

//lighting
const ambienceLights = new THREE.AmbientLight(
    0x296887,
    1
);
scene.add(ambienceLights);


const light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set(1, 10, 3);
light.target.position.set(270, 5, 3);
light.castShadow = true;
scene.add( light );
scene.add(light.target);


//fog
{
  //const color = 0x472118;
  const color = 0x4a2a2f;
  const density = 0.035;
  scene.fog = new THREE.FogExp2(color, density);
}

scene.background = new THREE.Color(0x4a2a2f); 

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//shadows


//audio
// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( 'model/boots_audio_finalfinal.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( false );
	sound.setVolume( 1.5 );
	});

//subtitles
let audioStartTime = 0;

const subtitles = [
  { start: 3, end: 9, text: "We're foot—slog—slog—sloggin’ over Africa" },
  { start: 9, end: 15, text: "Foot—foot—foot—foot—sloggin’ over Africa" },
  { start: 15, end: 20, text: "(Boots—boots—boots—boots—movin’ up and down again)" },
  { start: 20, end: 23, text: "There's no discharge in the war!"},
  {start: 23, end: 29, text: "Seven—six—eleven—five—nine-an'-twentymile to-day —"},
  {start: 29, end: 33, text: "Four—eleven—seventeen—thirty-two the day before —"},
  {start: 33, end: 38.5, text: "(Boots—boots—boots—boots—movin' up an' down again!)"},
  {start: 38.5, end: 41, text: "There's no discharge in the war!"},
  {start: 41, end: 47, text: "Don't—don't—don't—don't—look at what's in front of you."},
  {start: 47, end: 52, text: "(Boots—boots—boots—boots—movin' up an' down again);"},
  {start: 52, end: 57, text: "Men—men—men—men—men go mad with watchin' em,"},
  {start: 57, end: 60, text: "An' there's no discharge in the war!"},
  {start: 60, end: 65, text: "Count—count—count—count—the bullets in the bandoliers."},
  {start: 65, end: 70, text: "If—your—eyes—drop—they will get atop o' you!"},
  {start: 70, end: 75, text: "(Boots—boots—boots—boots—movin' up an' down again) —"},
  {start: 75, end: 78, text: "There's no discharge in the war!"},
  {start: 78, end: 84, text: "We—can—stick—out—'unger, thirst, an' weariness,"},
  {start: 84, end: 88, text: "But—not—not—not—not the chronic sight of 'em —"},
  {start: 88, end: 94, text: "Boot—boots—boots—boots—movin' up an' down again,"},
  {start: 94, end: 97, text: "An' there's no discharge in the war!"},
  {start: 97, end: 102, text: "I—'ave—marched—six—weeks in 'Ell an' certify"},
  {start: 102, end: 107, text: "It—is—not—fire—devils, dark, or anything,"},
  {start: 107, end: 113, text: "But boots—boots—boots—boots—movin' up an' down again,"},
  {start: 113, end: 115, text: "An' there's no discharge in the war!"},
  {start: 115, end: 121, text: "Try—try—try—try—to think o' something different —"},
  {start: 121, end: 126, text: "Oh—my—God—keep—me from goin' lunatic!"},
  {start: 126, end: 131, text: "(Boots—boots—boots—boots—movin' up an' down again!)"},
  {start: 131, end: 136, text: "There's no discharge in the war!"},
 

];

// controls
let controls = new PointerLockControls(camera, canvas);
       //scene.add(controls.object);
       scene.add(controls.getObject());

// Activate pointer lock on click 
canvas.addEventListener('click', () => {
  controls.lock(); 
});


//fit to window
window.addEventListener('resize', () =>{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight);
})

const clock = new THREE.Clock(); 



function updateSubtitles() {
  if (!subtitleBox) return;          

  const currentTime = clock.getElapsedTime() - audioStartTime;

  const activeLine = subtitles.find(
    line => currentTime >= line.start && currentTime <= line.end
  );

  subtitleBox.textContent = activeLine ? activeLine.text : '';
}


//render

const renderloop = () => {
  const delta = clock.getDelta();
  const speed = 5; 
 
  
 if (sound.isPlaying === true){
    controls.object.position.x -= speed * delta;
    //controls.pointerSpeed = 0.5
    //const chance = Math.random() < 0.5 ? 0 : 1;
    //if (clock.getElapsedTime() >= 100) {}
 }
  
 updateSubtitles();
  if ( camera.position.x < 8 ) {
   // console.log('camera at',camera.position.x);
    camera.position.set(270, 5, 3); // original position
    
  }


  renderer.render(scene, camera);
  requestAnimationFrame(renderloop);
};
 
// Final setup
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startButton");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      document.getElementById("overlay").style.display = "none";

      sound.play();
      audioStartTime = clock.getElapsedTime();
      renderloop();

      
      
    });
  } else {
    console.error("Start button not found!");
  }
});
