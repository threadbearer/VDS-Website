/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        'bg-page':      'var(--bg-page)',
        'bg-raised':    'var(--bg-raised)',
        'bg-surface':   'var(--bg-surface)',
        'bg-surface-2': 'var(--bg-surface-2)',
        'text-primary': 'var(--text-primary)',
        'text-secondary':'var(--text-secondary)',
        'text-muted':   'var(--text-muted)',
        'accent-cyan':  'var(--accent-cyan)',
        'accent-violet':'var(--accent-violet)',
        'accent-amber': 'var(--accent-amber)',
        'accent-rose':  'var(--accent-rose)',
      },
      borderColor: {
        subtle: 'var(--border-subtle)',
        mid:    'var(--border-mid)',
        strong: 'var(--border-strong)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      backgroundImage: {
        'brand-gradient': 'var(--grad-brand)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
