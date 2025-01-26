import * as THREE from "three";

export const canvas = document.querySelector("canvas.webgl");
export const scene = new THREE.Scene();
export const textureLoader = new THREE.TextureLoader();

export const wallDimension = {
  width: 3,
  height: 2.5,
  depth: 4,
};

export const roofDimension = {
  radius: 3.5,
  height: 1.5,
  radialSegments: 4,
};

export const doorDimension = {
  width: 2.2,
  height: 2.2,
};

export const graveDimension = {
  width: 0.6,
  height: 0.8,
  depth: 0.2,
};
