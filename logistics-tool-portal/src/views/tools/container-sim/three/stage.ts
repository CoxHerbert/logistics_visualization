import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { ContainerType, PlacedBox } from './types';

export function createStage(el: HTMLDivElement, containerType: ContainerType) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const w = el.clientWidth;
  const h = el.clientHeight;
  const camera = new THREE.PerspectiveCamera(55, w / h, 1, 200000);
  camera.position.set(containerType.innerLength * 0.9, containerType.innerHeight * 1.2, containerType.innerWidth * 1.8);
  camera.lookAt(new THREE.Vector3(containerType.innerLength / 2, containerType.innerHeight / 3, containerType.innerWidth / 2));

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  el.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.85));
  const dir = new THREE.DirectionalLight(0xffffff, 0.65);
  dir.position.set(1000, 1500, 800);
  scene.add(dir);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.target.set(containerType.innerLength / 2, containerType.innerHeight / 3, containerType.innerWidth / 2);
  controls.update();

  let containerMesh: THREE.LineSegments | null = null;
  let floorPlane: THREE.Mesh | null = null;
  const placedMeshes: THREE.Mesh[] = [];

  function buildContainerBox(c: ContainerType) {
    if (containerMesh) scene.remove(containerMesh);
    if (floorPlane) scene.remove(floorPlane);

    const geom = new THREE.BoxGeometry(c.innerLength, c.innerHeight, c.innerWidth);
    const edges = new THREE.EdgesGeometry(geom);
    containerMesh = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x999999 }));
    containerMesh.position.set(c.innerLength / 2, c.innerHeight / 2, c.innerWidth / 2);
    scene.add(containerMesh);

    const floorGeom = new THREE.PlaneGeometry(c.innerLength, c.innerWidth);
    floorPlane = new THREE.Mesh(floorGeom, new THREE.MeshBasicMaterial({ visible: false }));
    floorPlane.rotateX(-Math.PI / 2);
    floorPlane.position.set(c.innerLength / 2, 0, c.innerWidth / 2);
    scene.add(floorPlane);
  }

  function addPlacedMesh(box: PlacedBox) {
    const geom = new THREE.BoxGeometry(box.l, box.h, box.w);
    const mat = new THREE.MeshLambertMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.92 });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(box.x + box.l / 2, box.y + box.h / 2, box.z + box.w / 2);
    scene.add(mesh);
    placedMeshes.push(mesh);
    return mesh;
  }

  function removePlacedMesh(index: number) {
    const mesh = placedMeshes[index];
    if (!mesh) return;
    scene.remove(mesh);
    placedMeshes.splice(index, 1);
  }

  function clearPlaced() {
    for (const mesh of placedMeshes) scene.remove(mesh);
    placedMeshes.length = 0;
  }

  function resize() {
    const ww = el.clientWidth;
    const hh = el.clientHeight;
    camera.aspect = ww / hh;
    camera.updateProjectionMatrix();
    renderer.setSize(ww, hh);
  }

  let raf = 0;
  function start() {
    const loop = () => {
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();
  }

  function dispose() {
    cancelAnimationFrame(raf);
    controls.dispose();
    renderer.dispose();
  }

  buildContainerBox(containerType);

  return {
    scene,
    camera,
    renderer,
    controls,
    placedMeshes,
    buildContainerBox,
    addPlacedMesh,
    removePlacedMesh,
    clearPlaced,
    resize,
    start,
    dispose,
  };
}
