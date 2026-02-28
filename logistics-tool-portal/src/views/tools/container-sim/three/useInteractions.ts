import * as THREE from 'three';
import type { ContainerType, PlacedBox, SpawnState } from './types';
import { canPlaceAtLayer } from './packing';

export function createInteractions(opts: {
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    controls: { enabled: boolean };
    placedMeshes: THREE.Mesh[];
    placedData: PlacedBox[];
    getContainer: () => ContainerType;
    getActiveLayerY: (spawnH: number) => number;
    getActiveSpawn: () => SpawnState | null;
    onPlacedDataChange: () => void;
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

    function setMouseFromEvent(ev: PointerEvent | MouseEvent) {
        const rect = opts.renderer.domElement.getBoundingClientRect();
        mouse.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -(((ev.clientY - rect.top) / rect.height) * 2 - 1);
    }

    function pickBox(ev: PointerEvent) {
        setMouseFromEvent(ev);
        raycaster.setFromCamera(mouse, opts.camera);
        const hits = raycaster.intersectObjects(opts.placedMeshes, false);
        return hits.length ? (hits[0].object as THREE.Mesh) : null;
    }

    function meshIndex(mesh: THREE.Mesh) {
        return opts.placedMeshes.indexOf(mesh);
    }

    function updateDragPlaneForMesh(mesh: THREE.Mesh) {
        const idx = meshIndex(mesh);
        if (idx < 0) return;
        const centerY = mesh.position.y;
        dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -centerY);
    }

    function rayToPlane(ev: PointerEvent): THREE.Vector3 | null {
        if (!dragPlane) return null;
        setMouseFromEvent(ev);
        raycaster.setFromCamera(mouse, opts.camera);
        const p = new THREE.Vector3();
        const ok = raycaster.ray.intersectPlane(dragPlane, p);
        return ok ? p : null;
    }

    function onKeyDown(e: KeyboardEvent) {
        if ((e.key === 'Delete' || e.key === 'Backspace') && selectedMesh) {
            const idx = meshIndex(selectedMesh);
            if (idx >= 0) {
                setSelected(null);
                opts.removePlacedAt(idx);
                opts.onPlacedDataChange();
            }
        }
    }

    function placeNewByLayerClick(ev: PointerEvent) {
        const spawn = opts.getActiveSpawn();
        if (!spawn) return;

        // click -> intersect with math plane at layerY
        const layerY = opts.getActiveLayerY(spawn.h);
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -layerY);

        setMouseFromEvent(ev);
        raycaster.setFromCamera(mouse, opts.camera);
        const p = new THREE.Vector3();
        const ok = raycaster.ray.intersectPlane(plane, p);
        if (!ok) return;

        const container = opts.getContainer();
        const x = p.x;
        const z = p.z;

        if (!canPlaceAtLayer(x, z, layerY, { l: spawn.l, w: spawn.w }, opts.placedData, container)) return;

        opts.addPlaced({
            cargoId: spawn.cargoId,
            name: spawn.name,
            l: spawn.l,
            w: spawn.w,
            h: spawn.h,
            weight: spawn.weight,
            x,
            y: layerY,
            z,
        });
        spawn.remain -= 1;
        opts.onPlacedDataChange();
    }

    function onPointerDown(ev: PointerEvent) {
        const hit = pickBox(ev);
        if (hit) {
            setSelected(hit);
            dragTarget = hit;
            isDragging = true;
            opts.controls.enabled = false;
            updateDragPlaneForMesh(hit);
            const p = rayToPlane(ev);
            if (p) dragOffset.copy(hit.position).sub(p);
            return;
        }

        setSelected(null);
        placeNewByLayerClick(ev);
    }

    function onPointerMove(ev: PointerEvent) {
        if (!isDragging || !dragTarget) return;
        const p = rayToPlane(ev);
        if (!p) return;

        const idx = meshIndex(dragTarget);
        if (idx < 0) return;

        const data = opts.placedData[idx];
        if (!data) return;
        const desired = p.add(dragOffset);

        // center -> left-front
        const x = desired.x - data.l / 2;
        const z = desired.z - data.w / 2;

        const container = opts.getContainer();
        if (!canPlaceAtLayer(x, z, data.y, { l: data.l, w: data.w }, opts.placedData, container, idx)) return;

        // update mesh center
        dragTarget.position.x = x + data.l / 2;
        dragTarget.position.z = z + data.w / 2;

        // sync data
        data.x = x;
        data.z = z;
        opts.onPlacedDataChange();
    }

    function onPointerUp() {
        if (!isDragging) return;
        isDragging = false;
        dragTarget = null;
        dragPlane = null;
        opts.controls.enabled = true;
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
        // 当 placedMeshes 被清空/重建时，选中引用可能失效
        if (selectedMesh && meshIndex(selectedMesh) < 0) setSelected(null);
    }

    return { bind, unbind, setSelected, notifyMeshesChanged };
}
