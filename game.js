let scene, camera, renderer;
let keys = {};
let flashlight;
let flashlightOn = true;

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

  scene.background = new THREE.Color(0x030303);
  scene.fog = new THREE.Fog(0x030303, 2, 22);

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

  // Very weak room lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.08);
  scene.add(ambient);

  // FLASHLIGHT
  flashlight = new THREE.SpotLight(
    0xffffff,
    4,
    18,
    Math.PI / 7,
    0.5,
    1
  );

  flashlight.position.set(0, 1.55, 5);
  flashlight.target.position.set(0, 1.4, -5);

  camera.add(flashlight);
  camera.add(flashlight.target);

  scene.add(camera);

  // FLOOR
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({
      color: 0x292929
    })
  );

  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // WALLS
  createWall(0, 2, -8, 16, 4);
  createWall(-8, 2, 0, 4, 16);
  createWall(8, 2, 0, 4, 16);

  createWall(-6, 2, 8, 4, 4);
  createWall(6, 2, 8, 4, 4);

  // ROOM DIVIDERS
  createWall(-3, 2, 2, 0.5, 8);
  createWall(3, 2, -3, 0.5, 6);

  // FURNITURE
  createBox(0, 1, -4, 2, 1, 1, 0x222222);

  // EXIT DOOR
  createBox(0, 2, -7.8, 2, 4, 0.3, 0x080808);

  setupKeyboard();
  setupMobileControls();
  setupFlashlight();
}

function createWall(x, y, z, width, depth) {
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(width, 4, depth),
    new THREE.MeshStandardMaterial({
      color: 0x3b3b3b
    })
  );

  wall.position.set(x, y, z);
  scene.add(wall);
}

function createBox(x, y, z, width, height, depth, color) {
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({
      color: color
    })
  );

  box.position.set(x, y, z);
  scene.add(box);
}

function setupKeyboard() {
  window.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;

    if (e.key.toLowerCase() === "f") {
      toggleFlashlight();
    }
  });

  window.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
  });
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

function setupFlashlight() {
  const button = document.getElementById("flashlight");

  button.addEventListener("click", toggleFlashlight);
}

function toggleFlashlight() {
  flashlightOn = !flashlightOn;

  flashlight.intensity = flashlightOn ? 4 : 0;

  document.getElementById("flashlight").textContent =
    flashlightOn ? "🔦" : "🌑";
}

function animate() {
  requestAnimationFrame(animate);

  if (keys["w"]) camera.position.z -= speed;
  if (keys["s"]) camera.position.z += speed;
  if (keys["a"]) camera.position.x -= speed;
  if (keys["d"]) camera.position.x += speed;

  camera.position.x = Math.max(-7, Math.min(7, camera.position.x));
  camera.position.z = Math.max(-7, Math.min(7, camera.position.z));

  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  if (!camera || !renderer) return;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
});