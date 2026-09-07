let scene, camera, renderer;
let keys = {};

let flashlight;
let flashlightTarget;

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

  scene.background = new THREE.Color(0x010101);
  scene.fog = new THREE.Fog(0x010101, 1, 20);

  // CAMERA
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  camera.position.set(0, 1.6, 5);

  // RENDERER
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
  );

  document.body.appendChild(renderer.domElement);

  // VERY SMALL AMBIENT LIGHT
  const ambient = new THREE.AmbientLight(
    0xffffff,
    0.25
  );

  scene.add(ambient);

  // =========================
  // FLASHLIGHT
  // =========================

  flashlight = new THREE.SpotLight(
    0xffffff,
    15,
    25,
    Math.PI / 7,
    0.35,
    1
  );

  flashlight.position.copy(camera.position);

  flashlightTarget = new THREE.Object3D();

  scene.add(flashlight);
  scene.add(flashlightTarget);

  flashlight.target = flashlightTarget;

  // =========================
  // FLOOR
  // =========================

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({
      color: 0x303030
    })
  );

  floor.rotation.x = -Math.PI / 2;

  scene.add(floor);

  // =========================
  // HOUSE
  // =========================

  createWall(0, 2, -8, 16, 4);
  createWall(-8, 2, 0, 4, 16);
  createWall(8, 2, 0, 4, 16);

  createWall(-6, 2, 8, 4, 4);
  createWall(6, 2, 8, 4, 4);

  // INSIDE WALLS
  createWall(-3, 2, 2, 0.5, 8);
  createWall(3, 2, -3, 0.5, 6);

  // TABLE
  createBox(
    0,
    1,
    -4,
    2,
    1,
    1,
    0x222222
  );

  // EXIT DOOR
  createBox(
    0,
    2,
    -7.8,
    2,
    4,
    0.3,
    0x080808
  );

  setupKeyboard();
  setupMobileControls();
  setupFlashlight();

  document.getElementById(
    "message"
  ).textContent = "Find a way out...";
}


// =========================
// WALL
// =========================

function createWall(
  x,
  y,
  z,
  width,
  depth
) {

  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(
      width,
      4,
      depth
    ),

    new THREE.MeshStandardMaterial({
      color: 0x444444
    })
  );

  wall.position.set(x, y, z);

  scene.add(wall);
}


// =========================
// OBJECT
// =========================

function createBox(
  x,
  y,
  z,
  width,
  height,
  depth,
  color
) {

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(
      width,
      height,
      depth
    ),

    new THREE.MeshStandardMaterial({
      color: color
    })
  );

  box.position.set(x, y, z);

  scene.add(box);
}


// =========================
// KEYBOARD
// =========================

function setupKeyboard() {

  window.addEventListener(
    "keydown",
    function(e) {

      keys[e.key.toLowerCase()] = true;

      if (
        e.key.toLowerCase() === "f"
      ) {
        toggleFlashlight();
      }

    }
  );

  window.addEventListener(
    "keyup",
    function(e) {

      keys[e.key.toLowerCase()] = false;

    }
  );
}


// =========================
// MOBILE CONTROLS
// =========================

function setupMobileControls() {

  const buttons = {
    up: "w",
    down: "s",
    left: "a",
    right: "d"
  };

  for (const id in buttons) {

    const button =
      document.getElementById(id);

    const key = buttons[id];

    button.addEventListener(
      "touchstart",
      function(e) {

        e.preventDefault();

        keys[key] = true;

      }
    );

    button.addEventListener(
      "touchend",
      function(e) {

        e.preventDefault();

        keys[key] = false;

      }
    );

  }
}


// =========================
// FLASHLIGHT BUTTON
// =========================

function setupFlashlight() {

  const button =
    document.getElementById(
      "flashlight"
    );

  if (!button) return;

  button.addEventListener(
    "click",
    toggleFlashlight
  );
}


function toggleFlashlight() {

  if (!flashlight) return;

  if (flashlight.intensity > 0) {

    flashlight.intensity = 0;

    document.getElementById(
      "flashlight"
    ).textContent = "🌑";

  } else {

    flashlight.intensity = 15;

    document.getElementById(
      "flashlight"
    ).textContent = "🔦";

  }
}


// =========================
// GAME LOOP
// =========================

function animate() {

  requestAnimationFrame(animate);

  // MOVEMENT
  if (keys["w"]) {
    camera.position.z -= speed;
  }

  if (keys["s"]) {
    camera.position.z += speed;
  }

  if (keys["a"]) {
    camera.position.x -= speed;
  }

  if (keys["d"]) {
    camera.position.x += speed;
  }

  // HOUSE BOUNDARIES
  camera.position.x =
    Math.max(
      -7,
      Math.min(7, camera.position.x)
    );

  camera.position.z =
    Math.max(
      -7,
      Math.min(7, camera.position.z)
    );


  // =========================
  // UPDATE FLASHLIGHT DIRECTION
  // =========================

  const direction =
    new THREE.Vector3();

  camera.getWorldDirection(
    direction
  );

  flashlight.position.copy(
    camera.position
  );

  flashlightTarget.position.copy(
    camera.position
  );

  flashlightTarget.position.add(
    direction.multiplyScalar(15)
  );


  renderer.render(
    scene,
    camera
  );
}


// =========================
// RESIZE
// =========================

window.addEventListener(
  "resize",
  function() {

    if (!camera || !renderer) return;

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);