/// <reference types="three" />
function createRoundedRectGeometry(
  width: number,
  height: number,
  radius = 0.5,
  segments = 32
): THREE.ShapeGeometry {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;

  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  return new THREE.ShapeGeometry(shape, segments);
}

import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import gsap from 'gsap';

@Component({
  selector: 'app-floating-scene',
  standalone: true,
  imports: [],
  templateUrl: './floating-scene.component.html',
  styleUrl: './floating-scene.component.scss'
})
export class FloatingSceneComponent implements OnInit, OnDestroy {
  @ViewChild('canvasNav', { static: true }) canvasRef!: ElementRef;

  scene!: THREE.Scene;
  camera!: THREE.OrthographicCamera;
  renderer!: THREE.WebGLRenderer;

  icons: THREE.Mesh[] = [];
  highlight!: THREE.Mesh;
  selectedIdx = 0;

  iconMaterials: { normal: THREE.Texture; selected: THREE.Texture }[] = [];

  ngOnInit(): void {
    this.initScene();
    this.render();
    window.addEventListener('resize', this.onResize);
    this.canvasRef.nativeElement.addEventListener('pointerdown', this.onClick);
    this.canvasRef.nativeElement.addEventListener('pointermove', this.onPointerMove);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
    this.canvasRef.nativeElement.removeEventListener('pointerdown', this.onClick);
    this.canvasRef.nativeElement.removeEventListener('pointermove', this.onPointerMove);
  }

initScene() {
  const rect = this.canvasRef.nativeElement.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height + 50;
  const aspect = width / height;

  this.scene = new THREE.Scene();

  const viewWidth = 10;
  const viewHeight = viewWidth / aspect;
  this.camera = new THREE.OrthographicCamera(
    -viewWidth / 2, viewWidth / 2,
    viewHeight / 2, -viewHeight / 2,
    0.1, 10
  );
  this.camera.position.z = 5;

  this.renderer = new THREE.WebGLRenderer({
    canvas: this.canvasRef.nativeElement,
    alpha: true,
    antialias: true,
  });
  this.renderer.setSize(width, height);
  this.renderer.setPixelRatio(window.devicePixelRatio);

  const loader = new THREE.TextureLoader();
  const iconBaseNames = ['star', 'tab', 'profile', 'menu', 'vmail'];
  const iconSize = 1;
  const spacing = 2;

  let loadedIcons = 0;

  iconBaseNames.forEach((name, i) => {
    loader.load(`/assets/${name}.png`, (normal) => {
      loader.load(`/assets/${name}_selected.png`, (selected) => {
        // Store textures
        this.iconMaterials[i] = { normal, selected };

        const material = new THREE.MeshBasicMaterial({
          map: i === this.selectedIdx ? selected : normal,
          transparent: true
        });

        const geometry = new THREE.PlaneGeometry(iconSize, iconSize);
        const iconMesh = new THREE.Mesh(geometry, material);
        iconMesh.position.set((i - 2) * spacing, -3, 0);
        iconMesh.userData['index'] = i;

        this.icons.push(iconMesh);
        this.scene.add(iconMesh);

        if (i === 0 && !this.highlight) {
          this.highlight = new THREE.Mesh(
            createRoundedRectGeometry(1.2, 1.2, 0.6, 32),
            new THREE.MeshBasicMaterial({ color: 0xffcc00 })
          );
          this.highlight.position.set(iconMesh.position.x, -3, -0.5);
          this.scene.add(this.highlight);
        }

        loadedIcons++;
        if (loadedIcons === iconBaseNames.length) {
          // Only render once all icons are ready
          this.render();
        }
      });
    });
  });
}


  onClick = (event: PointerEvent) => {
    const mouse = new THREE.Vector2(
      (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1,
      -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObjects(this.icons);

    if (intersects.length > 0) {
      const index = intersects[0].object.userData['index'];
      if (index !== this.selectedIdx) {
        this.animateHighlightTo(index);
      }
    }
  };

  onPointerMove = (event: PointerEvent) => {
  const mouse = new THREE.Vector2(
    (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1,
    -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, this.camera);
  const intersects = raycaster.intersectObjects(this.icons);

  if (intersects.length > 0) {
    this.canvasRef.nativeElement.style.cursor = 'pointer';
  } else {
    this.canvasRef.nativeElement.style.cursor = 'default';
  }
};

  animateHighlightTo(index: number) {
    const fromX = this.icons[this.selectedIdx].position.x;
    const toX = this.icons[index].position.x;
    const midX = (fromX + toX) / 2;
    const distance = Math.abs(toX - fromX);
    const stretchWidth = distance + 2;

    // Swap icon textures
    (this.icons[this.selectedIdx].material as THREE.MeshBasicMaterial).map = this.iconMaterials[this.selectedIdx].normal;
    (this.icons[index].material as THREE.MeshBasicMaterial).map = this.iconMaterials[index].selected;

    (this.icons[this.selectedIdx].material as THREE.MeshBasicMaterial).needsUpdate = true;
    (this.icons[index].material as THREE.MeshBasicMaterial).needsUpdate = true;

    this.selectedIdx = index;

    // Step 1: Stretch
    gsap.to(this.highlight.scale, {
      x: stretchWidth / 2,
      duration: 0.3,
      ease: 'power2.out'
    });

    gsap.to(this.highlight.position, {
      x: midX,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        gsap.delayedCall(0.15, () => {
          // Step 2: Shrink
          gsap.to(this.highlight.scale, {
            x: 1,
            duration: 0.3,
            ease: 'power2.inOut',
            onUpdate: this.render
          });

          gsap.to(this.highlight.position, {
            x: toX,
            duration: 0.3,
            ease: 'power2.inOut',
            onUpdate: this.render
          });
        });
      }
    });
  }

  render = () => {
    this.renderer.render(this.scene, this.camera);
  };

  onResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;
    this.camera.left = -aspect * 5;
    this.camera.right = aspect * 5;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.render();
  };
}
