import * as THREE from 'three';
import { applySnapping, canPlaceAtLayer } from './packing';
import type { ContainerType, EngineConfig, PlacedBox, SpawnState } from './types';

export function createInteractions(opts: {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  controls: { enabled: boolean };
  placedMeshes: THREE.Mesh[];
  getPlacedData: () => PlacedBox[];
  getContainer: () => ContainerType;
  getConfig: () => EngineConfig;
  getActiveLayerY: (spawnH: number) => number;
  getActiveSpawn: () => SpawnState | null;
  addPlaced: (box: PlacedBox) => void;
  removePlacedAt: (index: number) => void;
}) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  let selectedMesh: THREE.Mesh | null = null;
  let selectedColor: number | null = null;

  let isDragging = false;
  let dragTarget: THREE.Mesh | null = null;
  const dragOffset = new THREE.Vector3();
  let dragPlane: THREE.Plane | null = null;

  function setMouseFromEvent(ev: PointerEvent | MouseEvent) {
    const rect = opts.renderer.domElement.getBoundingClientRect();
    mouse.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -(((ev.clientY - rect.top) / rect.height) * 2 - 1);
  }

  function meshIndex(mesh: THREE.Mesh) {
    return opts.placedMeshes.indexOf(mesh);
  }

  function setSelected(mesh: THREE.Mesh | null) {
    if (selectedMesh && selectedColor != null) {
      const mat = selectedMesh.material as THREE.MeshLambertMaterial;
      mat.color.setHex(selectedColor);
    }
    selectedMesh = mesh;
    selectedColor = null;
    if (mesh) {
      const mat = mesh.material as THREE.MeshLambertMaterial;
      selectedColor = mat.color.getHex();
      mat.color.setHex(0xffa940);
    }
  }

  function pickBox(ev: PointerEvent) {
    setMouseFromEvent(ev);
    raycaster.setFromCamera(mouse, opts.camera);
    const hits = raycaster.intersectObjects(opts.placedMeshes, false);
    return hits.length > 0 ? (hits[0].object as THREE.Mesh) : null;
  }

  function rayToPlane(ev: PointerEvent, plane: THREE.Plane) {
    setMouseFromEvent(ev);
    raycaster.setFromCamera(mouse, opts.camera);
    const p = new THREE.Vector3();
    return raycaster.ray.intersectPlane(plane, p) ? p : null;
  }

  function placeNewByLayerClick(ev: PointerEvent) {
    const spawn = opts.getActiveSpawn();
    if (!spawn || spawn.remain <= 0) return;

    const layerY = opts.getActiveLayerY(spawn.h);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -layerY);
    const hit = rayToPlane(ev, plane);
    if (!hit) return;

    const cfg = opts.getConfig();
    const container = opts.getContainer();
    const placed = opts.getPlacedData();
    const pos = applySnapping(hit.x, hit.z, { l: spawn.l, w: spawn.w }, placed, container, layerY, cfg);

    if (!canPlaceAtLayer(pos.x, pos.z, layerY, spawn, placed, container, null, cfg.supportRatio)) return;

    opts.addPlaced({
      cargoId: spawn.cargoId,
      name: spawn.name,
      l: spawn.l,
      w: spawn.w,
      h: spawn.h,
      weight: spawn.weight,
      x: pos.x,
      y: layerY,
      z: pos.z,
    });
    spawn.remain -= 1;
  }

  function onPointerDown(ev: PointerEvent) {
    const hit = pickBox(ev);
    if (!hit) {
      setSelected(null);
      placeNewByLayerClick(ev);
      return;
    }

    setSelected(hit);
    dragTarget = hit;
    isDragging = true;
    opts.controls.enabled = false;

    const centerY = hit.position.y;
    dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -centerY);
    const p = rayToPlane(ev, dragPlane);
    if (p) dragOffset.copy(hit.position).sub(p);
  }

  function onPointerMove(ev: PointerEvent) {
    if (!isDragging || !dragTarget || !dragPlane) return;
    const p = rayToPlane(ev, dragPlane);
    if (!p) return;

    const idx = meshIndex(dragTarget);
    if (idx < 0) return;

    const placed = opts.getPlacedData();
    const data = placed[idx];
    if (!data) return;

    const desired = p.add(dragOffset);
    const cfg = opts.getConfig();
    const container = opts.getContainer();

    const baseX = desired.x - data.l / 2;
    const baseZ = desired.z - data.w / 2;
    const pos = applySnapping(baseX, baseZ, { l: data.l, w: data.w }, placed, container, data.y, cfg);

    if (!canPlaceAtLayer(pos.x, pos.z, data.y, data, placed, container, idx, cfg.supportRatio)) return;

    dragTarget.position.x = pos.x + data.l / 2;
    dragTarget.position.z = pos.z + data.w / 2;
    data.x = pos.x;
    data.z = pos.z;
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    dragTarget = null;
    dragPlane = null;
    opts.controls.enabled = true;
  }

  function onKeyDown(e: KeyboardEvent) {
    if ((e.key !== 'Delete' && e.key !== 'Backspace') || !selectedMesh) return;
    const idx = meshIndex(selectedMesh);
    if (idx < 0) return;
    setSelected(null);
    opts.removePlacedAt(idx);
  }

  function bind() {
    opts.renderer.domElement.addEventListener('pointerdown', onPointerDown);
    opts.renderer.domElement.addEventListener('pointermove', onPointerMove);
    opts.renderer.domElement.addEventListener('pointerup', onPointerUp);
    window.addEventListener('keydown', onKeyDown);
  }

  function unbind() {
    opts.renderer.domElement.removeEventListener('pointerdown', onPointerDown);
    opts.renderer.domElement.removeEventListener('pointermove', onPointerMove);
    opts.renderer.domElement.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('keydown', onKeyDown);
  }

  function notifyMeshesChanged() {
    if (selectedMesh && meshIndex(selectedMesh) < 0) setSelected(null);
  }

  return { bind, unbind, notifyMeshesChanged };
}
