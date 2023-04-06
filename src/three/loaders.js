import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export const createGLTFLoader =  (decoderPath)=>{
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(decoderPath);
    dracoLoader.preload();
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    return gltfLoader;
}