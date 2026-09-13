/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        freedom: {
          bg: '#FFFFFF',
          surface: '#FAFAFA',
          'surface-raised': '#FFFFFF',
          border: '#E5E5E5',
          'text-primary': '#111111',
          'text-secondary': '#6B6B6B',
          'text-tertiary': '#A3A3A3',
          accent: '#2F6FED',
          'accent-soft': '#EAF1FE',
          success: '#1FAE6B',
          warning: '#E8A33D',
          danger: '#E5484D',
          dark: {
            bg: '#121212',
            surface: '#1A1A1A',
            'text-primary': '#FFFFFF',
            'text-secondary': '#B0B0B0',
            border: '#2A2A2A',
          },
          heatmap: {
            0: '#F0F0F0',
            1: '#C9DCFB',
            2: '#8FB8F6',
            3: '#4C87EE',
            4: '#2F6FED',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'retro-window': '0 20px 40px -15px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.08)',
        'retro-window-hover': '0 30px 60px -15px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1)',
        'pill': '0 4px 14px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
