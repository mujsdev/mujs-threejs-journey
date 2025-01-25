import * as three from "three";

import GUI from "lil-gui";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

// Debug
const gui = new GUI();
const intensityDebugFolder = gui.addFolder("Light intensity");

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new three.Scene();

// Lights
const ambientLight = new three.AmbientLight("#fad", 1);
scene.add(ambientLight);
intensityDebugFolder
  .add(ambientLight, "intensity")
  .min(0)
  .max(3)
  .step(0.001)
  .name("ambientLight");

const directionalLight = new three.DirectionalLight("#fff", 0.9);
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight);
intensityDebugFolder
  .add(directionalLight, "intensity")
  .min(0)
  .max(3)
  .step(0.001)
  .name("directionalLight");

const hemisphereLight = new three.HemisphereLight("red", "blue", 0.9);
scene.add(hemisphereLight);
intensityDebugFolder
  .add(hemisphereLight, "intensity")
  .min(0)
  .max(3)
  .step(0.001)
  .name("hemisphereLight");

const pointLight = new three.PointLight(0xff9000, 1.5, 10, 2);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);
intensityDebugFolder
  .add(pointLight, "intensity")
  .min(0)
  .max(3)
  .step(0.001)
  .name("pointLight");

// This light only works with MeshStandard and MeshPhysical material
// The lookAt will look at the center of the scene (i.e. new vector3 which is 0,0,0)
const rectAreaLight = new three.RectAreaLight(0x4e00ff, 2, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new three.Vector3());
scene.add(rectAreaLight);
intensityDebugFolder
  .add(rectAreaLight, "intensity")
  .min(0)
  .max(5)
  .step(0.001)
  .name("rectAreaLight");

const spotLight = new three.SpotLight(0x78ff00, 4.5, 6, Math.PI * 0.1, 0.25, 1);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);
intensityDebugFolder
  .add(spotLight, "intensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("spotLight intensity");

spotLight.target.position.x = -0.75;
scene.add(spotLight.target);

// LIGHTS PERFORMANCE NOTES
// Lights in general can cost so be mindful when to actually use it or not. Don't use a lot like 50 or something because it can be expensive
// Least cost: AmbientLight, HemisphereLight
// Moderate cost: DirectionalLight, PointLight
// High cost: SpotLight, RectAreaLight

// BAKING CONCEPT
// If you don't want to add lights via threejs, you can add them directly to the textures via Baking. And that is the process of adding it to the texture (via Blender or any other 3d software) and you can implement them in your scenes. The point to note that you won't be able to move the light on the object since it's a part of the texture to begin with

// LIGHT HELPERS
// The issue with adding lights is that it's hard to see the position of the light and then experimenting where to place it and that can take a while to get it right. So there are light helpers that make this process easy to assist in positioning lights
// Each of the light helpers have a size that we can size (except for spotLightHelper)
// For the hemisphere helper, you'll see that the top is red and bottom is blue and that's because we've defined those colors in the hemisphereLight above. This helper isn't really helpful since the light is spread everywhere so it's pretty easy to tell but still available
const hemisphereLightHelper = new three.HemisphereLightHelper(
  hemisphereLight,
  0.1
);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new three.DirectionalLightHelper(
  directionalLight,
  0.1
);
scene.add(directionalLightHelper);

const pointLightHelper = new three.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const spotLightHelper = new three.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

// Objects
// Material
const material = new three.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new three.Mesh(new three.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new three.Mesh(new three.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new three.Mesh(
  new three.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new three.Mesh(new three.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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
// Base camera
const camera = new three.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1, 1, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new three.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new three.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
