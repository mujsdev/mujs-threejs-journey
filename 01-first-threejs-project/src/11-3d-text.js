import * as three from "three";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import GUI from "lil-gui";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json";

// To get the 3d text effect, you'll need to make sure that the font is a "typeface" font. You can convert a font of your choice here https://gero3.github.io/facetype.js/. Or you can use the threejs example in the node_modules as well. Make sure you have the right to using the font if you have a font you're not supposed to use without buying it.
// Instead of calling it from the forbidden folder (node_modules) directly, just copy the font.json file and the license file and add it in the static folder. Much easier to access

// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new three.Scene();

// Axis helper
const axesHelper = new three.AxesHelper();
// scene.add(axesHelper);

// Textures
const textureLoader = new three.TextureLoader();
const matCapTexture = textureLoader.load("./textures/matcaps/4.png");
matCapTexture.colorSpace = three.SRGBColorSpace;

// Fonts
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("mujs.dev", {
    font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  // This is not a physical thing that you can see. It's invisible. You can't use it to create a mesh. It's just coordinates and math.
  textGeometry.computeBoundingBox();
  // console.log(textGeometry.boundingBox);
  // It's not exactly centered as we want it to. Although fixing it won't make a much of a difference but it's important to fix and know it. This isn't exactly centered because of the bevelThickness and bevelSize that's messing with the x, y, and z values. So once we subtract those extra values coming in from the bevel values, that would exactly center it.
  // textGeometry.translate(
  // -textGeometry.boundingBox.max.x * 0.5,
  // -textGeometry.boundingBox.max.y * 0.5,
  // -textGeometry.boundingBox.max.z * 0.5
  // );

  // The 0.02 and 0.03 values come from the bevelSize (0.02) and bevelThickness (0.03)
  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
  //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5
  // );

  // The MUCH SIMPLER way of doing this is centering it which Three.js supports lol
  textGeometry.center();

  const material = new three.MeshMatcapMaterial({ matcap: matCapTexture });

  const text = new three.Mesh(textGeometry, material);
  scene.add(text);

  // The console.time helps us understand how long it took for the code below to render. This will help you debug how to render faster
  // console.time("donuts");
  const donutGeometry = new three.TorusGeometry(0.3, 0.2, 20, 45);
  for (let i = 0; i < 300; i++) {
    const donut = new three.Mesh(donutGeometry, material);

    donut.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    scene.add(donut);
  }
  // console.timeEnd("donuts");
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
// Base camera
const camera = new three.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 3);
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
