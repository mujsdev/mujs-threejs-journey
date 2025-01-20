import * as three from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new three.Scene();

// Object
// In (1, 1, 1, 4, 4, 4), adding the (4, 4, 4) in the box geometry is adding segments in the shape
// This will only make sense and be useful when we have elements on the subdivision that are going to be useful
// So, like on a plain terrain, mountains, trees, etc. In order to add those, you need to a lot of faces (subdivisions) on the field to make it work and show the details
// const geometry = new three.BoxGeometry(1, 1, 1, 4, 4, 4);

// ==========================================================================================================
// CREATING ONE TRIANGLE
// Why do we need these? Well, since we're trying to create a triangle, we need 3 vertices
// The three values in each vertex is the x, y, z value
// const positionsArray = new Float32Array([
//   // first vertex
//   0, 0, 0,
//   // second vertex
//   0, 1, 0,
//   // third vertex
//   1, 0, 0,
// ]);

// What do we do with the Float32Array? Well, we need to convert it to a BufferAttribute
// const positionsAttribute = new three.BufferAttribute(positionsArray, 3);

// This is now where we create the triangle. We need the BufferGeometry for this specifically
// We need to set the attribute for the buffer geometry with a specific name called "position" (that's a reserved name otherwise it won't work)
// But this is also the name that will be used in shaders
// const geometry = new three.BufferGeometry();
// geometry.setAttribute("position", positionsAttribute);
// ==========================================================================================================

// ==========================================================================================================
// CREATING 50 TRIANGLES
// Note: you can have fun by changing the values of the count to create more triangles
const geometry = new three.BufferGeometry();

// What's this below? We need to create a bunch of triangles (50). For each triangle there'll be 3 vertices, and each vertex will have 3 values
// Which is why 50 multiplied by 3 (vertex) multiplied by 3 (value for each vertex)
const count = 50;
const positionsArray = new Float32Array(count * 3 * 3);

// Creating random values for the positions array in a for loop (writing it manually would take forever)
// Note: you can create more area by multiplying the Math.random with like 4 or something
for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = Math.random() - 0.5;
}

const positionsAttribute = new three.BufferAttribute(positionsArray, 3);
geometry.setAttribute("position", positionsAttribute);
// ==========================================================================================================

const material = new three.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const mesh = new three.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new three.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new three.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new three.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
