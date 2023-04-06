import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { isMobile } from '@/utils';

class CustomControls {
  camera;
  scene;
  raycaster;
  startPoint = new THREE.Vector2();
  isPressDown = false;
  startEuler = new THREE.Euler(0, 0, 0, 'YXZ');
  pointerSpeed = 1.0;
  maxPolarAngle = Math.PI / 8;
  minPolarAngle = -Math.PI / 16;
  _enabled = true;
  updateHandler = () => {}
  moveTween;

  constructor(camera, renderer, scene, ground, updateHandler) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.ground = ground;
    this.updateHandler = updateHandler;
    this.raycaster = new THREE.Raycaster();
    this.initEvents();
  }

  set enabled(b) {
    this._enabled = b;
    if (!this._enabled) {
      this.removeEvents();
    } else {
      this.initEvents();
    }
  }

  get enabled() {
    return this._enabled;
  }

  initEvents() {
    if (isMobile()) {
      this.renderer.domElement.addEventListener('touchstart', this.onTouchStart);
      this.renderer.domElement.addEventListener('touchmove', this.onTouchMove);
      this.renderer.domElement.addEventListener('touchend', this.onTouchEnd);
    } else {
      this.renderer.domElement.addEventListener('mousedown', this.onMouseDown);
      this.renderer.domElement.addEventListener('mousemove', this.onMouseMove);
      this.renderer.domElement.addEventListener('mouseup', this.onMouseUp);
    }
  }

  removeEvents() {
    if (isMobile()) {
      this.renderer.domElement.removeEventListener(
        'touchstart',
        this.onTouchStart
      );
      this.renderer.domElement.removeEventListener(
        'touchmove',
        this.onTouchMove
      );
      this.renderer.domElement.removeEventListener('touchend', this.onTouchEnd);
    } else {
      this.renderer.domElement.removeEventListener(
        'mousedown',
        this.onMouseDown
      );
      this.renderer.domElement.removeEventListener(
        'mousemove',
        this.onMouseMove
      );
      this.renderer.domElement.removeEventListener('mouseup', this.onMouseUp);
    }
  }

  onTouchStart = e => {
    e.preventDefault();
    this.moveTween && this.moveTween.stop();
    if (e.touches.length == 1) {
      this.isPressDown = true;
      this.startEuler.setFromQuaternion(this.camera.quaternion);
      this.startPoint.x = e.touches[0].clientX;
      this.startPoint.y = e.touches[0].clientY;
    }
  };

  onTouchMove = e => {
    e.preventDefault();
    if (!this.isPressDown) return;
    const offsetX = e.touches[0].clientX - this.startPoint.x;
    const offsetY = e.touches[0].clientY - this.startPoint.y;
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.y = this.startEuler.y + offsetX * 0.002 * this.pointerSpeed;
    euler.x = this.startEuler.x + offsetY * 0.002 * this.pointerSpeed;
    euler.z = this.startEuler.z;

    if (euler.x < this.minPolarAngle) {
      euler.x = this.minPolarAngle;
    }
    if (euler.x > this.maxPolarAngle) {
      euler.x = this.maxPolarAngle;
    }
    this.camera.quaternion.setFromEuler(euler);
    this.updateHandler();
  };

  onTouchEnd = e => {
    e.preventDefault();
    this.isPressDown = false;
    const x = e.changedTouches[0].clientX;
    const y = e.changedTouches[0].clientY;

    const distanceX = this.startPoint.x - x;
    const distanceY = this.startPoint.y - y;

    if (Math.floor(distanceX) == 0 && Math.floor(distanceY) == 0) {
      this.move({ x, y });
    }
  };

  onMouseDown = e => {
    e.preventDefault();
    this.moveTween && this.moveTween.stop();
    if (e.which == 1) {
      this.isPressDown = true;
      this.startEuler.setFromQuaternion(this.camera.quaternion);
      this.startPoint.x = e.clientX;
      this.startPoint.y = e.clientY;
    }
  };
  onMouseMove = e => {
    if (!this.isPressDown) return;
    const offsetX = e.clientX - this.startPoint.x;
    const offsetY = e.clientY - this.startPoint.y;
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.y = this.startEuler.y + offsetX * 0.002 * this.pointerSpeed;
    euler.x = this.startEuler.x + offsetY * 0.002 * this.pointerSpeed;
    euler.z = this.startEuler.z;
    if (euler.x < this.minPolarAngle) {
      euler.x = this.minPolarAngle;
    }
    if (euler.x > this.maxPolarAngle) {
      euler.x = this.maxPolarAngle;
    }
    this.camera.quaternion.setFromEuler(euler);
    this.updateHandler();
  };

  onMouseUp = e => {
    e.preventDefault();
    if (e.which == 1) {
      this.isPressDown = false;
      const x = e.clientX;
      const y = e.clientY;
      if (this.startPoint.x == x && this.startPoint.y == y) {
        this.move({ x, y });
      }
    }
  };

  update() {
    TWEEN.update();
  }

  move(point) {
    const mouse = new THREE.Vector2();
    mouse.x = (point.x / this.renderer.domElement.offsetWidth) * 2 - 1;
    mouse.y = -(point.y / this.renderer.domElement.offsetHeight) * 2 + 1;
    this.raycaster.setFromCamera(mouse, this.camera);
    const boxIntersects = this.raycaster.intersectObject(this.scene, true);
    if (boxIntersects.length > 0) {
      const clickObj = boxIntersects[0].object;
      if (clickObj === this.ground) {
        const clickPoint = boxIntersects[0].point;
        const position = {
          x: clickPoint.x,
          y: this.camera.position.y,
          z: clickPoint.z
        };

        this.moveTween = new TWEEN.Tween(this.camera.position).to(
          position,
          1000
        );
        this.moveTween.onUpdate(() => {
          this.updateHandler();
        });
        this.moveTween.start();
      }
    }
  }
}

export default CustomControls;
