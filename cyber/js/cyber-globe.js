/**
 * 3D Rotating Cyber Threat Intelligence Globe in Three.js
 * Enhanced with animated telemetry packets, traveling particles along Bezier arcs,
 * smooth damped rotation, touch gestures, and graceful WebGL fallbacks.
 * Explicitly labeled as simulation mode: educational telemetry data.
 */

class CyberThreatGlobe {
  constructor(containerId = "threejs-cyber-globe-container") {
    this.container = document.getElementById(containerId);
    this.isInitialized = false;
    this.autoRotate = true;
    this.showRings = true;
    this.arcCurves = [];
    this.particlesGroup = null;
  }

  init() {
    if (!this.container) return;

    if (typeof THREE === "undefined") {
      this.renderFallback("Three.js 3D library not detected. Switched to fallback radar.");
      return;
    }

    const container = this.container;
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;

    // 1. Scene, Camera, and WebGL Renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.z = 210;

    try {
      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
    } catch (e) {
      console.warn("WebGL not supported or disabled.", e);
      this.renderFallback("WebGL hardware acceleration is unavailable on this device.");
      return;
    }

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    container.innerHTML = "";
    container.appendChild(this.renderer.domElement);

    // 2. Master Globe Group
    this.globeGroup = new THREE.Group();
    this.scene.add(this.globeGroup);

    const GLOBE_RADIUS = 70;
    this.GLOBE_RADIUS = GLOBE_RADIUS;

    // 3. Wireframe Grid Sphere
    const sphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 36, 24);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4, // Cyan
      wireframe: true,
      transparent: true,
      opacity: 0.14
    });
    this.wireframeSphere = new THREE.Mesh(sphereGeo, wireframeMat);
    this.globeGroup.add(this.wireframeSphere);

    // 4. Inner Dark Atmospheric Core Sphere
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x071510, // Dark forest / obsidian green
      transparent: true,
      opacity: 0.90
    });
    this.coreSphere = new THREE.Mesh(
      new THREE.SphereGeometry(GLOBE_RADIUS * 0.98, 32, 24),
      coreMat
    );
    this.globeGroup.add(this.coreSphere);

    // 5. Cyber Data Nodes Point Cloud on Globe Surface (Fibonacci Distribution)
    const pointCount = 1400;
    const positions = new Float32Array(pointCount * 3);
    const colors = new Float32Array(pointCount * 3);
    const primaryColor = new THREE.Color(0x00ff66); // Neon lime
    const secondaryColor = new THREE.Color(0x06b6d4); // Cyan
    const mutedColor = new THREE.Color(0x104a30); // Deep forest green

    for (let i = 0; i < pointCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / pointCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

      const x = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
      const y = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);
      const z = GLOBE_RADIUS * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      let chosenCol;
      const rand = Math.random();
      if (rand > 0.85) {
        chosenCol = primaryColor;
      } else if (rand > 0.65) {
        chosenCol = secondaryColor;
      } else {
        chosenCol = mutedColor;
      }

      colors[i * 3] = chosenCol.r;
      colors[i * 3 + 1] = chosenCol.g;
      colors[i * 3 + 2] = chosenCol.b;
    }

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    this.pointsMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    this.pointCloud = new THREE.Points(pointsGeo, this.pointsMat);
    this.globeGroup.add(this.pointCloud);

    // 6. Outer Orbital Defense Rings
    this.ringsGroup = new THREE.Group();
    this.globeGroup.add(this.ringsGroup);

    this.ring1 = this.createOrbitalRing(GLOBE_RADIUS * 1.25, 0x00ff66, 1.2, 0.4, 0.002);
    this.ring2 = this.createOrbitalRing(GLOBE_RADIUS * 1.38, 0x06b6d4, -0.9, 0.8, -0.003);

    // 7. Active Cyber Telemetry Arcs & Traveling Particle Packets
    this.arcsGroup = new THREE.Group();
    this.globeGroup.add(this.arcsGroup);

    this.particlesGroup = new THREE.Group();
    this.globeGroup.add(this.particlesGroup);
    this.arcCurves = [];

    const hotspots = [
      new THREE.Vector3(35, 45, 42),
      new THREE.Vector3(-45, 20, 50),
      new THREE.Vector3(20, -50, 44),
      new THREE.Vector3(-30, -35, -50),
      new THREE.Vector3(50, -15, -45),
      new THREE.Vector3(0, 60, -35)
    ];

    for (let i = 0; i < hotspots.length; i++) {
      const p1 = hotspots[i].clone().normalize().multiplyScalar(GLOBE_RADIUS);
      const p2 = hotspots[(i + 2) % hotspots.length].clone().normalize().multiplyScalar(GLOBE_RADIUS);
      const col = i % 2 === 0 ? 0x00ff66 : 0x06b6d4;

      const curveObj = this.createCyberArcWithParticle(p1, p2, col);
      this.arcsGroup.add(curveObj.line);
      this.particlesGroup.add(curveObj.particle);
      this.arcCurves.push(curveObj);

      // Hotspot beacon marker
      const beaconGeo = new THREE.SphereGeometry(1.6, 12, 12);
      const beaconMat = new THREE.MeshBasicMaterial({ color: col });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.copy(p1);
      this.globeGroup.add(beacon);
    }

    // 8. Interactive Mouse Movement & Parallax
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetRotationX = 0.2;
    this.targetRotationY = 0;

    this.onMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      this.mouseX = (x / rect.width) * 1.8;
      this.mouseY = (y / rect.height) * 1.8;
    };
    container.addEventListener("mousemove", this.onMouseMove);

    // Touch support for mobile devices
    this.onTouchMove = (event) => {
      if (event.touches.length > 0) {
        const rect = container.getBoundingClientRect();
        const x = event.touches[0].clientX - rect.left - rect.width / 2;
        const y = event.touches[0].clientY - rect.top - rect.height / 2;
        this.mouseX = (x / rect.width) * 1.8;
        this.mouseY = (y / rect.height) * 1.8;
      }
    };
    container.addEventListener("touchmove", this.onTouchMove, { passive: true });

    // 9. Resize Handling with ResizeObserver
    this.handleResize = () => {
      const w = container.clientWidth || 450;
      const h = container.clientHeight || 450;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };

    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(container);
    } else {
      window.addEventListener("resize", this.handleResize);
    }

    // 10. Start Animation Loop
    this.clock = new THREE.Clock();
    this.isInitialized = true;
    this.animate();
  }

  createOrbitalRing(radius, colorHex, tiltX, tiltY, speed) {
    const ringGeo = new THREE.BufferGeometry();
    const segments = 90;
    const ringPos = new Float32Array(segments * 3);
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      ringPos[i * 3] = Math.cos(angle) * radius;
      ringPos[i * 3 + 1] = Math.sin(angle) * radius;
      ringPos[i * 3 + 2] = 0;
    }
    ringGeo.setAttribute("position", new THREE.BufferAttribute(ringPos, 3));
    const ringMat = new THREE.LineBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const ring = new THREE.LineLoop(ringGeo, ringMat);
    ring.rotation.x = tiltX;
    ring.rotation.y = tiltY;
    this.ringsGroup.add(ring);
    return { mesh: ring, speed: speed };
  }

  createCyberArcWithParticle(p1, p2, colorHex) {
    const mid = p1.clone().add(p2).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(this.GLOBE_RADIUS * 1.38);

    const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
    const pts = curve.getPoints(40);
    const arcGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const arcMat = new THREE.LineBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.70,
      blending: THREE.AdditiveBlending
    });
    const line = new THREE.Line(arcGeo, arcMat);

    // Traveling particle packet
    const pGeo = new THREE.SphereGeometry(1.2, 8, 8);
    const pMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      blending: THREE.AdditiveBlending
    });
    const particle = new THREE.Mesh(pGeo, pMat);
    particle.position.copy(p1);

    return {
      curve,
      line,
      particle,
      speed: 0.35 + Math.random() * 0.25,
      progress: Math.random()
    };
  }

  animate() {
    this.reqId = requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    if (this.autoRotate) {
      this.globeGroup.rotation.y += 0.005;
    }

    // Smooth lerp to mouse parallax
    this.globeGroup.rotation.x = THREE.MathUtils.lerp(
      this.globeGroup.rotation.x,
      0.2 + this.mouseY * 0.35,
      0.05
    );

    // Moving particles along Bezier arcs
    if (this.arcCurves) {
      this.arcCurves.forEach(item => {
        item.progress = (item.progress + delta * item.speed) % 1;
        const pos = item.curve.getPoint(item.progress);
        item.particle.position.copy(pos);
      });
    }

    // Subtle breathing pulse on cyber point cloud
    if (this.pointsMat) {
      this.pointsMat.opacity = 0.75 + Math.sin(time * 3) * 0.15;
    }

    // Spin orbital rings at designated speeds
    if (this.showRings) {
      if (this.ring1) this.ring1.mesh.rotation.z += this.ring1.speed;
      if (this.ring2) this.ring2.mesh.rotation.z += this.ring2.speed;
    }

    this.renderer.render(this.scene, this.camera);
  }

  toggleAutoRotate() {
    this.autoRotate = !this.autoRotate;
    if (window.sentinelConsole) {
      window.sentinelConsole.log({
        category: "SYSTEM",
        type: "INFO",
        message: `3D Threat Globe rotation ${this.autoRotate ? "resumed" : "paused"}.`
      });
    }
    return this.autoRotate;
  }

  resetOrientation() {
    if (this.globeGroup) {
      this.globeGroup.rotation.set(0.2, 0, 0);
      this.mouseX = 0;
      this.mouseY = 0;
    }
    if (window.sentinelConsole) {
      window.sentinelConsole.log({
        category: "SYSTEM",
        type: "INFO",
        message: "3D Threat Globe orientation reset to default telemetry vector."
      });
    }
  }

  renderFallback(reason) {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 font-mono text-xs">
        <div class="w-16 h-16 rounded-full border border-primary-container/40 flex items-center justify-center bg-surface-container">
          <span class="material-symbols-outlined text-primary-container text-2xl animate-pulse">radar</span>
        </div>
        <div class="text-primary font-bold">2D Telemetry Radar Active</div>
        <p class="text-outline max-w-xs text-[11px]">${reason}</p>
        <span class="px-2 py-0.5 rounded bg-surface-container text-secondary-container border border-secondary-container/30 text-[10px]">
          SIMULATION RADAR MODE
        </span>
      </div>
    `;
  }

  destroy() {
    if (this.reqId) cancelAnimationFrame(this.reqId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    window.removeEventListener("resize", this.handleResize);
    if (this.container) {
      this.container.removeEventListener("mousemove", this.onMouseMove);
      this.container.removeEventListener("touchmove", this.onTouchMove);
    }
    if (this.renderer) this.renderer.dispose();
  }
}

// Auto-initialize when DOM loads if container exists
document.addEventListener("DOMContentLoaded", () => {
  const globeInstance = new CyberThreatGlobe("threejs-cyber-globe-container");
  globeInstance.init();

  const btnToggleRotate = document.getElementById("btn-globe-toggle-rotate");
  if (btnToggleRotate) {
    btnToggleRotate.addEventListener("click", () => {
      const isRunning = globeInstance.toggleAutoRotate();
      btnToggleRotate.title = isRunning ? "Pause 3D rotation" : "Resume 3D rotation";
      const icon = btnToggleRotate.querySelector(".material-symbols-outlined");
      if (icon) icon.textContent = isRunning ? "pause" : "play_arrow";
    });
  }

  const btnResetView = document.getElementById("btn-globe-reset-view");
  if (btnResetView) {
    btnResetView.addEventListener("click", () => {
      globeInstance.resetOrientation();
    });
  }
});

if (typeof module !== "undefined" && module.exports) {
  module.exports = { CyberThreatGlobe };
}
