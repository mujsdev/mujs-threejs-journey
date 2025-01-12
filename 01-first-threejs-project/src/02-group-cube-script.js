import * as three from "three";

// This file will focus on creating a group which will makes things easier when you have a complex scene and want to move, scale, rotate things around.

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new three.Scene();

// Objects (group)
// The great thing with groups is that instead of manually moving each object till you get it right, it's much better to have them in the entire group and move them together, scale, rotate, whatever you want and that makes things easier
const group = new three.Group();
group.position.set(0, 1, 0);
group.scale.set(1, 2, 1);
group.rotation.set(0, 1, 0);
scene.add(group);

const cube1 = new three.Mesh(
  new three.BoxGeometry(1, 1, 1),
  new three.MeshBasicMaterial({ color: 0xff0000, wireframe: false })
);
group.add(cube1);

const cube2 = new three.Mesh(
  new three.BoxGeometry(1, 1, 1),
  new three.MeshBasicMaterial({ color: 0x00ff00, wireframe: false })
);
cube2.position.set(-1, 0, 0);
group.add(cube2);

const cube3 = new three.Mesh(
  new three.BoxGeometry(1, 1, 1),
  new three.MeshBasicMaterial({ color: 0x0000ff, wireframe: false })
);
cube3.position.set(1, 0, 0);
group.add(cube3);

// Axes helper - This will help add the axes points which will make development easier
const axesHelper = new three.AxesHelper();
scene.add(axesHelper);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera - To add the perspective camera so we can zoom in/out to see the object in different views
// Having the camera position z change would actually show the red cube and that can't be done until you position elements differently
// In this case, we want the z to move backwards which means the camera will move backwards and that's how we'll see the cube
// If z is a positive value, it'll move backward. The higher the number, it'll move even further away (zoom out effect in a way)
const camera = new three.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 0, 3);
scene.add(camera);

// Renderer - This will render the canvas and set the size that we mentioned above
// This is ready to render any meshes we create
const renderer = new three.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

// This will render the scene with the camera
// We basically ask the renderer to take a picture of the scene from the camera POV
renderer.render(scene, camera);
