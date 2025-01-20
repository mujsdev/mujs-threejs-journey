import * as three from "three";

// This file introduces to the basics of three.js and how we create a scene, mesh, camera, and renders everything.

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new three.Scene();

// Object (Creating a red cube)
// A Mesh consists of 2 things: Geometry (shape) and Material (color, texture, pattern, etc)
// Currently, the material will look like a square instead of cube and that's because the camera aligns perfectly with the cube
// Setting the wireframe to true will show us the lines and give us the idea of the 3d object
const geometry = new three.BoxGeometry(1, 1, 1);
const material = new three.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const mesh = new three.Mesh(geometry, material);
scene.add(mesh);

// Position - This will move the red cube to bottom (y being -ve) right (x +ve) and a bit to the front (z +ve)
// Interesting note: the z position on the mesh vs camera function differently:
// The z on the camera will zoom out on the perspective and you'll see the cube smaller
// The z on the mesh will bring the cube further to the camera
// It feels like camera is moving backward since it's zooming out but in reality they both are moving forward. Camera is moving TOWARDS (forwards) us which means the cube gets smaller and cube is also moving forward to the camera (which is also moving towards us)
mesh.position.set(0.7, -0.6, 1);

// Scale - This will scale the object accordingly (stretches/shrinks depending on your preference) - default value is 1
mesh.scale.set(2, 0.5, 0.5);

// Rotation
// To achieve the output we want, we'll need to order them in the correct way as we intend the object to rotate. In this case we want Y, X and then Z
mesh.rotation.reorder("YXZ");
// This is half a rotation which is the perfect/good number for this (PI = 3.14)
mesh.rotation.set(Math.PI * 0.25, Math.PI * 0.25, 0);

// Axes helper - This will help add the axes points which will make development easier
const axesHelper = new three.AxesHelper(2);
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

// Before adding the below code, the camera was looking at the center of the scene
// But adding the lookAt to the mesh's position means that the camera will be focused on the center of the mesh instead
// So basically, if you comment out all the positions, scales, and rotation values of the mesh, you'll see the cube directly in the center
camera.lookAt(mesh.position);

// Renderer - This will render the canvas and set the size that we mentioned above
// This is ready to render any meshes we create
const renderer = new three.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

// This will render the scene with the camera
// We basically ask the renderer to take a picture of the scene from the camera POV
renderer.render(scene, camera);
