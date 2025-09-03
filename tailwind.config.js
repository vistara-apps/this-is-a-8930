/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(210 40% 96.1%)',
        text: 'hsl(215 16.4% 28.4%)',
        accent: 'hsl(242 69.1% 60.9%)',
        primary: 'hsl(220 89.8% 52.4%)',
        surface: 'hsl(0 0% 100%)',
        dark: {
          bg: 'hsl(230 25% 8%)',
          surface: 'hsl(230 20% 12%)',
          text: 'hsl(210 40% 98%)',
          muted: 'hsl(215 20.2% 65.1%)',
          border: 'hsl(230 20% 18%)'
        }
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px'
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '32px'
      },
      boxShadow: {
        'card': '0 4px 12px hsla(0,0%,0%,0.08)',
        'modal': '0 8px 24px hsla(0,0%,0%,0.12)',
        'dark-card': '0 4px 12px hsla(0,0%,0%,0.3)',
        'dark-modal': '0 8px 24px hsla(0,0%,0%,0.5)'
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.22,1,0.36,1)',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.22,1,0.36,1)',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.22,1,0.36,1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        pulseGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px hsla(242, 69%, 61%, 0.3)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 25px hsla(242, 69%, 61%, 0.5)',
            transform: 'scale(1.02)'
          }
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}