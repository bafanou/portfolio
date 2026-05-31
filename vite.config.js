import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import { fileURLToPath, URL } from 'node:url';

// Configuration Vite — point central du build.
// - vite-plugin-glsl : permet d'importer les fichiers .glsl comme des chaînes.
// - alias '@' : raccourci vers /src pour des imports propres.
export default defineConfig({
  plugins: [
    // Importe les shaders .glsl / .vert / .frag et résout les #include.
    glsl({
      include: ['**/*.glsl', '**/*.vert', '**/*.frag'],
      compress: false, // garde les commentaires en dev (compressés en build auto)
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // API moderne de Dart Sass (évite les avertissements de dépréciation).
        api: 'modern-compiler',
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
