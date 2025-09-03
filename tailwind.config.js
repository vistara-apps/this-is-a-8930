/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: 'hsl(242, 69.1%, 60.9%)',
        primary: 'hsl(220, 89.8%, 52.4%)',
        'dark-bg': 'hsl(222, 47%, 11%)',
        'dark-surface': 'hsl(223, 47%, 14%)',
        'dark-border': 'hsl(224, 34%, 22%)',
        'dark-text': 'hsl(210, 40%, 98%)',
        'dark-muted': 'hsl(215, 16%, 65%)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'dark-card': '0 4px 12px hsla(0,0%,0%,0.2)',
        'dark-modal': '0 8px 24px hsla(0,0%,0%,0.3)',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '32px',
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'hsl(210, 40%, 98%)',
            a: {
              color: 'hsl(242, 69.1%, 60.9%)',
              '&:hover': {
                color: 'hsl(242, 69.1%, 70%)',
              },
            },
            h1: {
              color: 'hsl(210, 40%, 98%)',
            },
            h2: {
              color: 'hsl(210, 40%, 98%)',
            },
            h3: {
              color: 'hsl(210, 40%, 98%)',
            },
            h4: {
              color: 'hsl(210, 40%, 98%)',
            },
            strong: {
              color: 'hsl(210, 40%, 98%)',
            },
            code: {
              color: 'hsl(210, 40%, 98%)',
            },
            blockquote: {
              color: 'hsl(215, 16%, 65%)',
              borderLeftColor: 'hsl(224, 34%, 22%)',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}

