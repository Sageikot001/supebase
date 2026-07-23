// Supabase-inspired dark theme
export const theme = {
  colors: {
    // Brand
    brand: '#3ECF8E',
    brandLight: '#4FF5A8',
    brandDark: '#2EA872',

    // Backgrounds
    bg: {
      primary: '#171717',
      secondary: '#1C1C1C',
      tertiary: '#232323',
      elevated: '#2A2A2A',
      overlay: 'rgba(0, 0, 0, 0.6)',
    },

    // Borders
    border: {
      default: '#2E2E2E',
      light: '#3E3E3E',
      focus: '#3ECF8E',
    },

    // Text
    text: {
      primary: '#EDEDED',
      secondary: '#8F8F8F',
      tertiary: '#5E5E5E',
      inverse: '#171717',
      brand: '#3ECF8E',
    },

    // Status
    status: {
      success: '#3ECF8E',
      warning: '#F5A623',
      error: '#F56565',
      info: '#3B82F6',
      online: '#3ECF8E',
      offline: '#6B6B6B',
    },

    // Syntax highlighting (for SQL editor)
    syntax: {
      keyword: '#C792EA',
      string: '#C3E88D',
      number: '#F78C6C',
      function: '#82AAFF',
      comment: '#5E5E5E',
      operator: '#89DDFF',
      table: '#FFCB6B',
    },

    // Legacy compatibility (flat values for old components)
    primary: '#3ECF8E',
    primaryHover: '#4FF5A8',
    secondary: '#8F8F8F',
    accent: '#3ECF8E',
    accentHover: '#4FF5A8',
    background: '#171717',
    backgroundAlt: '#1C1C1C',
    borderColor: '#2E2E2E',
    textColor: '#EDEDED',
    textMuted: '#8F8F8F',
    success: '#3ECF8E',
    error: '#F56565',
    popular: '#3ECF8E',
    bestValue: '#F5A623',
  },

  fonts: {
    sans: '"Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"Source Code Pro", Menlo, Monaco, "Courier New", monospace',
  },

  fontSizes: {
    xs: '11px',
    sm: '13px',
    md: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '48px',
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
    '4xl': '64px',
    xxl: '48px',
  },

  radii: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '9999px',
  },

  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
  },

  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.4)',
    md: '0 4px 6px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.5)',
    glow: '0 0 20px rgba(62, 207, 142, 0.3)',
  },

  transitions: {
    fast: '0.1s ease',
    normal: '0.2s ease',
    slow: '0.3s ease',
  },

  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
};

export type Theme = typeof theme;
