import * as three from "three";

import GUI from "lil-gui";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";

// Debug
// Note: As you progress in the threejs journey, feel free to add debug properties during your progress. It's possible that you may find better values than what you had before and you could use that instead. Don't wait till the end to then add the debug props. Chances are that you might not even get to it when you're too deep in
const gui = new GUI({
  width: 340,
  title: "Debug UI",
  // closeFolders: true,
});
// gui.close();
// gui.hide();

window.addEventListener("keydown", (event) => {
  // Neat trick if you wanna hide the gui debug by pressing the "h" key
  // You can bring it back up by pressing the same key again
  if (event.key == "h") {
    gui.show(gui._hidden);
  }
});

const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new three.Scene();

// Object
debugObject.color = "#fad161";
debugObject.spin = () => {
  // Math.PI * 2 is a full circle rotation
  gsap.to(mesh.rotation, {
    duration: 2,
    ease: "circ.inOut",
    y: mesh.rotation.y + Math.PI * 2,
  });
};
debugObject.subdivision = 2;

const geometry = new three.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new three.MeshBasicMaterial({
  color: debugObject.color,
  wireframe: true,
});
const mesh = new three.Mesh(geometry, material);
scene.add(mesh);

// Creating a cube debug folder so we can organize all the debug properties in on section (folder). We can nest folders in folders too
// We can also close that folder by default if we want
const cubeDebug = gui.addFolder("Cube");
// cubeDebug.close();
// Adding the debug property to mesh's elevation (y position)
cubeDebug.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");
// Adding the debug to see if the mesh is visible (checkbox boolean)
// This is helpful when you wanna check the visibility of different elements and see which element is heavier to load
cubeDebug.add(mesh, "visible");
// Adding the debug property to check for the wireframe of the material
cubeDebug.add(material, "wireframe").name("x-ray mode");
// Adding the debug property to change the color of the cube
// You can't do just "add". You'll have to be specific otherwise it can't detect
// Now, when you make the change of the color, it's not going to give you the same color you'd expect. So, the solution is to create a debug color object globally and then everytime there's a change in the color, we call the set method in the material.color object to make that change which will return the same value on the FE. We don't care what happens behind the scenes but it happens and threejs takes care of color management while the hex code remains unchanged on the client side
cubeDebug.addColor(debugObject, "color").onChange(() => {
  material.color.set(debugObject.color);
});
// We add a button in the debug object to perform a spin on the cube
cubeDebug.add(debugObject, "spin").name("spinny spin the cube");
// Adding the debug property to change the subdivisions of the cube: widthSegments, heightSegments, depthSegments
// When we add a new BoxGeometry, the old geometries are still sitting somewhere in the GPU memory which can create a memory leak. To prevent that, first make sure to dispose of the old geometry. This is very important for performance
cubeDebug
  .add(debugObject, "subdivision")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    mesh.geometry.dispose();
    mesh.geometry = new three.BoxGeometry(
      1,
      1,
      1,
      debugObject.subdivision,
      debugObject.subdivision,
      debugObject.subdivision
    );
  });

// Size
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
