module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx}", // Aquí aseguras que Tailwind escanee tus archivos JSX
    ],
    theme: {
      extend: {
        screens: {
          'xs': {'max': '475px'}, // Breakpoint personalizado para pantallas muy pequeñas
        }
      },
    },
    plugins: [],
  }