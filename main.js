import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const width = 128;
const height = 128;
const depth = 128;

// Generate texture data with a specific color
const generateSpecificColorTextureData = () => {
  const size = width * height;
  const textureData = new Uint8Array(4 * size * depth);

  // Convert the specific color to RGB components
  const specificColor = new THREE.Color(0xff6347);
  const [r, g, b] = specificColor
    .toArray()
    .map((value) => Math.floor(value * 255));

  for (let i = 0; i < depth; i++) {
    for (let j = 0; j < size; j++) {
      const stride = (i * size + j) * 4;
      textureData[stride] = r;
      textureData[stride + 1] = g;
      textureData[stride + 2] = b;
      textureData[stride + 3] = 255;
    }
  }

  return textureData;
};

// Create a DataArrayTexture with the specific color
const textureData = generateSpecificColorTextureData();
const texture = new THREE.DataArrayTexture(textureData, width, height, depth);
texture.needsUpdate = true;

window.sphere = function () {
  //  input values
  const x = document.getElementById("x").value;
  const y = document.getElementById("y").value;
  const z = document.getElementById("z").value;
  const fileinput = document.getElementById("fileInput");

  // Set up scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGL1Renderer({
    canvas: document.querySelector("#bg"),
  });

  // Set renderer properties
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth * 0.98, window.innerHeight);
  renderer.setClearColor(0xffffff);
  camera.position.setZ(30);

  // Create sphere
  const geometry = new THREE.SphereGeometry(5);
  const material = new THREE.MeshStandardMaterial({
    color: 0xff6347,
    emissive: 0xff6347,
    map: texture,
  });
  const Sphere = new THREE.Mesh(geometry, material);
  Sphere.position.set(x / 2, y / 2, z / 2);
  scene.add(Sphere);

  // Create slices along x, y, and z directions passing through the point
  const sliceGeometry = new THREE.PlaneGeometry(10, 10);
  const sliceMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
  });

  const createSlice = (rotation, position) => {
    const slice = new THREE.Mesh(sliceGeometry, sliceMaterial);
    slice.rotation.copy(rotation);
    slice.position.set(x / 2, y / 2, z / 2).add(position);
    scene.add(slice);
    return slice;
  };

  const sliceX = createSlice(
    new THREE.Euler(0, Math.PI / 2, 0),
    new THREE.Vector3()
  );
  const sliceY = createSlice(
    new THREE.Euler(Math.PI / 2, 0, 0),
    new THREE.Vector3()
  );
  const sliceZ = createSlice(new THREE.Euler(0, 0, 0), new THREE.Vector3());

  // Apply texture to slices
  sliceX.material.map = texture;
  sliceY.material.map = texture;
  sliceZ.material.map = texture;

  // Lights
  const pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(pointLight, ambientLight);

  // Create ground
  const groundGeometry = new THREE.PlaneGeometry(100, 100);
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xfffff });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -5;
  scene.add(ground);

  // Orbit controls and axes helper
  const controller = new OrbitControls(camera, renderer.domElement);
  const axesHelper = new THREE.AxesHelper(20);
  scene.add(axesHelper);

  // Animation
  const animation = () => {
    requestAnimationFrame(animation);
    Sphere.rotation.x += 0.01;
    Sphere.rotation.y += 0.005;
    Sphere.rotation.z += 0.01;
    controller.update();
    renderer.render(scene, camera);
  };

  animation();
};
