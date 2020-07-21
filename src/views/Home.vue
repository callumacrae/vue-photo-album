<template>
  <div>
    <canvas ref="canvas" @mousemove="handleMousemove"></canvas>
    <!-- <GlobalEvents target="window" @resize="init" /> -->
  </div>
</template>

<script type="ts">
import * as THREE from 'three';
import Book from '../components/book';

export default {
  data: () => ({
    status: 'playing',
    mousePosition: { x: -1, y: -1 },
    width: undefined,
    height: undefined
  }),
  mounted() {
    this.init();
    this.frame();
  },
  beforeUnmount() {
    cancelAnimationFrame(this.frameId);
  },
  methods: {
    setSize() {
      const canvas = this.$refs.canvas;
      this.width = canvas.clientWidth;
      this.height = canvas.clientHeight;

      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    },
    init() {
      const canvas = this.$refs.canvas;
      const renderer = new THREE.WebGLRenderer({ canvas });
      this.renderer = renderer;

      this.setSize();

      const camera = new THREE.PerspectiveCamera(
        30,
        this.width / this.height,
        0.01,
        100
      );
      camera.position.z = 10;
      this.camera = camera;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x66667d);
      this.scene = scene;

      const book = new Book();
      this.book = book;
      scene.add(book.getGroup());

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.45);
      directionalLight.position.z = 5;
      this.directionalLight = directionalLight;
      scene.add(directionalLight);
    },
    frame(timestamp = 0) {
      this.frameId = requestAnimationFrame(this.frame);

      if (this.status !== 'playing') {
        return;
      }

      const t = timestamp / 1e3;
      const {
        width, height, renderer, scene, camera, book, directionalLight, mousePosition
      } = this;

      book.update(t);

      if (mousePosition.x !== -1) {
        const u = mousePosition.x / width;
        const v = mousePosition.y / height;

        // @TODO easings?
        const posX = u * 2 - 1;
        const posY = v * -2 + 1;

        camera.position.x = posX;
        camera.position.y = posY;
        camera.lookAt(0, 0, 0);

        directionalLight.position.x = posX;
        directionalLight.position.y = posY;
        directionalLight.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    },
    handleMousemove(e) {
      this.mousePosition = { x: e.pageX, y: e.pageY };
    }
  },
  computed: {
    uvFactor() {
      return Math.min(this.width, this.height);
    }
  }
};
</script>

<style scoped>
canvas {
  width: 100vw;
  height: 100vh;
}
</style>
