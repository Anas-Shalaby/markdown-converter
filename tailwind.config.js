/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
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
            // Dark mode typography styles
            '--tw-prose-body': 'var(--tw-prose-dark-body)',
            '--tw-prose-headings': 'var(--tw-prose-dark-headings)',
            '--tw-prose-lead': 'var(--tw-prose-dark-lead)',
            '--tw-prose-links': 'var(--tw-prose-dark-links)',
            '--tw-prose-bold': 'var(--tw-prose-dark-bold)',
            '--tw-prose-counters': 'var(--tw-prose-dark-counters)',
            '--tw-prose-bullets': 'var(--tw-prose-dark-bullets)',
            '--tw-prose-hr': 'var(--tw-prose-dark-hr)',
            '--tw-prose-quotes': 'var(--tw-prose-dark-quotes)',
            '--tw-prose-quote-borders': 'var(--tw-prose-dark-quote-borders)',
            '--tw-prose-captions': 'var(--tw-prose-dark-captions)',
            '--tw-prose-code': 'var(--tw-prose-dark-code)',
            '--tw-prose-pre-code': 'var(--tw-prose-dark-pre-code)',
            '--tw-prose-pre-bg': 'var(--tw-prose-dark-pre-bg)',
            '--tw-prose-th-borders': 'var(--tw-prose-dark-th-borders)',
            '--tw-prose-td-borders': 'var(--tw-prose-dark-td-borders)',
          }
        }
      }
    }
  },
  plugins: [
    typography,
  ],
}