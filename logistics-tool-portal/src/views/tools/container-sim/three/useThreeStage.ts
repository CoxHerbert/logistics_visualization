import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { ContainerType, PlacedBox } from './types';

export function createStage(el: HTMLDivElement, container: ContainerType) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const w = el.clientWidth;
    const h = el.clientHeight;

    const camera = new THREE.PerspectiveCamera(55, w / h, 1, 200000);
    camera.position.set(container.innerLength * 0.9, container.innerHeight * 1.2, container.innerWidth * 1.8);
    camera.lookAt(new THREE.Vector3(container.innerLength / 2, container.innerHeight / 3, container.innerWidth / 2));

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
    controls.target.set(container.innerLength / 2, container.innerHeight / 3, container.innerWidth / 2);
    controls.update();

    let containerMesh: THREE.LineSegments | null = null;
    let floorPlane: THREE.Mesh | null = null;

    function buildContainerBox(c: ContainerType) {
        if (containerMesh) scene.remove(containerMesh);
        if (floorPlane) scene.remove(floorPlane);

        const geom = new THREE.BoxGeometry(c.innerLength, c.innerHeight, c.innerWidth);
        const edges = new THREE.EdgesGeometry(geom);
        containerMesh = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x999999 }));
        containerMesh.position.set(c.innerLength / 2, c.innerHeight / 2, c.innerWidth / 2);
        scene.add(containerMesh);

        // invisible floor for raycast if you want (we mainly use math plane for layers)
        const floorGeom = new THREE.PlaneGeometry(c.innerLength, c.innerWidth);
        const floorMat = new THREE.MeshBasicMaterial({ visible: false });
        floorPlane = new THREE.Mesh(floorGeom, floorMat);
        floorPlane.rotateX(-Math.PI / 2);
        floorPlane.position.set(c.innerLength / 2, 0, c.innerWidth / 2);
        scene.add(floorPlane);
    }

    buildContainerBox(container);

    const placedMeshes: THREE.Mesh[] = [];

    function createBoxMesh(b: { l: number; w: number; h: number }) {
        const geom = new THREE.BoxGeometry(b.l, b.h, b.w);
        const mat = new THREE.MeshLambertMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.92 });
        return new THREE.Mesh(geom, mat);
    }

    function addPlacedMesh(box: PlacedBox) {
        const mesh = createBoxMesh(box);
        mesh.position.set(box.x + box.l / 2, box.y + box.h / 2, box.z + box.w / 2);
        scene.add(mesh);
        placedMeshes.push(mesh);
        return mesh;
    }

    function clearPlaced() {
        for (const m of placedMeshes) scene.remove(m);
        placedMeshes.length = 0;
    }

    function resize() {
        const ww = el.clientWidth;
        const hh = el.clientHeight;
        camera.aspect = ww / hh;
        camera.updateProjectionMatrix();
        renderer.setSize(ww, hh);
    }

    let anim = 0;
    function start() {
        const loop = () => {
            controls.update();
            renderer.render(scene, camera);
            anim = requestAnimationFrame(loop);
        };
        loop();
    }

    function stop() {
        cancelAnimationFrame(anim);
    }

    function dispose() {
        stop();
        controls.dispose();
        renderer.dispose();
        // canvas removal handled by Vue unmount (optional):
        // renderer.domElement.remove()
    }

    return {
        scene,
        camera,
        renderer,
        controls,
        placedMeshes,
        buildContainerBox,
        floorPlane,
        addPlacedMesh,
        clearPlaced,
        resize,
        start,
        dispose,
    };
}
