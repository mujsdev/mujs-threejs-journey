import * as three from "three";

import GUI from "lil-gui";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

// GUI
const gui = new GUI({ title: "Debug Materials UI" });

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new three.Scene();

// Textures
const textureLoader = new three.TextureLoader();

const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("./textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load(
  "./textures/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "./textures/door/roughness.jpg"
);
const matCapTexture = textureLoader.load("./textures/matcaps/8.png");
const gradientTexture = textureLoader.load("./textures/gradients/5.jpg");

doorColorTexture.colorSpace = three.SRGBColorSpace;
matCapTexture.colorSpace = three.SRGBColorSpace;

// Objects - Group of 3: Sphere, Plane, Torus
const group = new three.Group();
scene.add(group);

// MESH BASIC MATERIAL
// Instead of adding the map directly during instantiating, you can create the material first and then add the map later on as well. There are/can be some differences doing this way but that's if you intentionally expect it to so it depends on the project
// const material = new three.MeshBasicMaterial({ map: doorColorTexture });
// const material = new three.MeshBasicMaterial();
// material.map = doorColorTexture;
// material.color = new three.Color("#FAD161");
// material.transparent = true;
// material.opacity = 0.5;
// material.alphaMap = doorAlphaTexture;
// The side property is pretty great specifically for Planes. When you try to rotate the camera but can't see it on the other side cuz it disappears. Having the value on the DoubleSide will show the planes on both sides. DoubleSide works for Spheres or Toruses as well where if you wanna see the inside of the object, you can do that as well. The only CAVEAT is that it will take more resources for this to work and also possibly more time to load and more pixels to test. So if you don't need it, don't use it.
// Objects created in Blender are double sided by default which isn't best for performance
// material.side = three.DoubleSide;

// MESH NORMAL MATERIAL
// const material = new three.MeshNormalMaterial();
// material.wireframe = true;
// material.flatShading = true;

// MESH MATCAP MATERIAL
// Looks fantastic while remaining performant
// It'll look like there's a light in the scene except there isn't. We can't change the light density or anything so it's fixed. But it looks really well
// You can get a list of amazing matcaps here: https://github.com/nidorx/matcaps
// Note that not all of them are verified for commercial use. Personal projects at most
// You can choose to create your own matcaps too https://www.kchapelier.com/matcap-studio/
// const material = new three.MeshMatcapMaterial();
// material.wireframe = true;
// material.matcap = matCapTexture;

// MESH DEPTH MATERIAL
// I might use this for my personal portfolio project. It just has a cool dim effect
// I wonder if I can add a gradient on this and see how that works
// const material = new three.MeshDepthMaterial();

// MESH LAMBERT MATERIAL
// You wont be able to see anything here because it's the first material that requires lights. Matcaps don't use lights but this one will
// It supports the same properties on the MeshBasicMaterial except it needs light and also has light related properties
// It is the MOST performant material that uses lights
// const material = new three.MeshLambertMaterial();

// MESH PHONG MATERIAL
// Looks kinda similar to lambert. There's line glitches in lambert which don't exist here. but this also means that it's less performant than the lambert one
// const material = new three.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new three.Color("#FAD");

// MESH TOON MATERIAL
// The toon material is pretty cool imo. Reminds me of a game like Sifu or something. Probably my favorite one so far. Cell Shading technique. I should use this on my portfolio
// The gradient texture won't work until we disable mipmapping on the texture. This will help us get the "minecraft" style look which is big pixels rather than blending them together. So we should also disable mipmapping so it saves us some performance
// const material = new three.MeshToonMaterial();
// gradientTexture.minFilter = three.NearestFilter;
// gradientTexture.magFilter = three.NearestFilter;
// gradientTexture.mipmaps = false;
// material.gradientMap = gradientTexture;

// MESH STANDARD MATERIAL
// For the metalness and roughness to work, you'll need lighting here so keep that in mind
// To see the reflection of the environement, you can set the metalness to 1 and roughness to 0 for a really cool effect
// const material = new three.MeshStandardMaterial();
// material.metalness = 1;
// material.roughness = 1;
// material.side = three.DoubleSide;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.1;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

