import * as three from "three";

import gsap from "gsap";

// This file will focus on creating animations for the cube using GSAP. You don't have to use the Clock method here because GSAP has it's own thing running behind the scenes. But, you'll still need to make sure tick function is running the requestAnimationFrame and rendering happens in the function. That's because the rednering happens on each frame and it's not going to work otherwise

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

// GSAP
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });

// Animations
const tick = () => {
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
