/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        forest: {
          50: '#f0faf4',
          100: '#dcf5e7',
          200: '#baebd0',
          300: '#87d9ae',
          400: '#4dbf84',
          500: '#28a262',
          600: '#1a834e',
          700: '#166840',
          800: '#145335',
          900: '#12452d',
          950: '#082619',
        },
        sage: {
          50: '#f4f8f5',
          100: '#e6f0e9',
          200: '#cde1d4',
          300: '#a5c9b3',
          400: '#75ab8c',
          500: '#528e6e',
          600: '#3f7258',
          700: '#345c48',
          800: '#2b4a3b',
          900: '#253d31',
        },
        carbon: {
          50: '#f5f7f6',
          100: '#e8ede9',
          200: '#d0dbd2',
          300: '#aebfb1',
          400: '#849e89',
          500: '#65826b',
          600: '#4f6854',
          700: '#405443',
          800: '#364538',
          900: '#2e3a30',
        }
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0f4c2a 0%, #1a7a4a 40%, #2da870 70%, #4dbf84 100%)',
        'card-gradient': 'linear-gradient(145deg, #ffffff 0%, #f4f8f5 100%)',
      },
      boxShadow: {
        'hero': '0 25px 60px -10px rgba(15, 76, 42, 0.35)',
        'card': '0 4px 20px -4px rgba(26, 131, 78, 0.12)',
        'card-hover': '0 8px 30px -4px rgba(26, 131, 78, 0.2)',
        'metric': '0 2px 12px -2px rgba(15, 76, 42, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
