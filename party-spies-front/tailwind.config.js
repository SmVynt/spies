/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      //Screen sizes
      sm:'480px',
      md:'768px',
      lg:'976px',
      xl:'1440px'
    },
    extend: {
      fontFamily: {
        sans: ['Wix Madefor Display', 'sans-serif']
      },
      gridTemplateColumns: {
        '70/30': '70% 28%'
      },
      colors: {
        spyYellow: "#FFE502",
        spyDarkPink: "#6B035D",
        spyPink: "#F441AE",
        spyAubergine: "#220A2E"
      },
      width: {
        mediumSpy: '640rem'
      },
      maxWidth: {
        '60pc': '60%',
        '75pc': '75%'
      }

    }
  },
  plugins: [],
}

