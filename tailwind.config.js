const config = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#151515',
          700: '#303030',
          500: '#585858'
        },
        paper: {
          50: '#f6f6f2',
          100: '#efefe9',
          200: '#e2e2dc'
        },
        accent: {
          500: '#2b7cff',
          400: '#4b91ff',
          300: '#9cc0ff'
        }
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
        34: '8.5rem',
        38: '9.5rem'
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '1.75rem',
        '3xl': '2.5rem'
      },
      boxShadow: {
        soft: '0 18px 60px rgba(20, 20, 20, 0.08)',
        glow: '0 0 0 1px rgba(43, 124, 255, 0.18), 0 20px 60px rgba(43, 124, 255, 0.18)'
      },
      fontFamily: {
        sans: ['Onest', 'Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Onest', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  }
}

export default config
