[Read in Spanish 🇪🇸](#-versión-en-español)

# 🎯 Advanced Chess Application 🤖✨

Welcome to the Advanced Chess Application! This project, creatively designed and developed with the assistance of Artificial Intelligence 🧠, is a modern, feature-rich chess experience. Built with React, TypeScript, and advanced AI capabilities, it allows you to play against intelligent AI opponents, get strategic hints, and improve your chess skills with multiple game modes.

![Chess App Screenshot](https://images.unsplash.com/photo-1528819622765-d6bcf132ac11?w=800&h=400&fit=crop)

## ✨ Features

### 🎮 **Core Gameplay**
- **Full Chess Implementation**: Complete rule set including castling, en passant, and pawn promotion.
- **Multiple Game Modes**: 
  - Classic (10 minutes per side)
  - Speed Chess (3 minutes + 2 second increment)
  - Math Master (solve math problems before moves)
- **AI Opponents**: Three difficulty levels (Easy, Medium, Hard).
- **Human vs Human**: Local multiplayer support.

### 🧠 **Advanced AI System**
- **Dual Engine Architecture**: Features a JavaScript AI engine (always available) and Python Stockfish integration (for development mode).
- **Intelligent Hints**: Get strategic advice and best move suggestions.
- **Position Analysis**: Evaluation, threats, and opportunities.
- **Adaptive Difficulty**: AI adjusts to provide an optimal challenge.

### 🎨 **User Experience**
- **Responsive Design**: Optimized for desktop, tablet, and mobile.
- **Dark/Light Themes**: Automatic theme switching.
- **Multi-language Support**: English and Spanish.
- **Interactive Board**: Smooth animations and visual feedback.
- **Move History**: Complete game notation and replay.
- **Game Statistics**: Track your progress and improvement.

### 🔧 **Technical Features**
- Real-time updates, robust error handling, performance optimization, and accessibility features (screen reader support, keyboard navigation).

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd chess-app

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```
The application will be available at `http://localhost:8080`.

### Optional: Python AI Engine (Development)
For enhanced AI capabilities during development, you can run the Python chess engine:
```bash
# Navigate to the Python engine directory
cd python_engine

# Install Python dependencies
pip install -r requirements.txt

# Start the engine
python app.py
```

## 📖 How to Play

### Getting Started
1. **Choose Game Mode**: Select Classic, Speed, or Math Master.
2. **Select Difficulty**: Pick Easy, Medium, or Hard.
3. **Start Playing**: Click pieces to select and move.

### Game Controls
- **New Game**: Reset the board.
- **Hint System**: Get AI-powered strategic advice.
- **Resign**: Concede the game.
- **Move History**: Review played moves.

### Hint System Details
- **Easy**: Unlimited hints.
- **Medium**: 5 hints per game.
- **Hard**: 3 hints per game.
- **Speed**: 1 hint per game.
- Each hint provides: suggested best move, position evaluation, strategic advice, and threat/opportunity analysis.

## 🏗️ Architecture

Summarized: The frontend uses React 18, TypeScript, Vite, Tailwind CSS, and shadcn/ui. State management is handled by React Context, custom hooks, and React Query. AI integration involves a JavaScript engine and an optional Python Stockfish engine, with a fallback system.

## 📁 Project Structure

Summarized: The `src/` directory contains components (including shadcn/ui), contexts, chess game logic, hooks, pages, services, and utility functions.

```
src/
├── components/
├── contexts/
├── features/chess/
├── hooks/
├── pages/
├── services/
└── utils/
```

## 🚢 Deployment

Summarized: Optimized for Vercel. Build with `npm run build` and deploy using `npx vercel`. Configure with Vite framework, `dist` output, and Node 18.x. Optional `VITE_SENTRY_DSN` for error tracking.

## 🧪 Development

### Key Scripts
- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm test`: Run test suite.

## 🔒 Security

Summarized: Regular dependency updates (Dependabot), Snyk security scanning, CSP headers, input validation and sanitization.

## 🤝 Contributing

We welcome contributions!
1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.
Please write tests, follow TypeScript best practices, use semantic commit messages, and update documentation.

## 📊 Performance

Summarized: Aims for small bundle size (~800KB gzipped), fast FCP (<1.5s), quick TTI (<2.5s), and high Lighthouse scores (95+).

## 🐛 Troubleshooting

### Common Issues & Help
- **Build Fails**: Ensure dependencies are installed (`npm install`), try clearing cache.
- **AI Not Working**: Check console, verify Python engine (dev only), check network.
- **Performance**: Check console, disable extensions, clear browser cache.
- For more help, check existing GitHub Issues or create a new one with details.

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## 🙏 Acknowledgments

- Chess piece designs inspired by classic Staunton sets.
- AI algorithms based on modern chess engine techniques.
- Icons by [Lucide React](https://lucide.dev/).
- UI components from [shadcn/ui](https://ui.shadcn.com/).

---

**Built with ❤️ using modern web technologies**

---
## 🇪🇸 Versión en Español

# 🎯 Aplicación de Ajedrez Avanzada 🤖✨

¡Bienvenido a la Aplicación de Ajedrez Avanzada! Este proyecto, diseñado y desarrollado creativamente con la ayuda de Inteligencia Artificial 🧠, es una experiencia de ajedrez moderna y rica en funciones. Construido con React, TypeScript y capacidades avanzadas de IA, te permite jugar contra oponentes de IA inteligentes, obtener pistas estratégicas y mejorar tus habilidades de ajedrez con múltiples modos de juego.

![Captura de Pantalla de la App de Ajedrez](https://images.unsplash.com/photo-1528819622765-d6bcf132ac11?w=800&h=400&fit=crop)

## ✨ Características

### 🎮 **Jugabilidad Principal**
- **Implementación Completa de Ajedrez**: Conjunto de reglas completo incluyendo enroque, captura al paso y promoción de peón.
- **Múltiples Modos de Juego**:
  - Clásico (10 minutos por lado)
  - Ajedrez Rápido (3 minutos + 2 segundos de incremento)
  - Maestro de Matemáticas (resuelve problemas matemáticos antes de mover)
- **Oponentes de IA**: Tres niveles de dificultad (Fácil, Medio, Difícil).
- **Humano vs Humano**: Soporte para multijugador local.

### 🧠 **Sistema de IA Avanzado**
- **Arquitectura de Motor Dual**: Cuenta con un motor de IA en JavaScript (siempre disponible) e integración con Python Stockfish (para modo de desarrollo).
- **Pistas Inteligentes**: Obtén consejos estratégicos y sugerencias de mejores movimientos.
- **Análisis de Posición**: Evaluación, amenazas y oportunidades.
- **Dificultad Adaptativa**: La IA se ajusta para proporcionar un desafío óptimo.

### 🎨 **Experiencia de Usuario**
- **Diseño Responsivo**: Optimizado para escritorio, tableta y móvil.
- **Temas Oscuro/Claro**: Cambio automático de tema.
- **Soporte Multilingüe**: Inglés y Español.
- **Tablero Interactivo**: Animaciones fluidas y retroalimentación visual.
- **Historial de Movimientos**: Notación completa del juego y repetición.
- **Estadísticas del Juego**: Sigue tu progreso y mejora.

### 🔧 **Características Técnicas**
- Actualizaciones en tiempo real, manejo robusto de errores, optimización del rendimiento y características de accesibilidad (soporte para lector de pantalla, navegación por teclado).

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- npm, yarn, o pnpm

### Instalación

```bash
# Clona el repositorio
git clone <url-del-repositorio>
cd chess-app

# Instala las dependencias
npm install
# o
pnpm install

# Inicia el servidor de desarrollo
npm run dev
# o
pnpm dev
```
La aplicación estará disponible en `http://localhost:8080`.

### Opcional: Motor de IA en Python (Desarrollo)
Para capacidades de IA mejoradas durante el desarrollo, puedes ejecutar el motor de ajedrez en Python:
```bash
# Navega al directorio del motor de Python
cd python_engine

# Instala las dependencias de Python
pip install -r requirements.txt

# Inicia el motor
python app.py
```

## 📖 Cómo Jugar

### Para Empezar
1. **Elige el Modo de Juego**: Selecciona Clásico, Rápido o Maestro de Matemáticas.
2. **Selecciona la Dificultad**: Elige Fácil, Medio o Difícil.
3. **Comienza a Jugar**: Haz clic en las piezas para seleccionarlas y moverlas.

### Controles del Juego
- **Nueva Partida**: Reinicia el tablero.
- **Sistema de Pistas**: Obtén consejos estratégicos impulsados por IA.
- **Rendirse**: Abandona la partida actual.
- **Historial de Movimientos**: Revisa los movimientos jugados.

### Detalles del Sistema de Pistas
- **Fácil**: Pistas ilimitadas.
- **Medio**: 5 pistas por partida.
- **Difícil**: 3 pistas por partida.
- **Rápido**: 1 pista por partida.
- Cada pista proporciona: mejor movimiento sugerido, evaluación de la posición, consejo estratégico y análisis de amenazas/oportunidades.

## 🏗️ Arquitectura

Resumido: El frontend utiliza React 18, TypeScript, Vite, Tailwind CSS y shadcn/ui. La gestión del estado se maneja con React Context, hooks personalizados y React Query. La integración de IA incluye un motor JavaScript y un motor Python Stockfish opcional, con un sistema de respaldo.

## 📁 Estructura del Proyecto

Resumido: El directorio `src/` contiene componentes (incluyendo shadcn/ui), contextos, lógica del juego de ajedrez, hooks, páginas, servicios y funciones de utilidad.

```
src/
├── components/
├── contexts/
├── features/chess/
├── hooks/
├── pages/
├── services/
└── utils/
```

## 🚢 Despliegue

Resumido: Optimizado para Vercel. Compila con `npm run build` y despliega usando `npx vercel`. Configura con el framework Vite, directorio de salida `dist` y Node 18.x. `VITE_SENTRY_DSN` opcional para seguimiento de errores.

## 🧪 Desarrollo

### Scripts Clave
- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Compila para producción.
- `npm run test`: Ejecuta la suite de pruebas.

## 🔒 Seguridad

Resumido: Actualizaciones regulares de dependencias (Dependabot), escaneo de seguridad con Snyk, cabeceras CSP, validación y sanitización de entradas.

## 🤝 Contribuciones

¡Aceptamos contribuciones!
1. Haz un fork del repositorio.
2. Crea una rama para tu nueva característica.
3. Confirma tus cambios.
4. Sube tu rama.
5. Abre un Pull Request.
Por favor, escribe pruebas, sigue las mejores prácticas de TypeScript, usa mensajes de commit semánticos y actualiza la documentación.

## 📊 Rendimiento

Resumido: Busca un tamaño de paquete pequeño (~800KB gzipped), FCP rápido (<1.5s), TTI rápido (<2.5s) y altas puntuaciones de Lighthouse (95+).

## 🐛 Resolución de Problemas

### Problemas Comunes y Ayuda
- **Fallos de Compilación**: Asegúrate de que las dependencias estén instaladas (`npm install`), intenta limpiar la caché.
- **IA No Funciona**: Revisa la consola, verifica el motor de Python (solo desarrollo), revisa la red.
- **Rendimiento**: Revisa la consola, deshabilita extensiones, limpia la caché del navegador.
- Para más ayuda, revisa los Issues de GitHub existentes o crea uno nuevo con detalles.

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- Diseños de piezas de ajedrez inspirados en los conjuntos clásicos Staunton.
- Algoritmos de IA basados en técnicas modernas de motores de ajedrez.
- Iconos proporcionados por [Lucide React](https://lucide.dev/).
- Componentes de UI de [shadcn/ui](https://ui.shadcn.com/).

---

**Construido con ❤️ usando tecnologías web modernas**