// Adding debug for metalness and roughness
// gui.add(material, "metalness").min(0).max(1).step(0.0001);
// gui.add(material, "roughness").min(0).max(1).step(0.0001);

// MESH PHYSICAL MATERIAL
// It's the same as the Standard material except there's more features on this. More realistic features like clearcoat, sheen, etc
// This is probably the worst one out of the all in terms of performance
const material = new three.MeshPhysicalMaterial();
material.metalness = 0;
material.roughness = 0;
material.side = three.DoubleSide;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.1;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

// Adding debug for metalness and roughness
gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);

// Clearcoat adds a nice varnish/glass effect but poor performance so use wisely
// material.clearcoat = 1;
// material.clearcoatRoughness = 0;
// gui.add(material, "clearcoat").min(0).max(1).step(0.0001);
// gui.add(material, "clearcoatRoughness").min(0).max(1).step(0.0001);

// Sheen effect
// It's usually for fluffy material. You'll wanna rub your face on the fluffy materials
// material.sheen = 1;
// material.sheenRoughness = 0.25;
// material.sheenColor.set(1, 1, 1);
// gui.add(material, "sheen").min(0).max(1).step(0.0001);
// gui.add(material, "sheenRoughness").min(0).max(1).step(0.0001);
// gui.addColor(material, "sheenColor");

// Iridecense
// It creates color artifacts like a fuel puddle, soap bubbles, or LaserDiscs (it'll look like a rainbow of sorts). It looks a bit weird on wood
// material.iridescence = 1;
// material.iridescenceIOR = 1;
// material.iridescenceThicknessRange = [100, 800];
// gui.add(material, "iridescence").min(0).max(1).step(0.0001);
// gui.add(material, "iridescenceIOR").min(0).max(2.333).step(0.0001);
// gui.add(material.iridescenceThicknessRange, "0").min(1).max(1000).step(1);
// gui.add(material.iridescenceThicknessRange, "1").min(1).max(1000).step(1);
// gui.add(material.iridescenceThicknessRange, "1").min(1).max(1000).step(1);

// Transmission
// This one enables the light go through the material
// It's more than just transaprency with opacity in the object because the image behind the object gets deformed
// It's basically like a translucent gloss effect
// ior is the index of refraction
material.transmission = 1;
material.ior = 1.5;
material.thickness = 0.5;
gui.add(material, "transmission").min(0).max(1).step(0.0001);
gui.add(material, "ior").min(1).max(10).step(0.0001);
gui.add(material, "thickness").min(0).max(1).step(0.0001);

// Sphere mesh
const sphere = new three.Mesh(new three.SphereGeometry(0.5, 64, 64), material);
sphere.position.set(-1.5, 0, 0);
group.add(sphere);

// Plane mesh
const plane = new three.Mesh(new three.PlaneGeometry(1, 1, 100, 100), material);
group.add(plane);

// Torus mesh
const torus = new three.Mesh(
  new three.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.set(1.5, 0, 0);
group.add(torus);

// Lights
// Okay the light is added but it looks like the MeshBasicMaterial in a way. We need to make sure the light is actually pointing in a specific direction
// const ambientLight = new three.AmbientLight("white", 1);
// scene.add(ambientLight);

// const pointLight = new three.PointLight("white", 30);
// pointLight.position.set(2, 3, 4);
// scene.add(pointLight);

// Environment map
// Since we already have the lighting in the environment, we don't need the lighting from our light here in the environment
const rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/environmentMap/2k.hdr", (environmentMap) => {
  environmentMap.mapping = three.EquirectangularReflectionMapping;
  scene.background = environmentMap;
  scene.environment = environmentMap;
});

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
camera.position.set(1, 1, 4);
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
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = -0.15 * elapsedTime;
  plane.rotation.x = -0.15 * elapsedTime;
  torus.rotation.x = -0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
