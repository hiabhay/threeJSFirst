import * as THREE from 'three';
import '../public/App.css';
import gsap from 'gsap';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const App = () => {
  const scene = new THREE.Scene();

  const geometry = new THREE.SphereGeometry(3, 64, 64); // parameters: radius, width segment, height segment
  const material = new THREE.MeshStandardMaterial({
    color: '#00ff83',
    roughness: 0.5
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(0, 10, 10); // x, y, z position of ball
  light.intensity = 1.25
  scene.add(light);

  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100); // params: field of view, aspect ratio, near point ,end point
  camera.position.z = 20;
  scene.add(camera);



  const canvas = document.querySelector('.webgl');
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(3);
  renderer.render(scene, camera);

  window.addEventListener('resize', () => {
    //update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight

    //update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(2);
    renderer.setSize(sizes.width, sizes.height);
  })

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 5;

  const loop = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
  }
  loop();

  const t1 = gsap.timeline({ defaults: { duration: 1 } })
  t1.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })
  t1.fromTo('nav', { y: '-100%' }, { y: '0%' })
  t1.fromTo('.title', { opacity: 0 }, { opacity: 1 })

  let mouseDown = false;
  let rgb = [12, 23, 55];
  window.addEventListener("mousedown", () => (mouseDown = true))
  window.addEventListener("mouseup", () => (mouseDown = false))

  window.addEventListener("mousemove", (e) => {
    if (mouseDown) {
      rgb = [
        Math.round((e.pageX / sizes.width) * 255),
        Math.round((e.pageY / sizes.height) * 255),
        150
      ]
      let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
      // new THREE.Color(`rgb(0, 100, 150)`)
      gsap.to(mesh.material.color, { r: newColor.r, g: newColor.g, b: newColor.b });
    }
  })

};

export default App;
