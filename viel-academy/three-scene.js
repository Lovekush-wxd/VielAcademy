// VIEL ACADEMY - Full-Page Scroll-Driven 3D Interactive WebGL Universe
// Connects every section with dedicated 3D spatial zones and seamless camera navigation

(function () {
  // Check WebGL / Three.js
  if (typeof THREE === 'undefined') return;

  // Create or retrieve global fixed 3D container
  let container = document.getElementById('three-global-canvas-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'three-global-canvas-container';
    document.body.prepend(container);
  }

  // 1. SCENE & CAMERA
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x040817, 0.015);

  const camera = new THREE.PerspectiveCamera(
    48,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 8.5);

  // 2. RENDERER
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // 3. GLOBAL LIGHTING
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xfff8e7, 1.6);
  mainLight.position.set(6, 10, 8);
  scene.add(mainLight);

  // Cyan and Gold brand lights
  const cyanLight = new THREE.PointLight(0x00d2ff, 3.5, 30);
  cyanLight.position.set(-6, 2, 4);
  scene.add(cyanLight);

  const goldLight = new THREE.PointLight(0xffbe0b, 3.0, 30);
  goldLight.position.set(6, -8, 4);
  scene.add(goldLight);

  // Cursor following dynamic point light
  const mouseLight = new THREE.PointLight(0x00d2ff, 2.0, 15);
  mouseLight.position.set(0, 0, 5);
  scene.add(mouseLight);

  // Common shared materials
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xffbe0b,
    metalness: 0.85,
    roughness: 0.2
  });

  const cyanWireMaterial = new THREE.MeshBasicMaterial({
    color: 0x00d2ff,
    wireframe: true,
    transparent: true,
    opacity: 0.55
  });

  // =============================================================
  // ZONE 0: HERO 3D COMPLEX (Y = 0)
  // Books Stack, Graduation Cap, Pencils, Orbiting Torus Rings
  // =============================================================
  const zoneHero = new THREE.Group();
  zoneHero.position.set(window.innerWidth > 900 ? 2.2 : 0, 0, 0);
  scene.add(zoneHero);

  // Helper: Create 3D Book
  function createBook(width, height, depth, coverColor, pagesColor = 0xfffcf2) {
    const bookGroup = new THREE.Group();
    const coverMaterial = new THREE.MeshStandardMaterial({
      color: coverColor,
      roughness: 0.35,
      metalness: 0.2
    });
    const pagesMaterial = new THREE.MeshStandardMaterial({
      color: pagesColor,
      roughness: 0.9
    });

    const pagesGeo = new THREE.BoxGeometry(width - 0.1, height - 0.08, depth - 0.08);
    const pagesMesh = new THREE.Mesh(pagesGeo, pagesMaterial);
    pagesMesh.position.x = 0.05;
    bookGroup.add(pagesMesh);

    const coverGeo = new THREE.BoxGeometry(width, height, depth);
    const coverMesh = new THREE.Mesh(coverGeo, coverMaterial);
    bookGroup.add(coverMesh);

    const stripeGeo = new THREE.BoxGeometry(0.04, height * 0.9, depth + 0.02);
    const stripe = new THREE.Mesh(stripeGeo, goldMaterial);
    stripe.position.set(-width / 2, 0, 0);
    bookGroup.add(stripe);

    return bookGroup;
  }

  // Stack of 4 books matching logo
  const bookColors = [0xda2c38, 0x9ea9b1, 0x1d4ed8, 0x2a9d8f];
  const bookStack = new THREE.Group();
  bookColors.forEach((color, i) => {
    const b = createBook(2.4, 0.32, 1.8, color);
    b.position.y = i * 0.35 - 0.55;
    b.rotation.y = Math.sin(i * 1.5) * 0.15;
    bookStack.add(b);
  });
  zoneHero.add(bookStack);

  // Graduation Cap
  const capGroup = new THREE.Group();
  capGroup.position.set(0, 1.25, 0);
  const darkCapMat = new THREE.MeshStandardMaterial({ color: 0x111625, roughness: 0.4, metalness: 0.2 });
  const capBoard = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 1.6), darkCapMat);
  capBoard.rotation.y = Math.PI / 4;
  capGroup.add(capBoard);

  const skullMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.56, 0.4, 32), darkCapMat);
  skullMesh.position.y = -0.22;
  capGroup.add(skullMesh);

  const capButton = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16), goldMaterial);
  capButton.position.y = 0.04;
  capGroup.add(capButton);

  const tasselCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, 0.04, 0),
    new THREE.Vector3(0.5, 0.02, 0.5),
    new THREE.Vector3(0.9, -0.45, 0.6)
  );
  const tasselMesh = new THREE.Mesh(new THREE.TubeGeometry(tasselCurve, 20, 0.025, 8, false), goldMaterial);
  capGroup.add(tasselMesh);
  zoneHero.add(capGroup);

  // Pencils
  function createPencil(bodyColor) {
    const pencil = new THREE.Group();
    const bodyMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.6, 6), new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.5 }));
    pencil.add(bodyMesh);

    const tipMesh = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.4, 16), new THREE.MeshStandardMaterial({ color: 0xdeb887, roughness: 0.7 }));
    tipMesh.position.y = 1.0;
    pencil.add(tipMesh);

    const leadMesh = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.15, 16), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.2 }));
    leadMesh.position.y = 1.13;
    pencil.add(leadMesh);

    const ferruleMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.125, 0.18, 16), goldMaterial);
    ferruleMesh.position.y = -0.85;
    pencil.add(ferruleMesh);

    const eraserMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.25, 16), new THREE.MeshStandardMaterial({ color: 0xf28482 }));
    eraserMesh.position.y = -1.02;
    pencil.add(eraserMesh);
    return pencil;
  }

  const leftPencil = createPencil(0x2a9d8f);
  leftPencil.position.set(-2.0, 0.1, 0.5);
  leftPencil.rotation.set(0.4, 0.2, 0.6);
  zoneHero.add(leftPencil);

  const rightPencil = createPencil(0xf77f00);
  rightPencil.position.set(2.0, 0.2, 0.5);
  rightPencil.rotation.set(-0.3, -0.3, -0.65);
  zoneHero.add(rightPencil);

  // Gyro Torus Rings
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.9, 0.035, 16, 100), new THREE.MeshBasicMaterial({ color: 0x00d2ff, transparent: true, opacity: 0.6 }));
  ring1.rotation.x = Math.PI / 3;
  zoneHero.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.3, 0.025, 16, 100), new THREE.MeshBasicMaterial({ color: 0xffbe0b, transparent: true, opacity: 0.45 }));
  ring2.rotation.y = Math.PI / 4;
  ring2.rotation.x = -Math.PI / 6;
  zoneHero.add(ring2);

  // =============================================================
  // ZONE 1: ABOUT US 3D COMPLEX (Y = -14)
  // Rotating Viel Emblem Gimbal & Diploma Scroll
  // =============================================================
  const zoneAbout = new THREE.Group();
  zoneAbout.position.set(window.innerWidth > 900 ? -2.8 : 0, -14, 0);
  scene.add(zoneAbout);

  const gimbalGroup = new THREE.Group();
  const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.05, 16, 80), goldMaterial);
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.04, 16, 80), new THREE.MeshStandardMaterial({ color: 0x00d2ff, metalness: 0.8, roughness: 0.2 }));
  const ringC = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.03, 16, 80), goldMaterial);
  gimbalGroup.add(ringA);
  gimbalGroup.add(ringB);
  gimbalGroup.add(ringC);

  // Inscribed golden star emblem
  const starEmblem = new THREE.Mesh(new THREE.OctahedronGeometry(0.7, 0), goldMaterial);
  gimbalGroup.add(starEmblem);
  zoneAbout.add(gimbalGroup);

  // Floating Diploma Scroll
  const scrollGroup = new THREE.Group();
  scrollGroup.position.set(1.8, -1.0, 0.5);
  const scrollCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 1.8, 24),
    new THREE.MeshStandardMaterial({ color: 0xfdfaf0, roughness: 0.8 })
  );
  scrollCylinder.rotation.z = Math.PI / 3;
  scrollGroup.add(scrollCylinder);

  const scrollRibbon = new THREE.Mesh(
    new THREE.CylinderGeometry(0.21, 0.21, 0.25, 24),
    new THREE.MeshStandardMaterial({ color: 0xda2c38, roughness: 0.4 })
  );
  scrollRibbon.rotation.z = Math.PI / 3;
  scrollGroup.add(scrollRibbon);
  zoneAbout.add(scrollGroup);

  // =============================================================
  // ZONE 2: COURSES & ACADEMIC STREAMS (Y = -28)
  // 3D Atom (Science), 3D Chart & Polyhedron (Commerce), 3D Column (Arts)
  // =============================================================
  const zoneCourses = new THREE.Group();
  zoneCourses.position.set(0, -28, 0);
  scene.add(zoneCourses);

  // 1. Science 3D Atom
  const atomGroup = new THREE.Group();
  atomGroup.position.set(-3.2, 1.2, 0);
  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x00d2ff, roughness: 0.2, metalness: 0.9 })
  );
  atomGroup.add(nucleus);

  const electronMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const orbitMat = new THREE.MeshBasicMaterial({ color: 0x00d2ff, transparent: true, opacity: 0.45 });

  for (let o = 0; o < 3; o++) {
    const orbitRing = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.02, 16, 64), orbitMat);
    orbitRing.rotation.x = (Math.PI / 3) * o;
    orbitRing.rotation.y = (Math.PI / 4) * o;
    atomGroup.add(orbitRing);

    const electron = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), electronMat);
    electron.position.set(Math.cos(o) * 1.3, Math.sin(o) * 1.3, 0);
    atomGroup.add(electron);
  }
  zoneCourses.add(atomGroup);

  // 2. Commerce 3D Financial Polyhedron & Bars
  const commerceGroup = new THREE.Group();
  commerceGroup.position.set(3.2, 1.0, 0);
  const polyMesh = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.65, 0),
    goldMaterial
  );
  commerceGroup.add(polyMesh);

  // Rising 3D bars
  const barHeights = [0.6, 1.0, 1.5, 2.0];
  barHeights.forEach((h, i) => {
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, h, 0.2),
      new THREE.MeshStandardMaterial({
        color: i === 3 ? 0x00d2ff : 0xffbe0b,
        metalness: 0.5,
        roughness: 0.3,
        transparent: true,
        opacity: 0.85
      })
    );
    bar.position.set(-0.5 + i * 0.35, -1.0 + h / 2, 0);
    commerceGroup.add(bar);
  });
  zoneCourses.add(commerceGroup);

  // 3. Competitive Exams Golden Trophy
  const trophyGroup = new THREE.Group();
  trophyGroup.position.set(0, -2.0, -1);
  const cupMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.2, 0.9, 24),
    goldMaterial
  );
  trophyGroup.add(cupMesh);
  const cupStem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 16), goldMaterial);
  cupStem.position.y = -0.65;
  trophyGroup.add(cupStem);
  const cupBase = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 0.2, 24), darkCapMat);
  cupBase.position.y = -0.95;
  trophyGroup.add(cupBase);
  zoneCourses.add(trophyGroup);

  // =============================================================
  // ZONE 3: STUDY PORTAL & VIDEO VAULT (Y = -42)
  // Holographic Floating Tablets & Rotating Video Prism
  // =============================================================
  const zonePortal = new THREE.Group();
  zonePortal.position.set(window.innerWidth > 900 ? 3.0 : 0, -42, 0);
  scene.add(zonePortal);

  // Video Play Prism
  const prismGeo = new THREE.ConeGeometry(0.8, 1.4, 3);
  const prismMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    metalness: 0.6,
    roughness: 0.2
  });
  const playPrism = new THREE.Mesh(prismGeo, prismMat);
  playPrism.rotation.z = -Math.PI / 2;
  zonePortal.add(playPrism);

  // Floating Cyber Document Plates
  for (let p = 0; p < 3; p++) {
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 2.2, 0.03),
      new THREE.MeshStandardMaterial({
        color: 0x00d2ff,
        transparent: true,
        opacity: 0.25,
        wireframe: true
      })
    );
    plate.position.set(-1.8 + p * 0.5, -0.5 + p * 0.4, -0.5 - p * 0.4);
    plate.rotation.y = 0.4;
    plate.rotation.x = 0.2;
    zonePortal.add(plate);
  }

  // =============================================================
  // ZONE 4: GEMINI AI STUDY BUDDY SECTION (Y = -56)
  // Dual Wireframe Pulsing AI Core with Neural Synapses
  // =============================================================
  const zoneGemini = new THREE.Group();
  zoneGemini.position.set(0, -56, 0);
  scene.add(zoneGemini);

  // Outer Icosahedron (Cyan)
  const outerIso = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.0, 1),
    cyanWireMaterial
  );
  zoneGemini.add(outerIso);

  // Inner Dodecahedron (Gold)
  const innerDodec = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.3, 0),
    new THREE.MeshBasicMaterial({ color: 0xffbe0b, wireframe: true, transparent: true, opacity: 0.6 })
  );
  zoneGemini.add(innerDodec);

  // Pulsing central energy sphere
  const aiCoreSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 32, 32),
    new THREE.MeshStandardMaterial({
      color: 0x00d2ff,
      emissive: 0x005588,
      roughness: 0.1,
      metalness: 0.9
    })
  );
  zoneGemini.add(aiCoreSphere);

  // Orbiting neural synapse nodes
  const synapseGroup = new THREE.Group();
  for (let s = 0; s < 12; s++) {
    const node = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 16),
      new THREE.MeshBasicMaterial({ color: s % 2 === 0 ? 0xffbe0b : 0x00d2ff })
    );
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 2.4;
    node.position.x = r * Math.sin(phi) * Math.cos(theta);
    node.position.y = r * Math.sin(phi) * Math.sin(theta);
    node.position.z = r * Math.cos(phi);
    synapseGroup.add(node);
  }
  zoneGemini.add(synapseGroup);

  // =============================================================
  // ZONE 5: CAMPUS & CONTACT (Y = -70)
  // Holographic Wireframe Globe & Beacon Location Radar
  // =============================================================
  const zoneContact = new THREE.Group();
  zoneContact.position.set(window.innerWidth > 900 ? -2.6 : 0, -70, 0);
  scene.add(zoneContact);

  const globeMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1.8, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0x00d2ff, wireframe: true, transparent: true, opacity: 0.35 })
  );
  zoneContact.add(globeMesh);

  // Delhi Beacon Pin
  const beaconPin = new THREE.Mesh(
    new THREE.ConeGeometry(0.18, 0.8, 16),
    new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.7 })
  );
  beaconPin.position.set(0.7, 1.3, 1.2);
  beaconPin.rotation.x = -Math.PI / 4;
  zoneContact.add(beaconPin);

  // Radar wave rings
  const radarRings = [];
  for (let r = 0; r < 3; r++) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.2, 0.28, 32),
      new THREE.MeshBasicMaterial({ color: 0x00d2ff, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
    );
    ring.position.set(0.7, 1.7, 1.2);
    ring.rotation.x = Math.PI / 2;
    zoneContact.add(ring);
    radarRings.push(ring);
  }

  // =============================================================
  // GLOBAL COSMIC STARFIELD & GALAXY PARTICLES
  // Spanning from Y = +8 to Y = -78
  // =============================================================
  const starCount = 850;
  const starGeo = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  const starPalette = [
    new THREE.Color(0x00d2ff),
    new THREE.Color(0xffbe0b),
    new THREE.Color(0xffffff),
    new THREE.Color(0x38bdf8),
    new THREE.Color(0xa855f7)
  ];

  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 22;
    starPositions[i * 3 + 1] = 8 - Math.random() * 86; // Distributed along the whole scroll length
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 14;

    const c = starPalette[Math.floor(Math.random() * starPalette.length)];
    starColors[i * 3] = c.r;
    starColors[i * 3 + 1] = c.g;
    starColors[i * 3 + 2] = c.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMaterial = new THREE.PointsMaterial({
    size: 0.14,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });

  const starField = new THREE.Points(starGeo, starMaterial);
  scene.add(starField);

  // =============================================================
  // SCROLL & MOUSE INTERACTION TRACKING
  // =============================================================
  let mouseX = 0;
  let mouseY = 0;
  let targetCamX = 0;
  let targetCamY = 0;
  let targetCamZ = 8.5;
  let currentScrollProgress = 0;

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouseX = x;
    mouseY = y;

    mouseLight.position.x = x * 6;
    mouseLight.position.y = camera.position.y + y * 4;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const t = e.touches[0];
      mouseX = (t.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(t.clientY / window.innerHeight) * 2 + 1;
    }
  }, { passive: true });

  function calculateScroll() {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    currentScrollProgress = scrollMax > 0 ? Math.max(0, Math.min(1, window.scrollY / scrollMax)) : 0;
  }

  window.addEventListener('scroll', calculateScroll, { passive: true });
  calculateScroll();

  // Burst effect triggerable by user
  window.trigger3DParticleBurst = function () {
    starMaterial.size = 0.35;
    goldLight.intensity = 6;
    cyanLight.intensity = 7;
    setTimeout(() => {
      starMaterial.size = 0.14;
      goldLight.intensity = 3.0;
      cyanLight.intensity = 3.5;
    }, 600);
  };

  // =============================================================
  // 60FPS ANIMATION LOOP
  // =============================================================
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // 1. Camera glides along the vertical 3D spine based on scroll
    const targetY = -currentScrollProgress * 70;
    targetCamY += (targetY - targetCamY) * 0.08;
    targetCamX += (mouseX * 1.5 - targetCamX) * 0.05;
    targetCamZ += ((8.5 + Math.sin(currentScrollProgress * Math.PI * 4) * 0.8) - targetCamZ) * 0.05;

    camera.position.y = targetCamY;
    camera.position.x = targetCamX;
    camera.position.z = targetCamZ;
    camera.rotation.y = -targetCamX * 0.04;
    camera.rotation.x = mouseY * 0.03;

    // 2. Zone 0 (Hero) Animations
    zoneHero.position.y = Math.sin(t * 1.6) * 0.15;
    capGroup.position.y = 1.25 + Math.sin(t * 2.2) * 0.08;
    capGroup.rotation.y = Math.sin(t * 0.8) * 0.15;
    ring1.rotation.z = t * 0.35;
    ring2.rotation.z = -t * 0.25;
    leftPencil.rotation.z = 0.6 + Math.sin(t * 1.8) * 0.08;
    rightPencil.rotation.z = -0.65 + Math.cos(t * 1.8) * 0.08;

    // 3. Zone 1 (About Us)
    ringA.rotation.x = t * 0.6;
    ringB.rotation.y = -t * 0.5;
    ringC.rotation.z = t * 0.7;
    starEmblem.rotation.y = t * 0.9;
    scrollGroup.position.y = -1.0 + Math.sin(t * 1.5) * 0.12;

    // 4. Zone 2 (Courses)
    atomGroup.rotation.y = t * 0.8;
    atomGroup.rotation.x = t * 0.4;
    commerceGroup.rotation.y = -t * 0.5;
    polyMesh.rotation.x = t * 0.6;
    polyMesh.rotation.y = t * 0.8;
    trophyGroup.rotation.y = Math.sin(t * 1.2) * 0.3;

    // 5. Zone 3 (Portal)
    playPrism.rotation.y = t * 1.2;
    playPrism.position.y = Math.sin(t * 2.0) * 0.15;

    // 6. Zone 4 (Gemini AI Core)
    outerIso.rotation.x = t * 0.5;
    outerIso.rotation.y = t * 0.7;
    innerDodec.rotation.x = -t * 0.6;
    innerDodec.rotation.y = -t * 0.4;
    synapseGroup.rotation.z = t * 0.3;
    const pulseScale = 1.0 + Math.sin(t * 3.5) * 0.12;
    aiCoreSphere.scale.set(pulseScale, pulseScale, pulseScale);

    // 7. Zone 5 (Contact)
    globeMesh.rotation.y = t * 0.25;
    radarRings.forEach((r, idx) => {
      const scale = ((t * 1.5 + idx * 0.7) % 2.5) + 0.2;
      r.scale.set(scale, scale, 1);
      r.material.opacity = Math.max(0, 1 - scale / 2.5);
    });

    // 8. Global Starfield Galaxy drift
    starField.rotation.y = t * 0.02;
    starField.rotation.x = Math.sin(t * 0.015) * 0.05;

    renderer.render(scene, camera);
  }

  animate();

  // Responsive resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Reposition lateral groups on resize
    zoneHero.position.x = window.innerWidth > 900 ? 2.2 : 0;
    zoneAbout.position.x = window.innerWidth > 900 ? -2.8 : 0;
    zonePortal.position.x = window.innerWidth > 900 ? 3.0 : 0;
    zoneContact.position.x = window.innerWidth > 900 ? -2.6 : 0;
  });

})();
