
import * as THREE from 'three';

// import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
// import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
// import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
// import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import CustomControls from './customControls';

import { isMobile } from '@/utils';
import { MobileClickManager } from '.';

const triggerEvent = Symbol('triggerEvent');
const textureloader = new THREE.TextureLoader();

function createSprite(imageUrl) {
  const texture = textureloader.load(imageUrl);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  return sprite;
}

class Scene {
  stats;
  camera;
  renderer;
  container;
  groundObj; // 地形对象
  scene;
  controls;
  composer;
  tips = []; // 场景中tips，会在update中始终面向摄像头
  soundSourceObj = []; // 带有声音源的物体
  animationId = 0;
  audioListener;
  interactObj = new Map(); // TODO: 需要释放
  _eventMap = new Map();
  clickManager;
  updateArr = [];// 场景移动时，需要在循环中执行的函数

  _isEditor = false
  set isEditor(b) {
    this.removeEvents();
    this._isEditor = b;
    this.initEvents();
  }

  raycaster = new THREE.Raycaster();

  groundSize = new THREE.Vector3();
  groundCenter = new THREE.Vector3();
  audioLoader = new THREE.AudioLoader();

  light = new THREE.HemisphereLight(
    0xffffbb,
    0x080820,
    1
  );

  /**
   * 转换模型，使其适合此场景
   * @param {THREE.Object3D} model 模型对象
   */
  transformModel(model) {
    // TODO: 实现
    // model.scale.set(0.5, 0.5, 0.5)
    return model;
  }

