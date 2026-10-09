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
        // Theme surfaces
        midnight: {
          950: '#0B1220', // Main background
          900: '#141F30', // Card and panel surfaces
          850: '#1B293B', // Secondary surfaces
          800: '#202E42', // Interactive hover surface
          750: '#263449', // Subtle slate border tone
          700: '#263449', // Harmonized border tone
          600: '#33435C',
        },
        // Slate typography and subtle neutral borders
        slate: {
          50: '#FFFFFF',
          100: '#F8FAFC', // Primary text
          200: '#F1F5F9',
          300: '#CBD5E1',
          400: '#94A3B8', // Secondary text
          500: '#64748B',
          600: '#475569',
          700: '#263449', // Subtle border
          800: '#1B293B', // Secondary surface
          900: '#141F30', // Card surface
          950: '#0B1220', // Background
        },
        // Accents
        accent: {
          primary: '#55E6C1',   // Futuristic electric mint/cyan
          secondary: '#38BDF8', // Tactical sky blue
          warning: '#FBBF24',   // Warning amber
          alert: '#F87171',     // Critical alert soft crimson
          border: '#263449',    // Slate border
        },
        // Aliases to seamlessly adapt existing classes
        cyan: {
          50: '#E6FAF5',
          100: '#C7F5EC',
          200: '#9CECDD',
          300: '#6EE2CC',
          400: '#55E6C1', // Primary accent
          500: '#55E6C1',
          600: '#2DD4BF',
          glow: '#55E6C1',
          dim: 'rgba(85, 230, 193, 0.12)',
          accent: '#55E6C1',
          subtle: '#38BDF8',
        },
        sky: {
          400: '#38BDF8',
          500: '#38BDF8',
        },
        rose: {
          400: '#F87171',
          500: '#F87171',
          600: '#EF4444',
        },
        amber: {
          400: '#FBBF24',
          500: '#FBBF24',
          600: '#F59E0B',
        },
        emerald: {
          400: '#55E6C1',
          500: '#55E6C1',
          600: '#2DD4BF',
        },
        hazard: {
          amber: '#FBBF24',
          amberGlow: 'rgba(251, 191, 36, 0.15)',
          red: '#F87171',
          redGlow: 'rgba(248, 113, 113, 0.18)',
          emerald: '#55E6C1',
          emeraldGlow: 'rgba(85, 230, 193, 0.15)',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 16px -2px rgba(85, 230, 193, 0.25)',
        'cyan-sm': '0 0 8px -2px rgba(85, 230, 193, 0.3)',
        'red-glow': '0 0 16px -2px rgba(248, 113, 113, 0.25)',
        'amber-glow': '0 0 16px -2px rgba(251, 191, 36, 0.22)',
        'card': '0 4px 16px -2px rgba(5, 10, 20, 0.6)',
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(rgba(85, 230, 193, 0.06) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
