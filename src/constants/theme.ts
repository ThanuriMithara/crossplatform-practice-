export const THEME = {
  colors: {
    primary: '#6366F1', // Vibrant Indigo
    primaryDark: '#4F46E5',
    primaryLight: '#818CF8',
    primaryGradient: ['#6366F1', '#8B5CF6'],
    secondary: '#8B5CF6', // Purple
    accent: '#EC4899', // Pink
    success: '#10B981', // Emerald
    warning: '#F59E0B', // Amber
    danger: '#EF4444', // Red
    dangerLight: '#FEE2E2',
    
    // Backgrounds
    background: '#0B0F19',
    backgroundLight: '#F8FAFC',
    card: '#161F30',
    cardElevated: '#1E293B',
    cardBorder: '#27354E',
    inputBg: '#131B2A',
    
    // Text colors
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textDark: '#0F172A',
    textDarkSecondary: '#475569',
    white: '#FFFFFF',
    black: '#000000',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.7)',
    chipBg: '#1E293B',
    chipActive: '#6366F1',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    title: 28,
    header: 32,
  },
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    button: {
      shadowColor: '#6366F1',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 6,
    },
  },
};

export const CATEGORIES = [
  { id: 'All', name: 'All Events', icon: 'sparkles' },
  { id: 'Tech', name: 'Technology', icon: 'laptop' },
  { id: 'Music', name: 'Concerts & Music', icon: 'musical-notes' },
  { id: 'Arts', name: 'Arts & Culture', icon: 'color-palette' },
  { id: 'Sports', name: 'Sports & Fitness', icon: 'football' },
  { id: 'Food', name: 'Food & Drinks', icon: 'restaurant' },
  { id: 'Business', name: 'Business', icon: 'briefcase' },
  { id: 'Education', name: 'Workshops', icon: 'school' },
] as const;
