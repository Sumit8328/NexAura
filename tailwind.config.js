/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#060a12',
          900: '#0b1120',
          850: '#0f172a',
          800: '#141e33',
          750: '#1a2642',
          700: '#243356',
          600: '#334774',
        },
        cyan: {
          glow: '#00f0ff',
          dim: 'rgba(0, 240, 255, 0.12)',
          accent: '#06b6d4',
          subtle: '#0891b2',
        },
        hazard: {
          amber: '#f59e0b',
          amberGlow: 'rgba(245, 158, 11, 0.15)',
          red: '#f43f5e',
          redGlow: 'rgba(244, 63, 94, 0.18)',
          emerald: '#10b981',
          emeraldGlow: 'rgba(16, 185, 129, 0.15)',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px -3px rgba(0, 240, 255, 0.25)',
        'cyan-sm': '0 0 10px -2px rgba(0, 240, 255, 0.3)',
        'red-glow': '0 0 20px -3px rgba(244, 63, 94, 0.3)',
        'amber-glow': '0 0 20px -3px rgba(245, 158, 11, 0.25)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(rgba(0, 240, 255, 0.08) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
