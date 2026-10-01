export const colors = {
  primary: '#6D3AE6',
  primaryDark: '#5124C4',
  primarySoft: '#F1EBFF',
  accent: '#FF6B73',
  accentSoft: '#FFF0F0',
  ink: '#17131F',
  text: '#2A2533',
  textSecondary: '#777181',
  textMuted: '#A49EAC',
  background: '#F7F5F8',
  surface: '#FFFFFF',
  surfaceMuted: '#F1EFF3',
  border: '#E7E2EA',
  success: '#1D9B66',
  successSoft: '#E9F8F1',
  warning: '#F29D38',
  warningSoft: '#FFF6E8',
  danger: '#D9414B',
  dangerSoft: '#FDECEE',
  white: '#FFFFFF',
  black: '#000000',
  scrim: 'rgba(21, 16, 29, 0.52)',
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export const shadow = {
  card: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
} as const;
