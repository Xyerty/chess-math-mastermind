
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es';

interface Translation {
  [key: string]: string | string[];
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Translation> = {
  en: {
    // Navigation
    'nav.backToMenu': 'Back to Menu',
    'nav.newGame': 'New Game',
    
    // Main Menu
    'mainMenu.title': 'Chess Math',
    'mainMenu.subtitle': 'Mastermind',
    'mainMenu.description': 'Challenge your mind with chess moves that require solving math problems!',
    'mainMenu.playGame': 'Play Game',
    'mainMenu.howToPlay': 'How to Play',
    'mainMenu.settings': 'Settings',
    'mainMenu.statistics': 'Statistics',
    'mainMenu.footer': 'Think fast, move smart, solve math!',
    
    // Game
    'game.title': 'Chess Math Mastermind',
    'game.currentTurn': 'Current Turn',
    'game.gameStatus': 'Game Status',
    'game.timeRemaining': 'Time Remaining',
    'game.mathAccuracy': 'Math Accuracy',
    'game.gameActive': 'Game Active',
    'game.check': 'Check!',
    'game.checkmate': 'Checkmate!',
    'game.stalemate': 'Stalemate',
    'game.move': 'Move',
    
    // Game Controls
    'controls.title': 'Game Controls',
    'controls.newGame': 'New Game',
    'controls.pauseGame': 'Pause Game',
    'controls.getHint': 'Get Hint',
    'controls.resign': 'Resign',
    'controls.quickSettings': 'Quick Settings',
    'controls.gameSettings': 'Game Settings',
    'controls.howToPlay': 'How to Play',
    'controls.instruction1': '1. Click a chess piece to select it',
    'controls.instruction2': '2. Solve the math problem that appears',
    'controls.instruction3': '3. If correct, make your chess move',
    'controls.instruction4': '4. AI will respond with its move',
    'controls.instruction5': '5. Repeat until checkmate!',
    
    // Math Challenge
    'math.title': 'Math Challenge',
    'math.instruction': 'Solve this problem to make your move:',
    'math.enterAnswer': 'Enter your answer',
    'math.submitAnswer': 'Submit Answer',
    'math.checking': 'Checking...',
    'math.cancel': 'Cancel',
    'math.difficulty': 'Difficulty',
    'math.easy': 'easy',
    'math.medium': 'medium',
    'math.hard': 'hard',
    
    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.english': 'English',
    'settings.spanish': 'Spanish',
    'settings.comingSoon': 'Settings panel coming soon!',
    'settings.features': 'Here you\'ll be able to configure:',
    'settings.mathDifficulty': '• Math difficulty level',
    'settings.aiStrength': '• AI opponent strength',
    'settings.soundPrefs': '• Sound preferences',
    'settings.visualThemes': '• Visual themes',
    'settings.timeLimits': '• Time limits',
    
    // Tutorial
    'tutorial.title': 'How to Play',
    'tutorial.welcome': 'Welcome to Chess Math Mastermind!',
    'tutorial.description': 'This unique game combines chess strategy with mathematical problem-solving.',
    'tutorial.rulesTitle': 'Game Rules:',
    'tutorial.rule1': 'Click on any chess piece you want to move',
    'tutorial.rule2': 'A math problem will appear that you must solve',
    'tutorial.rule3': 'If you solve it correctly, you can make your chess move',
    'tutorial.rule4': 'If you fail, you lose your turn',
    'tutorial.rule5': 'The AI will then make its move',
    'tutorial.rule6': 'Continue until checkmate!',
    'tutorial.tipsTitle': 'Tips for Success:',
    'tutorial.tip1': 'Practice mental math to solve problems quickly',
    'tutorial.tip2': 'Think about your chess strategy before clicking pieces',
    'tutorial.tip3': 'Use the hint system when you\'re stuck',
    'tutorial.tip4': 'Start with easier difficulty levels',
    
    // Statistics
    'stats.title': 'Statistics',
    'stats.comingSoon': 'Statistics dashboard coming soon!',
    'stats.features': 'Here you\'ll be able to view:',
    'stats.gamesWonLost': '• Games won/lost',
    'stats.mathAccuracy': '• Math problem accuracy',
    'stats.averageTime': '• Average solving time',
    'stats.chessOpenings': '• Favorite chess openings',
    'stats.progressTime': '• Progress over time'
  },
  es: {
    // Navegación
    'nav.backToMenu': 'Volver al Menú',
    'nav.newGame': 'Nueva Partida',
    
    // Menú Principal
    'mainMenu.title': 'Ajedrez Matemático',
    'mainMenu.subtitle': 'Maestro',
    'mainMenu.description': '¡Desafía tu mente con movimientos de ajedrez que requieren resolver problemas matemáticos!',
    'mainMenu.playGame': 'Jugar',
    'mainMenu.howToPlay': 'Cómo Jugar',
    'mainMenu.settings': 'Configuración',
    'mainMenu.statistics': 'Estadísticas',
    'mainMenu.footer': '¡Piensa rápido, mueve inteligente, resuelve matemáticas!',
    
    // Juego
    'game.title': 'Maestro del Ajedrez Matemático',
    'game.currentTurn': 'Turno Actual',
    'game.gameStatus': 'Estado del Juego',
    'game.timeRemaining': 'Tiempo Restante',
    'game.mathAccuracy': 'Precisión Matemática',
    'game.gameActive': 'Juego Activo',
    'game.check': '¡Jaque!',
    'game.checkmate': '¡Jaque Mate!',
    'game.stalemate': 'Ahogado',
    'game.move': 'Movimiento',
    
    // Controles del Juego
    'controls.title': 'Controles del Juego',
    'controls.newGame': 'Nueva Partida',
    'controls.pauseGame': 'Pausar Juego',
    'controls.getHint': 'Obtener Pista',
    'controls.resign': 'Rendirse',
    'controls.quickSettings': 'Configuración Rápida',
    'controls.gameSettings': 'Configuración del Juego',
    'controls.howToPlay': 'Cómo Jugar',
    'controls.instruction1': '1. Haz clic en una pieza de ajedrez para seleccionarla',
    'controls.instruction2': '2. Resuelve el problema matemático que aparece',
    'controls.instruction3': '3. Si es correcto, haz tu movimiento de ajedrez',
    'controls.instruction4': '4. La IA responderá con su movimiento',
    'controls.instruction5': '5. ¡Repite hasta el jaque mate!',
    
    // Desafío Matemático
    'math.title': 'Desafío Matemático',
    'math.instruction': 'Resuelve este problema para hacer tu movimiento:',
    'math.enterAnswer': 'Introduce tu respuesta',
    'math.submitAnswer': 'Enviar Respuesta',
    'math.checking': 'Verificando...',
    'math.cancel': 'Cancelar',
    'math.difficulty': 'Dificultad',
    'math.easy': 'fácil',
    'math.medium': 'medio',
    'math.hard': 'difícil',
    
    // Configuración
    'settings.title': 'Configuración',
    'settings.language': 'Idioma',
    'settings.english': 'Inglés',
    'settings.spanish': 'Español',
    'settings.comingSoon': '¡Panel de configuración próximamente!',
    'settings.features': 'Aquí podrás configurar:',
    'settings.mathDifficulty': '• Nivel de dificultad matemática',
    'settings.aiStrength': '• Fuerza del oponente IA',
    'settings.soundPrefs': '• Preferencias de sonido',
    'settings.visualThemes': '• Temas visuales',
    'settings.timeLimits': '• Límites de tiempo',
    
    // Tutorial
    'tutorial.title': 'Cómo Jugar',
    'tutorial.welcome': '¡Bienvenido al Maestro del Ajedrez Matemático!',
    'tutorial.description': 'Este juego único combina la estrategia del ajedrez con la resolución de problemas matemáticos.',
    'tutorial.rulesTitle': 'Reglas del Juego:',
    'tutorial.rule1': 'Haz clic en cualquier pieza de ajedrez que quieras mover',
    'tutorial.rule2': 'Aparecerá un problema matemático que debes resolver',
    'tutorial.rule3': 'Si lo resuelves correctamente, puedes hacer tu movimiento de ajedrez',
    'tutorial.rule4': 'Si fallas, pierdes tu turno',
    'tutorial.rule5': 'La IA hará su movimiento',
    'tutorial.rule6': '¡Continúa hasta el jaque mate!',
    'tutorial.tipsTitle': 'Consejos para el Éxito:',
    'tutorial.tip1': 'Practica cálculo mental para resolver problemas rápidamente',
    'tutorial.tip2': 'Piensa en tu estrategia de ajedrez antes de hacer clic en las piezas',
    'tutorial.tip3': 'Usa el sistema de pistas cuando estés atascado',
    'tutorial.tip4': 'Comienza con niveles de dificultad más fáciles',
    
    // Estadísticas
    'stats.title': 'Estadísticas',
    'stats.comingSoon': '¡Panel de estadísticas próximamente!',
    'stats.features': 'Aquí podrás ver:',
    'stats.gamesWonLost': '• Partidas ganadas/perdidas',
    'stats.mathAccuracy': '• Precisión en problemas matemáticos',
    'stats.averageTime': '• Tiempo promedio de resolución',
    'stats.chessOpenings': '• Aperturas de ajedrez favoritas',
    'stats.progressTime': '• Progreso a lo largo del tiempo'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const value = translations[language][key];
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
