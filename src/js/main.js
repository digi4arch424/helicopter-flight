/* global THREE */

import { Helicopter } from './entities/Helicopter.js';

const canvas   = document.getElementById('renderCanvas');
const scene    = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // sky-blue

const camera   = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// Lighting
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(hemi);
const dir = new THREE.DirectionalLight(0xffffff, 1.5);
dir.position.set(50, 100, 50);
dir.castShadow = true;
dir.shadow.mapSize.set(2048, 2048);
scene.add(dir);

// GLTF loader
const loader = new THREE.GLTFLoader();
const draco  = new THREE.DRACOLoader();   // optional
loader.setDRACOLoader(draco);

// 🚫 Removed: Load world
// loader.load('assets/world/world_model.glb', gltf => {
//   const world = gltf.scene;
//   world.traverse(n => {
//     if (n.isMesh) {
//       n.castShadow    = true;
//       n.receiveShadow = true;
//     }
//   });
//   scene.add(world);
// });

// ✅ Load helicopter from GitHub
let helicopter;
loader.load('https://raw.githubusercontent.com/digi4arch424/helicopter-flight/main/assets/models/helicopter/helicopter_model.glb', gltf => {
  const hGroup = gltf.scene;
  hGroup.traverse(n => {
    if (n.isMesh) n.castShadow = true;
  });
  helicopter = new Helicopter(hGroup, camera, scene);
});

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Game loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  if (helicopter) helicopter.update(dt);
  renderer.render(scene, camera);
}
animate();
