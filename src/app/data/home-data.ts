import { GameColor } from './games';

export type FeatureIcon = 'GAMEPAD' | 'FREE' | 'TROPHY' | 'ROCKET';

export const FEATURES: readonly { icon: FeatureIcon; title: string; desc: string; color: GameColor }[] = [
  { icon: 'GAMEPAD', title: 'JUEGOS CLÁSICOS', desc: 'Arkanoid, Tetris, Snake y muchos más. Los mejores arcades de todos los tiempos en un solo lugar.', color: 'cyan' },
  { icon: 'FREE', title: '100% GRATIS', desc: 'Sin suscripciones, sin pagos ocultos. Todos los juegos disponibles de forma gratuita.', color: 'yellow' },
  { icon: 'TROPHY', title: 'LADDER BOARDS', desc: 'Compite con jugadores de todo el mundo. Escala el ranking y demuestra quién es el mejor.', color: 'magenta' },
  { icon: 'ROCKET', title: 'SIEMPRE CRECIENDO', desc: 'Agregamos nuevos juegos constantemente. Vuelve seguido, siempre habrá algo nuevo que jugar.', color: 'green' },
];

export const STATS = [
  { n: '12+', u: 'JUEGOS', s: 'Y CONTANDO' },
  { n: 'MILES', u: 'DE PARTIDAS', s: 'JUGADAS CADA DÍA' },
  { n: 'GLOBAL', u: 'RANKING', s: 'COMPITE CON EL MUNDO' },
] as const;

export const TICKER: readonly { p: string; g: string; s: number; t: string; c: GameColor }[] = [
  { p: 'NEONFOX', g: 'Caída', s: 184220, t: 'hace 2 min', c: 'magenta' },
  { p: 'PX_KAI', g: 'Glotón', s: 96400, t: 'hace 5 min', c: 'yellow' },
  { p: 'Z3R0COOL', g: 'Invasores', s: 54190, t: 'hace 8 min', c: 'green' },
  { p: 'VAULT_07', g: 'Rocas', s: 41200, t: 'hace 12 min', c: 'cyan' },
  { p: 'GLITCHA', g: 'Bloque Buster', s: 28450, t: 'hace 18 min', c: 'cyan' },
  { p: 'ARKADYA', g: 'Serpentina', s: 7820, t: 'hace 24 min', c: 'green' },
  { p: 'CYBER_LU', g: 'Ranaria', s: 18900, t: 'hace 31 min', c: 'yellow' },
];

export const TOP_PLAYERS = [
  { r: 1, p: 'NEONFOX', s: 312840 },
  { r: 2, p: 'PX_KAI', s: 248110 },
  { r: 3, p: 'M00NRYU', s: 196720 },
  { r: 4, p: 'VAULT_07', s: 154300 },
  { r: 5, p: 'GLITCHA', s: 138900 },
] as const;

export const PRICE_PERKS = [
  'Acceso a todos los juegos',
  'Ranking global y salón de la fama',
  'Sin anuncios entre partidas',
  'Guarda tus puntuaciones',
  'Nuevos juegos cada mes',
  'Funciona en cualquier navegador',
] as const;

export const FAQ = [
  { q: '¿REALMENTE ES GRATIS?', a: 'Sí. Arcade Vault es un proyecto sin fines de lucro hecho por amor a los clásicos. No hay versión "premium" escondida.' },
  { q: '¿NECESITO CREAR CUENTA?', a: 'No. Puedes jugar como invitado. Si quieres guardar tu puntuación y aparecer en el ranking, regístrate en 10 segundos.' },
  { q: '¿CÓMO SOBREVIVEN SIN COBRAR?', a: 'Es un proyecto comunitario. Si te gusta, compártelo. Esa es toda la moneda que aceptamos.' },
] as const;
