import * as THREE from "three";

import GUI from "lil-gui";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Textures
const textureLoader = new THREE.TextureLoader();
const bakedShadowTexture = textureLoader.load("/textures/bakedShadow.jpg");
const simpleShadowTexture = textureLoader.load("/textures/simpleShadow.jpg");

// Any textures that are used as a map or matcap will need to encoded in SRGBColorSpace
bakedShadowTexture.colorSpace = THREE.SRGBColorSpace;
simpleShadowTexture.colorSpace = THREE.SRGBColorSpace;

// Base
// Debug
const gui = new GUI();
gui.close();
const cameraHelperDebug = gui.addFolder("Camera helpers");
const lightHelperDebug = gui.addFolder("Light helpers");
const lightIntensityDebug = gui.addFolder("Light intensity");

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Lights
// Only 3 types of lights can support shadows - PointLight, DirectionalLight, SpotLight
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
lightIntensityDebug
  .add(ambientLight, "intensity")
  .min(0)
  .max(3)
  .step(0.001)
  .name("ambientLight intensity");
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(2, 2, -1);
lightIntensityDebug
  .add(directionalLight, "intensity")
  .min(0)
  .max(3)
  .step(0.001)
  .name("directionalLight intensity");
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
scene.add(directionalLight);

// console.log(directionalLight.shadow);
// This will help cast the shadow on the object and then since the shadow casted doesn't look the best in the first place, we'll need to increase the resolution of it by 2. But careful when to use it cuz if you have a lot of renders and lot of shadows, and their qualities are too good, then it'll cause performance issues
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

// This makes everything a lot better and less bugs
directionalLight.shadow.camera.near = 2;
directionalLight.shadow.camera.far = 6;

// We wanna fix the amplitude as well because we don't want the area to be too big either
// Fixing the amplitude also helps in getting a clearer picture since the area isn't so big for a small object. Better details
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;

// We can also control the blur of the shadow by messing around with the radius. Gives you pretty neat results too
directionalLight.shadow.radius = 10;

// Spotlight
// To update the amplitude of the light, you'll need to update the value of the angle.
// The lower the angle, the better the amplitude and better quality and less bugs (depending on how you use it)
// We can reduce Math.PI * 0.3 to Math.PI * 0.2
// Updating the FOV of the camera won't help here in the latest version of threejs
const spotLight = new THREE.SpotLight(0xffffff, 3.6, 10, Math.PI * 0.2);
spotLight.castShadow = true;
spotLight.position.set(0, 2, 2);
scene.add(spotLight);
// You only add this if you wanna move the spotlight on another object or in another direction
scene.add(spotLight.target);
lightIntensityDebug
  .add(spotLight, "intensity")
  .min(0)
  .max(5)
  .step(0.001)
  .name("spotLight intensity");

// Improving the quality of the shadow
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

// This makes everything a lot better and less bugs
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

// Point light
const pointLight = new THREE.PointLight(0xffffff, 2.7);
pointLight.castShadow = true;
pointLight.position.set(-1, 1, 0);
scene.add(pointLight);
lightIntensityDebug
  .add(pointLight, "intensity")
  .min(0)
  .max(5)
  .step(0.001)
  .name("pointLight intensity");

// Improving the quality of the shadow
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;

// This makes everything a lot better and less bugs
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;

// Light helpers
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(directionalLightHelper, spotLightHelper, pointLightHelper);

directionalLightHelper.visible = false;
spotLightHelper.visible = false;
pointLightHelper.visible = false;

// Add light helpers to debug
lightHelperDebug
  .add(directionalLightHelper, "visible")
  .name("directionalLight");
lightHelperDebug.add(spotLightHelper, "visible").name("spotLight");
lightHelperDebug.add(pointLightHelper, "visible").name("pointLight");

// Camera light helpers
// You wanna make sure the near and far values are better because although it's fine if the far value is toooo far but this will cause shadow glitches so we don't want that either. We wanna make sure near and far values are as best and as needed as possible so there's no issues with the scene
const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(
  directionalLightCameraHelper,
  spotLightCameraHelper,
  pointLightCameraHelper
);

// Have the camera helpers be invisible by default
directionalLightCameraHelper.visible = false;
spotLightCameraHelper.visible = false;
pointLightCameraHelper.visible = false;

// Add camera helpers to debug
cameraHelperDebug
  .add(directionalLightCameraHelper, "visible")
  .name("directionalLight camera");
cameraHelperDebug
  .add(spotLightCameraHelper, "visible")
  .name("spotLight camera");
cameraHelperDebug
  .add(pointLightCameraHelper, "visible")
  .name("pointLight camera");

// BAKING CONCEPT
// Similar to baking lights, we can also bake shadows within the texture. And that's fine too but the same caveat with shadows is that it won't move along with the direction of the light. So it'll all be fixed in the same place but performance wise it's better

// Materials
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true;

// This is a baked shadow approach. Good but not the best if the object moves on the plane. Then this becomes useless but that depends on the project entirely
// const plane = new THREE.Mesh(
//   new THREE.PlaneGeometry(5, 5),
//   new THREE.MeshBasicMaterial({ map: bakedShadowTexture })
// );
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
plane.receiveShadow = true;

scene.add(sphere, plane);

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadowTexture,
  })
);
sphereShadow.rotation.x = -(Math.PI * 0.5);
sphereShadow.position.y = 0.01 + plane.position.y;
scene.add(sphereShadow);

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
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1, 3, 5);
// camera.position.set(1, 1, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// You turn this off if you don't need it or remove it completely if you have baked shadows
renderer.shadowMap.enabled = false;

// You go for the below shadow map when you want even smoother shadows. Note that doing this will lose the radius property on the shadow since the purpose it to keep smooth shadows
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update sphere - we wanna move the sphere so that we can see the shadow movement work as well
  sphere.position.x = Math.cos(elapsedTime) * 1.5;
  sphere.position.z = Math.sin(elapsedTime) * 1.5;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

  // Update the shadow of the sphere
  sphereShadow.position.x = sphere.position.x;
  sphereShadow.position.z = sphere.position.z;
  sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
