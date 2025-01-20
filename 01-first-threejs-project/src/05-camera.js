import * as three from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// This file focuses on different types of camera usage and overall camera positioning in the 3d realm when moving around with the cursor

// Cursor
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Scene
const scene = new three.Scene();

// Object
const mesh = new three.Mesh(
  new three.BoxGeometry(1, 1, 1, 5, 5, 5),
  new three.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
);
scene.add(mesh);

// Axes helper
const axesHelper = new three.AxesHelper();
scene.add(axesHelper);

// Orthographic camera - It's interesting because it lacks persepctive (unlike the other camera). Elements are going to have the same size on the screen irrespective of the their distance to the camera. Try changing the z position of the camera from 2 to 4, and you'll see that there's no change in there.
// Now, the one issue with creating an Orthographic camera with the same settings as the Perspective one is that the cube, won't look like a cube at all. Depending on the height of the canvas, it could be squeezed or stretched. To fix that, we need the aspectRatio of the deifned width and height and multiply those values with the left and right viewing angles. That would keep the cube a cube consistently
// const aspectRatio = sizes.width / sizes.height;
// const camera = new three.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// );
// camera.position.set(2, 2, 2);

// Perspective camera
const camera = new three.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 3);
camera.lookAt(mesh.position);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.target.y = 2;
// controls.update();

// Renderer
const renderer = new three.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

// Animate
const clock = new three.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  // mesh.rotation.y = elapsedTime;

  // Update camera
  // camera.position.x = Math.sin(cursor.x * (Math.PI * 2)) * 3;
  // camera.position.z = Math.cos(cursor.x * (Math.PI * 2)) * 3;
  // camera.position.y = cursor.y * 5;
  // camera.lookAt(mesh.position);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
