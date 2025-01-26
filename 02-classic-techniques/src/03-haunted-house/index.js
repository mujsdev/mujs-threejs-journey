import * as THREE from "three";

import {
  canvas,
  doorDimension,
  graveDimension,
  roofDimension,
  scene,
  textureLoader,
  wallDimension,
} from "./variables";

import GUI from "lil-gui";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Sky } from "three/addons/objects/Sky.js";
import { Timer } from "three/addons/misc/Timer.js";

// Measurement note: Everything in this project is going to be a unit of 1m (meter)

// =========================================
// Debug
// =========================================
const gui = new GUI();

// =========================================
// Textures
// =========================================
// Compression of textures for optimization - I used this website to do so https://www.shutterstock.com/image-converter/jpg-to-webp. The only issue is that I can't change the size of the image but it gets the job done
// Floor
// Using Brown Mud Leaves 01 https://polyhaven.com/a/brown_mud_leaves_01
const floorAlphaTexture = textureLoader.load("./floor/alpha.webp");
const floorColorTexture = textureLoader.load(
  "./floor/brown_mud_leaves_01_1k/diffuse.webp"
);
const floorARMTexture = textureLoader.load(
  "./floor/brown_mud_leaves_01_1k/arm.webp"
);
const floorNormalTexture = textureLoader.load(
  "./floor/brown_mud_leaves_01_1k/normal_gl.webp"
);
const floorDisplacementTexture = textureLoader.load(
  "./floor/brown_mud_leaves_01_1k/displacement.webp"
);

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorColorTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;

floorARMTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;

floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;

floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

// Wall
// Using Mossy Brick https://polyhaven.com/a/mossy_brick
const wallColorTexture = textureLoader.load(
  "./wall/mossy_brick_1k/diffuse.webp"
);
const wallARMTexture = textureLoader.load("./wall/mossy_brick_1k/arm.webp");
const wallNormalTexture = textureLoader.load(
  "./wall/mossy_brick_1k/normal_gl.webp"
);

wallColorTexture.colorSpace = THREE.SRGBColorSpace;

// Roof
// Using Reed Roof 04 https://polyhaven.com/a/reed_roof_04
const roofColorTexture = textureLoader.load(
  "./roof/reed_roof_04_1k/diffuse.webp"
);
const roofARMTexture = textureLoader.load("./roof/reed_roof_04_1k/arm.webp");
const roofNormalTexture = textureLoader.load(
  "./roof/reed_roof_04_1k/normal_gl.webp"
);

roofColorTexture.colorSpace = THREE.SRGBColorSpace;

roofColorTexture.repeat.set(3, 1);
roofARMTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);

// Here we don't need to wrapT because the y value above isn't greater than 1 so there's no need of doing this
roofColorTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;

// Bush
// Using Leaves Forest Ground https://polyhaven.com/a/leaves_forest_ground
const bushColorTexture = textureLoader.load(
  "./bush/leaves_forest_ground_1k/diffuse.webp"
);
const bushARMTexture = textureLoader.load(
  "./bush/leaves_forest_ground_1k/arm.webp"
);
const bushNormalTexture = textureLoader.load(
  "./bush/leaves_forest_ground_1k/normal_gl.webp"
);

bushColorTexture.colorSpace = THREE.SRGBColorSpace;

bushColorTexture.repeat.set(2, 1);
bushARMTexture.repeat.set(2, 1);
bushNormalTexture.repeat.set(2, 1);

// Here we don't need to wrapT because the y value above isn't greater than 1 so there's no need of doing this
bushColorTexture.wrapS = THREE.RepeatWrapping;
bushARMTexture.wrapS = THREE.RepeatWrapping;
bushNormalTexture.wrapS = THREE.RepeatWrapping;

// Grave
// Using Plastered Stone Wall https://polyhaven.com/a/plastered_stone_wall
const graveColorTexture = textureLoader.load(
  "./grave/plastered_stone_wall_1k/diffuse.webp"
);
const graveARMTexture = textureLoader.load(
  "./grave/plastered_stone_wall_1k/arm.webp"
);
const graveNormalTexture = textureLoader.load(
  "./grave/plastered_stone_wall_1k/normal_gl.webp"
);

graveColorTexture.colorSpace = THREE.SRGBColorSpace;

graveColorTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);

// Door
const doorColorTexture = textureLoader.load("./door/color.webp");
const doorAlphaTexture = textureLoader.load("./door/alpha.webp");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./door/ambientOcclusion.webp"
);
const doorHeightTexture = textureLoader.load("./door/height.webp");
const doorNormalTexture = textureLoader.load("./door/normal.webp");
const doorMetalnessTexture = textureLoader.load("./door/metalness.webp");
const doorRoughnessTexture = textureLoader.load("./door/roughness.webp");

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

// =========================================
// House
// =========================================
// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    map: floorColorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.3,
    displacementBias: -0.08,
  })
);
// We want the floor to rotate to a flat floor and for that we'll need to rotate the x quarter of a circle (Math.PI is half of a circle already so dividing that by 2 would be a quarter)
floor.rotation.x = -(Math.PI / 2);
scene.add(floor);

gui
  .add(floor.material, "displacementScale")
  .min(0)
  .max(1)
  .step(0.01)
  .name("floorDisplacementScale");
