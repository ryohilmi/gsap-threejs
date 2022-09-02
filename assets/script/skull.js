import * as THREE from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function addModeltoBG() {
  const canvas = document.querySelector("#skull-canvas");
  const scene = new THREE.Scene();
  const gui = new GUI();
  var mtlLoader = new MTLLoader();
  let skull = new THREE.Object3D();

  let controls;
  let camera;
  let renderer;
  let stats;

  let targetX;
  let targetY;

  function init() {
    // #region sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    window.addEventListener("resize", () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
    // #endregion

    // #region renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // #endregion

    // #region camera
    camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );

    controls = new OrbitControls(camera, renderer.domElement);

    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 0;
    controls.update();
    scene.add(camera);
    // #endregion

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    );
    // scene.add(cube);

    const pointLight = new THREE.PointLight(0xffffff, 2, 100);
    pointLight.position.set(20, 0, 10);
    scene.add(pointLight);

    const skullFolder = gui.addFolder("Skull");

    // mtlLoader.setBaseUrl("assets/model/");
    mtlLoader.setPath("assets/model/");
    var url = "12140_Skull_v3_L2.mtl";
    mtlLoader.load(url, function (materials) {
      materials.preload();

      var objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath("assets/model/");
      objLoader.load("12140_Skull_v3_L2.obj", function (object) {
        skull = object;

        skull.rotation.x = 5;

        skull.position.x = 0;
        skull.position.y -= 10;
        skull.position.z -= 50;

        // skullFolder.add(skull.rotation, "x", 0, Math.PI * 2);
        // skullFolder.add(skull.rotation, "y", 0, Math.PI * 2);
        // skullFolder.add(skull.rotation, "z", 0, Math.PI * 2);
        // skullFolder.open();

        scene.add(skull);

        gsapAnim();
      });
    });

    stats = Stats();
    document.body.appendChild(stats.dom);

    // skullFolder.add(skull.rotation, "x", 0, Math.PI * 2);
    // skullFolder.add(skull.rotation, "y", 0, Math.PI * 2);
    // skullFolder.add(skull.rotation, "z", 0, Math.PI * 2);
    // skullFolder.open();

    const cameraFolder = gui.addFolder("Camera");
    cameraFolder.add(camera.position, "z", 0, 10);
    cameraFolder.open();

    function render() {
      renderer.render(scene, camera);
    }

    animate();
  }

  document.addEventListener("mousemove", onDocumentMouseMove);

  let mouseX = 0;
  let mouseY = 0;

  targetX = 0;
  targetY = 0;

  const windowX = window.innerWidth / 2;
  const windowY = window.innerHeight / 2;

  function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowX;
    mouseY = event.clientY - windowY;
  }

  const animate = () => {
    // targetX = mouseX * 0.0005;
    // targetY = mouseY * 0.001 - 0.1;

    // skull.rotation.x += targetY - skull.rotation.x + 5;
    // skull.rotation.y += targetX - skull.rotation.y;
    // skull.rotation.z += (targetX * 1.2 - skull.rotation.z) * 1.7;

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
    stats.update();
  };

  init();

  gsap.registerPlugin(ScrollTrigger);

  function gsapAnim() {
    gsap.to(skull.rotation, {
      z: Math.PI * 2,
      scrollTrigger: {
        target: "#section2",
        scrub: 0.2,
      },
      onUpdate: () => {},
    });

    gsap.to(skull.position, {
      z: "+=5",
      scrollTrigger: {
        target: "#section2",
        scrub: 0.2,
      },
      onUpdate: () => {},
    });

    gsap.to(
      skull.position,
      {
        x: "-=20",
        yoyo: true,
        scrollTrigger: {
          target: "#section2",
          markers: true,
          start: "bottom center",
        },
      },
      "+=5"
    );
  }
}

addModeltoBG();
