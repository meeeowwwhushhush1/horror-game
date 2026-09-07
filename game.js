let scene, camera, renderer;
let player;
let keys = {};

const speed = 0.08;

document.getElementById("start").onclick = startGame;

function startGame() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("gameUI").style.display = "block";

  createGame();
  animate();
}

function createGame() {

  scene = new THREE.Scene();

  scene.background = new THREE.Color(0x050505);
  scene.fog = new THREE.Fog(0x050505, 2, 25);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  camera.position.set(0, 1.6, 5);

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  document.body.appendChild(renderer.domElement);

  // LIGHT
  const ambient = new THREE.AmbientLight(0xffffff, 0.25);
  scene.add(ambient);

  const light = new THREE.PointLight(0xffffff, 2, 12);
  light.position.set(0, 3, 3);
  scene.add(light);

  // FLOOR
  const floorGeometry = new THREE.PlaneGeometry(30, 30);

  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333
  });

  const floor = new THREE.Mesh(
    floorGeometry,
    floorMaterial
  );

  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // WALL MATERIAL
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x444444
  });

  // BACK WALL
  createWall(0, 2, -8, 16, 4);

  // LEFT WALL
  createWall(-8, 2, 0, 4, 16);

  // RIGHT WALL
  createWall(8, 2, 0, 4, 16);

  // FRONT WALL WITH OPENING
  createWall(-6, 2, 8, 4, 4);
  createWall(6, 2, 8, 4, 4);

  // ROOM DIVIDERS
  createWall(-3, 2, 2, 0.5, 8);
  createWall(3, 2, -3, 0.5, 6);

  // TABLE
  createBox(0, 1, -4, 2, 1, 1, 0x292929);

  // EXIT DOOR
  createBox(0, 2, -7.8, 2, 4, 0.3, 0x111111);

  player = camera;

  window.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
  });

  window.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
  });

  setupMobileControls();
}

function createWall(x, y, z, width, depth) {

  const geometry = new THREE.BoxGeometry(
    width,
    4,
    depth
  );

  const material = new THREE.MeshStandardMaterial({
    color: 0x444444
  });

  const wall = new THREE.Mesh(
    geometry,
    material
  );

  wall.position.set(x, y, z);

  scene.add(wall);
}

function createBox(x, y, z, width, height, depth, color) {

  const geometry = new THREE.BoxGeometry(
    width,
    height,
    depth
  );

  const material = new THREE.MeshStandardMaterial({
    color: color
  });

  const box = new THREE.Mesh(
    geometry,
    material
  );

  box.position.set(x, y, z);

  scene.add(box);
}

function setupMobileControls() {

  const buttons = {
    up: "w",
    down: "s",
    left: "a",
    right: "d"
  };

  for (const id in buttons) {

    const button = document.getElementById(id);
    const key = buttons[id];

    button.addEventListener("touchstart", e => {
      e.preventDefault();
      keys[key] = true;
    });

    button.addEventListener("touchend", e => {
      e.preventDefault();
      keys[key] = false;
    });
  }
}

function animate() {

  requestAnimationFrame(animate);

  if (keys["w"]) camera.position.z -= speed;
  if (keys["s"]) camera.position.z += speed;
  if (keys["a"]) camera.position.x -= speed;
  if (keys["d"]) camera.position.x += speed;

  // Keep player inside house
  camera.position.x = Math.max(-7, Math.min(7, camera.position.x));
  camera.position.z = Math.max(-7, Math.min(7, camera.position.z));

  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {

  if (!camera || !renderer) return;

  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
});