gui
  .add(floor.material, "displacementBias")
  .min(-1)
  .max(1)
  .step(0.01)
  .name("floorDisplacementBias");

// House container
const house = new THREE.Group();
scene.add(house);

// Walls
// The position of the wall initially is half buried and half not. That's because the geometry is in the center of the scene so we'll have to position the y half above the defined height in the BoxGeometry. So if the height is 2.5, then the y position will be 2.5/2 so the wall is fully above the plane
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(
    wallDimension.width,
    wallDimension.height,
    wallDimension.depth
  ),
  new THREE.MeshStandardMaterial({
    // color: "#ffcccc",
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
  })
);
walls.position.y = wallDimension.height / 2;
house.add(walls);

// Roof
// The position of the roof would be below the wall and to fix it, we'll have to position it above the wall PLUS half the height of the roof (cone). If you just add the height of the wall and save, you'll see that the cone is inside the wall but half of the cone. So, adding that half would solve the issue
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(
    roofDimension.radius,
    roofDimension.height,
    roofDimension.radialSegments
  ),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  })
);
roof.position.y = wallDimension.height + roofDimension.height / 2;
roof.rotation.y = Math.PI / 4;
// house.add(roof);

// Door
// Since the door position is the same as the wall, there'll be z-fighting. So to avoid that, just add a 0.01 to avoid it. So in this case, it'll be 1cm ahead of the wall which is fine
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(doorDimension.width, doorDimension.height, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
    displacementScale: 0.15,
    displacementBias: -0.04,
  })
);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: "#ccffcc",
  map: bushColorTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
bush1.rotation.x = -0.75;

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush2.rotation.x = -0.75;

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.rotation.x = -0.75;

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
bush4.rotation.x = -0.75;

house.add(bush1, bush2, bush3, bush4);

// Graves
const graveGeometry = new THREE.BoxGeometry(
  graveDimension.width,
  graveDimension.height,
  graveDimension.depth
);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
});

const graves = new THREE.Group();
scene.add(graves);

for (let i = 0; i < 30; i++) {
  // Random angles
  // It's going to be x and z values because we only want them to angle on the left/right (x) and front/back (z). x and y would've made sense in the 2D world but in the 3D world, y is just making the grave float lol
  // The spacing out for the graves is making sure that the graves start at radius 3 and then anywhere between that and 7 (so Math.random * 4 would be a number between 0 and 4). That way it's randomized and away from the house
  const angle = Math.random() * (Math.PI * 2);
  const radius = 3 + Math.random() * 4;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  // Mesh
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.x = x;
  grave.position.y = Math.random() * (graveDimension.height / 2);
  grave.position.z = z;

  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;

  // Add to graves group
  graves.add(grave);
}

// =========================================
// Lights
// =========================================
// Ambient light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#86cdff", 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

// Door light
const doorLight = new THREE.PointLight("#ff7d46", 5);
doorLight.position.set(0, 2.2, 2.5);
house.add(doorLight);

// Ghosts
const ghost1 = new THREE.PointLight("#8800ff", 6);
const ghost2 = new THREE.PointLight("#ff0088", 6);
const ghost3 = new THREE.PointLight("#ff0000", 6);
scene.add(ghost1, ghost2, ghost3);

// =========================================
// Sizes
// =========================================
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// =========================================
// Resize event listener
// =========================================
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

// =========================================
// Camera
// =========================================
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4, 2, 5);
scene.add(camera);

// =========================================
// Controls
// =========================================
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// =========================================
// Renderer
// =========================================
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// =========================================
// Shadows
// =========================================
// Renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Cast and receive
directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;
walls.castShadow = true;
roof.castShadow = true;
floor.receiveShadow = true;

walls.receiveShadow = true;
roof.receiveShadow = true;

graves.children.map((grave) => {
  grave.castShadow = true;
  grave.receiveShadow = true;
});

// Mapping - optimizing for the shadow, near, far, quality, etc
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.mapSize.far = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.mapSize.far = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.mapSize.far = 10;

// =========================================
// Sky
// =========================================
const sky = new Sky();
sky.scale.setScalar(100);
scene.add(sky);

sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 3;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);

// =========================================
// Fog
// =========================================
scene.fog = new THREE.FogExp2("#04343f", 0.1);

// =========================================
// Animate
// =========================================
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  if (camera.position.y < 2) {
    camera.position.y = 2;
  }

  // Ghost
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y =
    Math.sin(ghost1Angle) *
    Math.sin(ghost1Angle * 2.34) *
    Math.sin(ghost1Angle * 3.45);

  const ghost2Angle = -elapsedTime * 0.38;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y =
    Math.sin(ghost2Angle) *
    Math.sin(ghost2Angle * 2.34) *
    Math.sin(ghost2Angle * 3.45);

  const ghost3Angle = elapsedTime * 0.23;
  ghost3.position.x = Math.cos(ghost3Angle) * 7;
  ghost3.position.z = Math.sin(ghost3Angle) * 7;
  ghost3.position.y =
    Math.sin(ghost3Angle) *
    Math.sin(ghost3Angle * 2.34) *
    Math.sin(ghost3Angle * 3.45);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
