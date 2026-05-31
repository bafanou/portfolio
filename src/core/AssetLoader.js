import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import EventEmitter from './EventEmitter.js';

// =============================================================
//  AssetLoader — chargement centralisé (textures, modèles GLTF)
//  avec progression globale. Alimentera le Preloader (Phase 3).
//
//  Émet :
//    'progress' { url, loaded, total, ratio }
//    'loaded'   { items }
//    'error'    { url }
//
//  Usage :
//    const loader = new AssetLoader();
//    loader.on('progress', ({ ratio }) => preloader.set(ratio));
//    const items = await loader.load([
//      { key: 'heroNoise', type: 'texture', url: '/textures/noise.png' },
//      { key: 'logo',      type: 'gltf',    url: '/models/logo.glb' },
//    ]);
// =============================================================

export default class AssetLoader extends EventEmitter {
  constructor() {
    super();

    this.manager = new THREE.LoadingManager();
    this.textureLoader = new THREE.TextureLoader(this.manager);
    this.gltfLoader = new GLTFLoader(this.manager);

    this.items = {}; // résultats indexés par clé

    this.manager.onProgress = (url, loaded, total) => {
      this.emit('progress', { url, loaded, total, ratio: total ? loaded / total : 0 });
    };
    this.manager.onError = (url) => this.emit('error', { url });
  }

  // Charge une liste d'assets ; résout quand tout est prêt.
  load(assets = []) {
    return new Promise((resolve) => {
      if (assets.length === 0) {
        resolve(this.items);
        return;
      }

      // onLoad du manager se déclenche une fois TOUS les assets chargés.
      this.manager.onLoad = () => {
        this.emit('loaded', { items: this.items });
        resolve(this.items);
      };

      for (const asset of assets) {
        switch (asset.type) {
          case 'texture':
            this.textureLoader.load(asset.url, (texture) => {
              this.items[asset.key] = texture;
            });
            break;
          case 'gltf':
            this.gltfLoader.load(asset.url, (gltf) => {
              this.items[asset.key] = gltf;
            });
            break;
          default:
            this.emit('error', { url: asset.url });
            console.warn(`[AssetLoader] Type inconnu : ${asset.type}`);
        }
      }
    });
  }

  // Libère toutes les textures chargées.
  dispose() {
    for (const item of Object.values(this.items)) {
      if (item && item.isTexture) item.dispose();
    }
    this.items = {};
    super.destroy();
  }
}