  /**
   * 向场景中添加模型对象，并同时设置相机位置
   * @param {Array<THREE.Object3D>} models 非地形模型
   * @param {THREE.Object3D} groundModel 地形模型
   */
  addModels(models = [], extra = {}, groundModel) {
    models.forEach(model => {
      if (model instanceof THREE.Object3D) {
        this.scene.add(this.transformModel(model));
      }
    });
    // TODO: delete mock ground
    if (!groundModel) {
      const objBox = new THREE.Box3().setFromObject(this.scene.children[4]);
      const objBoxCenter = objBox.getCenter(new THREE.Vector3());
      const objSize = objBox.getSize(new THREE.Vector3());
      const groundGeometry = new THREE.PlaneGeometry(objSize.x * 1.5, objSize.z * 1.5, 10, 10);
      const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 });
      groundModel = new THREE.Mesh(groundGeometry, groundMaterial);
      groundModel.rotateX(-Math.PI / 2);
      groundModel.position.set(
        objBoxCenter.x,
        objBox.min.y + 10,
        objBoxCenter.z
      );
      // groundModel.visible = false;
    }

    this.groundObj = this.transformModel(groundModel);
    this.scene.add(this.groundObj);
    // 计算地形尺寸、中心点
    const groundBox = new THREE.Box3().setFromObject(this.groundObj);
    this.groundSize = groundBox.getSize(new THREE.Vector3());
    this.groundCenter = groundBox.getCenter(new THREE.Vector3());

    const initCameraHeight = 15; // 相机距离地面的初始高度

    this.camera.position.set(
      groundBox.min.x,
      groundBox.min.y + initCameraHeight,
      groundBox.min.z
    );

    this.camera.lookAt(
      this.groundCenter.x,
      groundBox.min.y + initCameraHeight,
      this.groundCenter.z
    );
    this.initControls();
    this.initRichObjects(extra);
    this.renderer.render(this.scene, this.camera);
    this.animation();
  }

  /**
   * 计算对象离相机最近的面的中心点
   * @param {THREE.Box} box 包围盒对象
   */
  getClosesetFaceCenter(box) {
    // 获取相机的位置
    const cameraPosition = this.camera.position;
    const boxSize = box.getSize(new THREE.Vector3());

    // 计算包围盒的周围四个面的中心点与相机的距离
    const faceCenter1 = new THREE.Vector3(box.max.x, box.min.y + boxSize.y / 2, box.min.z + boxSize.z / 2);
    const faceCenter2 = new THREE.Vector3(box.min.x, box.min.y + boxSize.y / 2, box.min.z + boxSize.z / 2);
    const faceCenter3 = new THREE.Vector3(box.min.x + boxSize.x / 2, box.min.y + boxSize.y / 2, box.max.z);
    const faceCenter4 = new THREE.Vector3(box.min.x + boxSize.x / 2, box.min.y + boxSize.y / 2, box.min.z);
    const faceCenterArr = [
      faceCenter1,
      faceCenter2,
      faceCenter3,
      faceCenter4
    ];

    let faceCenter, minDistance = Infinity;
    faceCenterArr.forEach((center) => {
      const distance = center.distanceTo(cameraPosition);
      if (distance < minDistance) {
        faceCenter = center;
        minDistance = distance;
      }
    });
    return faceCenter;
  }

  initRichObjects(extra) {
    Object.keys(extra).forEach(name => {
      const extraData = extra[name];
      const object = this.scene.getObjectByName(name);
      let sprite;
      if (extraData.type === 1) {
        sprite = createSprite('/static/info.png');
      } else if (extraData.type === 2) {
        sprite = createSprite('/static/more.png');
      }
      // TODO: confirm
      sprite.scale.set(2, 2, 2);
      sprite.userData = extraData;
      const attchSprite = () => {
        const objBox = new THREE.Box3().setFromObject(object);
        const objBoxCenter = objBox.getCenter(new THREE.Vector3());
        const nearestPointer = this.getClosesetFaceCenter(objBox);
        // 包围盒表面距离相机最近点
        // const closestPoint = objBox.clampPoint(this.camera.position, new THREE.Vector3());
        // console.log(closestPoint)
        // 计算最近点到包围盒中心点的向量
        const direction = new THREE.Vector3().subVectors(nearestPointer, objBoxCenter).normalize();

        sprite.position.copy(nearestPointer.add(direction.multiplyScalar(0.5)));

        sprite.lookAt(this.camera.position);
      };
      attchSprite();

      this.scene.add(sprite);

      this.updateArr.push(attchSprite);

      if (object) {
        this.interactObj.set(object, extra[name]);
      }
    });
  }

  /**
   * 初始化场景
   */
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x85B9DE);
    this.scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
    const directLight = new THREE.DirectionalLight(0xffffff, 2.5);
    this.scene.add(directLight);
    this.scene.add(this.light);

    // this.scene.add(this.light);
    // this.scene.add(this.camera);
    // this.scene.add(this.objBox);
    // this.scene.add(this.objBoxCenter);
    // this.scene.add(this.objBoxSize);
    // this.scene.add(...this.tips);
    // this.scene.add(...this.textObjects);
  }

  initAxesHelper() {
    const helper = new THREE.AxesHelper(5000);
    this.scene.add(helper);
  }

  initCamera() {
    const aspect = this.container.offsetWidth / this.container.offsetHeight;
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 1000);

    this.scene.add(this.camera);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true
    });
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;
    this.renderer.setSize(width, height);
    this.container.appendChild(this.renderer.domElement);
  }

  initStats() {
    this.stats = new Stats();
    this.container.appendChild(this.stats.dom);
  }

  initControls() {
    this.controls = new CustomControls(
      this.camera,
      this.renderer,
      this.scene,
      this.groundObj,
      this.update
    );
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement)
  }

  on(eventName, eventFn) {
    this._eventMap.set(eventName, eventFn);
  }

  [triggerEvent](eventName, params) {
    const eventFn = this._eventMap.get(eventName);
    eventFn && eventFn(params);
  }

  initEvents() {
    window.addEventListener('resize', this.onWindowResize);
    if (isMobile()) { // 手机端
      this.clickManager = new MobileClickManager(this.renderer.domElement);
      this.clickManager.addClick(this.onSceneClick);
    } else { // pc端
      if (!this._isEditor) {
        this.renderer.domElement.addEventListener('mousemove', this.onOutlineEvent);
      }
      this.renderer.domElement.addEventListener('click', this.onSceneClick);
    }
  }

  removeEvents() {
    if (isMobile()) {
      this.clickManager && this.clickManager.removeClick(this.onSceneClick);
    } else {
      if (!this._isEditor) {
        this.renderer.domElement.removeEventListener('mousemove', this.onOutlineEvent);
      }
      this.renderer.domElement.removeEventListener('click', this.onSceneClick);
    }
    window.removeEventListener('resize', this.onWindowResize);
  }

  initComposer() {
    // 创建一个EffectComposer（效果组合器）对象，然后在该对象上添加后期处理通道。
    this.composer = new EffectComposer(this.renderer);
    // 新建一个场景通道  为了覆盖到原理来的场景上
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
  }

  initAudioListener() {
    this.audioListener = new THREE.AudioListener();
    this.camera.add(this.audioListener);
  }

  onWindowResize = () => {
    this.camera.aspect =
      this.container.offsetWidth / this.container.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    this.renderer.render(this.scene, this.camera);
  }

  /**
   *
   * @param {MouseEvent} e 事件对象
   */
  onOutlineEvent = (e) => {
    const clickPoint = new THREE.Vector2();
    clickPoint.x = (e.clientX / this.container.offsetWidth) * 2 - 1;
    clickPoint.y = -(e.clientY / this.container.offsetHeight) * 2 + 1;
    this.raycaster.setFromCamera(clickPoint, this.camera);

    const boxIntersects = this.raycaster.intersectObject(this.scene, true);
    if (boxIntersects.length > 0) {
      const clickObj = boxIntersects[0].object;
      // CHECK: 是否可以这样判断
      if (clickObj !== this.groundObj) {
        this.outlineObj([clickObj]);
      }
    }
  }

  onSceneClick = (e) => {
    const clickPoint = new THREE.Vector2();
    const clickScreenX = e.clientX || e.changedTouches[0].clientX;
    const clickScreenY = e.clientY || e.changedTouches[0].clientY;

    clickPoint.x = (clickScreenX / this.container.offsetWidth) * 2 - 1;
    clickPoint.y = -(clickScreenY / this.container.offsetHeight) * 2 + 1;
    this.raycaster.setFromCamera(clickPoint, this.camera);

    const boxIntersects = this.raycaster.intersectObject(this.scene, true);
    if (boxIntersects.length > 0) {
      const clickObj = boxIntersects[0].object;
      if (clickObj !== this.groundObj) {
        if (isMobile() || this._isEditor) { // 如果是移动端或pc端编辑模式
          this.outlineObj([clickObj]);
        }
        this[triggerEvent]('onSelect', clickObj);
      }
    }
  }

  constructor(el) {
    this.container = el;

    this.animationId = 0;

    this.initScene();
    this.initAxesHelper();
    this.initRenderer();
    this.initCamera();
    this.initAudioListener();
    this.initComposer();
    this.initEvents();
    this.initStats();
  }

  // 创建几何立方体
  createBoxGeometry() {
    const boxGeometry = new THREE.BoxGeometry(20, 20, 20);
    const meterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const cube = new THREE.Mesh(boxGeometry, meterial);

    cube.userData = {
      text: 'demo picture',
      imageUrl:
        'https://lmg.jj20.com/up/allimg/1114/0406210Z024/2104060Z024-5-1200.jpg',
      soundUrl: '/static/audio.mp3'
    };

    return cube;
  }

  update = () => {
    this.updateArr.forEach(fn => {
      fn && fn();
    });
    // 靠近音源播放声音
    this.soundSourceObj.forEach((obj) => {
      const vector = new THREE.Vector3();
      vector.subVectors(obj.position, this.camera.position);
      vector.normalize();
      this.raycaster.set(this.camera.position, vector);
      const intersects = this.raycaster.intersectObject(obj);

      if (intersects.length > 0) {
        const clickPoint = intersects[0].point;
        const distance = this.camera.position.distanceTo(clickPoint);
        // FIXME: distance 临界值调整
        if (distance < 40) {
          this.triggerNearTips(obj, intersects[0].point);
        }
      }
    });

    this[triggerEvent]('onUpdate', this.interactObj);
    this.renderer.render(this.scene, this.camera);
  }

  animation() {
    this.stats.update();
    this.controls && this.controls.update();
    this.animationId = requestAnimationFrame(this.animation.bind(this));
  }

  triggerNearTips(obj) {
    const userData = obj.userData;
    if (userData.hasTrigged) {
      return;
    }
    userData.hasTrigged = true;
    const { soundUrl } = userData;
    if (soundUrl) {
      this.audioLoader.load(soundUrl, (buffer) => {
        const sound = new THREE.PositionalAudio(this.audioListener);
        obj.add(sound);
        sound.setBuffer(buffer);
        sound.setRefDistance(10);
        sound.loop = true;
        sound.play();
      });
    }
  }

  outlineObj(selectedObjects) {
    // 物体边缘发光通道
    const outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      this.scene,
      this.camera,
      selectedObjects
    );
    outlinePass.selectedObjects = selectedObjects;
    outlinePass.edgeStrength = 10.0; // 边框的亮度
    outlinePass.edgeGlow = 1; // 光晕[0,1]
    outlinePass.usePatternTexture = false; // 是否使用父级的材质
    outlinePass.edgeThickness = 1.0; // 边框宽度
    outlinePass.downSampleRatio = 1; // 边框弯曲度
    outlinePass.pulsePeriod = 5; // 呼吸闪烁的速度
    outlinePass.visibleEdgeColor.set(0x00ff00); // 呼吸显示的颜色
    outlinePass.hiddenEdgeColor = new THREE.Color(0, 0, 0); // 呼吸消失的颜色
    outlinePass.clear = true;
    this.composer.addPass(outlinePass);
    // 自定义的着色器通道 作为参数
    const effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms.resolution.value.set(
      1 / this.container.offsetWidth,
      1 / this.container.offsetHeight
    );
    effectFXAA.renderToScreen = true;
    this.composer.addPass(effectFXAA);
  }

  setControllerEnable(b) {
    if (this.controls) {
      this.controls.enabled = !!b;
    }
  }

  export() {
    const exporter = new GLTFExporter();
    exporter.parse(this.scene, (result) => {
      // 将文件保存下来
      console.log(result);
      if (result instanceof ArrayBuffer) {
        this.saveArrayBuffer(result
          , 'city.glb');
      }
    }, () => { }, {
      binary: true,
      onlyVisible: true,
      trs: false
    });
  }

  saveArrayBuffer(buffer, filename) {
    const blob = new Blob([buffer], { type: 'application/octet-stream' }, filename);
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  rotateCamera(screenStartPoint, screenEndPoint) {
    // const screenStartPoint = new THREE.Box3().setFromObject(startObj)
    const cameraRotation = new THREE.Euler(0, 0, 0, 'YXZ');
    cameraRotation.setFromQuaternion(this.camera.quaternion);
    const offsetX = screenEndPoint.x - screenStartPoint.x;
    const offsetY = screenEndPoint.y - screenStartPoint.y;
    const yaw = offsetX / this.container.offsetWidth * Math.PI;
    const pitch = offsetY / this.container.offsetHeight * Math.PI;
    cameraRotation.y = cameraRotation.y + yaw;
    cameraRotation.x = cameraRotation.x + pitch;
    this.camera.quaternion.setFromEuler(cameraRotation);
    this.renderer.render(this.scene, this.camera);
  }

  release() {
    cancelAnimationFrame(this.animationId);
    this.controls.removeEvents();
    this.removeEvents();
    // TOOD 事件移除、场景释放
    this.scene.dispose();
  }
}

export default Scene;
