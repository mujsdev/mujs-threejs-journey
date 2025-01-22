import * as three from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// To understand the concept of PBR better (Physically Based Rendering)
// https://marmoset.co/posts/basic-theory-of-physically-based-rendering/
// https://marmoset.co/posts/physically-based-rendering-and-you-can-too/

// Textures
// In the latest version of threejs, we need to specify the SRGB colorSpace otherwise the image render will be in another color space format which won't look good
// The LoadingManager is helpful for knowing the loading progress of everything that's being rendered (textures in this case). We can use this to our advantage by showing a progress bar as that would be the progress that we would get from the loading manager and communicate it to the user
const loadingManager = new three.LoadingManager();
// loadingManager.onStart = () => {
//   console.log("onStart");
// };
// loadingManager.onLoad = () => {
//   console.log("onLoad");
// };
// loadingManager.onProgress = () => {
//   console.log("onProgress");
// };
// loadingManager.onError = () => {
//   console.log("onError");
// };
const textureLoader = new three.TextureLoader(loadingManager);
const colorTexture = textureLoader.load("/textures/minecraft.png");
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const heightTexture = textureLoader.load("/textures/door/height.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
colorTexture.colorSpace = three.SRGBColorSpace;

// Making transformations to the texture
// Repeating the texture on different x and y points
// Repeating them in a center manner horiz and vert
// Moving/Offsetting the textures a bit (left or right)
// Making a rotation in the texture (which is 1/4th - cuz Math.PI is 180deg which is half a full rotation. A full rotation is 360deg. So 1/4th (0.25) is 90deg)
// Updating the x and y, to center the rotation pivot point
// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;
// colorTexture.wrapS = three.MirroredRepeatWrapping;
// colorTexture.wrapT = three.MirroredRepeatWrapping;
// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;
// colorTexture.rotation = Math.PI * 0.25;
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;

// Filters and mipmappings
// The minFilter and magFilter are basically minification and magnifications
// Depending on what you need for your project, you can go with what you want accordingly. If you're going for a 8x8 and want it to be blurry then you want the pixels to look stretched. Otherwise, using the magFilter will make it look sharp (something similar you can do with the minecraft image to look sharp)
// NearestFilter is best for performance, better results, and better framerate
// If you're using the NearestFilter in the minFilter, then you can set the generateMipmaps to false to gain performance
colorTexture.generateMipmaps = false;
colorTexture.minFilter = three.NearestFilter;
colorTexture.magFilter = three.NearestFilter;

// Texture format and optimization
// Three things that matter for the format of the texture - weight, size, and the data
// 1. You wanna make sure the weight of the file is light/low. Use compression tools (if you want)
// 2. With sizes you need to make sure that not only the weight is light but the size of the texture itself is small too - for example - it can't be 1024 size which would probably be too big depending on the project. If you have that texture as something you're not going to see/use much then the size can be a lot smaller. This will help manage your GPU better so you need to make sure your GPU is happy as well
// 2. NOTE: Make sure that the texture size is divisble by 2. Because the mipmapping will try to divide the texture by half everytime until it gets to 1. And if it's not divisible by 2 and it lands on an odd number, the results will look weird and performance issues too
// 3. Sending the data of the texture is important because you wanna make sure its performant and looks good but depending on the project, you'd have to use different image formats - png, jpg or alpha
// WHERE TO FIND TEXTURES??
// poliigon.com
// 3dtextures.me
// arroway-textures.ch

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new three.Scene();

// Object
const geometry = new three.BoxGeometry(1, 1, 1);
const material = new three.MeshBasicMaterial({
  map: colorTexture,
  //   wireframe: true,
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
camera.position.set(1, 1, 1);
// camera.position.set(0, 0, 2);
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
