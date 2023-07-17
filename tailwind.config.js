/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,ts,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
			transitionDuration: {
				DEFAULT: '300ms'
			},

			screens: {
				'xxs': '420px',
				'xs': '475px'
			},

			keyframes: {
				fadeIn: {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0px)', opacity: '1' }
				},
				fadeOut: {
					'0%': { transform: 'translateY(0px)', opacity: '1' },
					'100%': { transform: 'translateY(10px)', opacity: '0' }
				}
			},

			animation: {
				'fadeIn': 'fadeIn forwards 0.5s',
				'fadeOut': 'fadeOut forwards 0.5s'
			},
			
			transitionTimingFunction: {
				"in-back": "cubic-bezier(0.600, -0.280, 0.735, 0.045)",
				"out-back": "cubic-bezier(0.175,  0.885, 0.320, 1.625)",
				"in-out-back": "cubic-bezier(0.680, -0.550, 0.265, 1.550)",
        DEFAULT: 'ease-out'
			},

      colors: {
				nebula: {
					950: "#080207",
					900: "#0D050E",
					800: "#170C1A",
					700: "#2E1B31",
					600: "#4A2F4B",
					500: "#6C486B",
					400: "#8D6388",
					300: "#AF80A6",
					200: "#D09BC6",
					100: "#EABADF",
					 50: "#FCDAF9",
				},
				cerulean: {
					950: "#101820",
					900: "#172530", 
					800: "#253C4B", 
					700: "#35586E", 
					600: "#4B788F", 
					500: "#6191A8", 
					400: "#73A5B9", 
					300: "#87BBCD", 
					200: "#9DD2E2", 
					100: "#AFE4F1", 
					 50: "#BCF6FF", 
				},
      }
    },
  },
  plugins: [],
}

