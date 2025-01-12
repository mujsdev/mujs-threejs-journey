import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new three.Scene();

// Object
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
  width: window.innerWidth,
  height: window.innerHeight,
};

// Listen to the resize event
// This is important when you're trying to create a full width and height experience. You need to update the sizes of the width and height, updating the camera aspect ratio (since it was using the outdate width and height), updating the projection matrix (happens behind the scenes), and then finally update the renderer (which would re-set the size of the canvas overall)
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);

  // Update pixel ratio
  // Reason this is done this way because there could be a chance someone could move their window to another screen which would probably have a different devicePixelRatio. We wanna make sure this accounts for that change too
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Listen to the dblclick event
// This is done to detect the double click event in order to make the whole canvas go full screen. This is to make the experience immersive
// The fullscreenElement will work on some devices in the Apple ecosystem and some places it won't. It'll work on iPad but probably not on an iPhone. It'll work on a Safari on a mac but that depends on the Mac OS and Safari version
window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
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

// Important: Setting pixel ratio of maximum 2
// Phones have pixel ratios of more than 2 (up to 5), but we don't want that because that can cause performance issues. So, we wanna make sure that we set a minimum of whatever the device has but limit it to only 2. We should do this everytime for all projects we create
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
