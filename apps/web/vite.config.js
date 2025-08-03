// vite.config.js
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),  // Configuración del alias
    },
  },
  build: {
    // Optimizaciones de build
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor chunks para mejor caching
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Separar chunks por roles para lazy loading más eficiente
          admin: [
            './src/roles/admin/pages/EmployeeManagement/EmployeeManagement',
            './src/roles/admin/pages/Projects/Projects',
            './src/roles/admin/pages/WorkTeam/WorkTeam'
          ],
          portfolio: [
            './src/roles/portfolio/pages/Projects/Projects',
            './src/roles/portfolio/pages/Performance/PerformancePortfolio'
          ],
          employee: [
            './src/roles/employee/pages/Activities/Activities',
            './src/roles/employee/pages/Projects/Projects'
          ],
          supervisor: [
            './src/roles/supervisor/pages/Employees/Employees',
            './src/roles/supervisor/pages/Projects/Projects'
          ]
        }
      }
    },
    // Optimizaciones de chunking
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    // Pre-bundle dependencies para desarrollo más rápido
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-hot-toast'
    ]
  },
  server: {
    // Configuraciones del servidor de desarrollo
    hmr: {
      overlay: false // Deshabilitar overlay de errores para mejor rendimiento
    }
  }
});