import * as three from "three";

// This file will focus on creating animations for the cube. This file uses the Clock method to get the elapsed time and based on that altering the transformations of the mesh (cube) to animate them accordingly

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new three.Scene();

// Object (red cube)
const geometry = new three.BoxGeometry(1, 1, 1);
const material = new three.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const mesh = new three.Mesh(geometry, material);
scene.add(mesh);

// Axes helper
const axesHelper = new three.AxesHelper();
scene.add(axesHelper);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new three.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 0, 3);
scene.add(camera);

// Renderer
const renderer = new three.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

// Clock
const clock = new three.Clock();

// Animations
const tick = () => {
  // Clock - The purpose of doing this is to get the same animation time and speed across all devices. So this way, it doesn't depend on different devices FPS, but rather, on the time that's elapsed using clock elapsedTime
  const elapsedTime = clock.getElapsedTime();
  // console.log(elapsedTime);

  // Update object position, rotation, scale, whatever you want
  mesh.rotation.y = elapsedTime;

  // If you want to do one full rotation in one second then it would be Math.PI * 2 multiplied by the elapsedTime
  // mesh.rotation.y = elapsedTime * (Math.PI * 2);

  // You can also mess around with the position of the cube using the sin and cos functions
  // Google more on the cos(x) and sin(x) to understand how the oscillation works from 1 vs 0 (in the graph)
  // mesh.position.x = Math.cos(elapsedTime);
  // mesh.position.y = Math.sin(elapsedTime);

  // Another thing you can do is move the camera instead of moving the cube
  // Now, this is interesting because the position of the cube is the same
  // But, the camera moves its position and it's focused on the position of the cube. So, rather than the object moving, it's the camera moving. It's something similar you'd do when you're moving the camera around on an object in real life in different axis's
  camera.position.x = Math.cos(elapsedTime);
  camera.position.y = Math.sin(elapsedTime);
  camera.lookAt(mesh.position);

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};
tick();
