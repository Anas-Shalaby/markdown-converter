/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#333',
            a: {
              color: '#3182ce',
              '&:hover': {
                color: '#2c5282',
              },
            },
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '1.5em',
              marginBottom: '1.5em',
              borderWidth: '1px',
              borderColor: '#e5e7eb',
            },
            th: {
              backgroundColor: '#f8fafc',
              fontWeight: '600',
              textAlign: 'left',
              padding: '0.75rem',
              borderWidth: '1px',
              borderColor: '#e5e7eb',
            },
            td: {
              padding: '0.75rem',
              borderWidth: '1px',
              borderColor: '#e5e7eb',
              verticalAlign: 'top',
            },
            thead: {
              borderBottomWidth: '2px',
              borderColor: '#e5e7eb',
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderColor: '#e5e7eb',
              '&:last-child': {
                borderBottomWidth: '0',
              },
            },
            'thead th:first-child': {
              paddingLeft: '0.75rem',
            },
            'thead th:last-child': {
              paddingRight: '0.75rem',
            },
            'tbody td:first-child': {
              paddingLeft: '0.75rem',
            },
            'tbody td:last-child': {
              paddingRight: '0.75rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    typography,
  ],
}