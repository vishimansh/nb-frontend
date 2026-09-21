/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'app-bg': '#F7F7F4',
        'shell-navy': '#2B2437',
        'shell-tab-active': '#3D334E',
        'brand-primary': '#2B2437',
        'brand-accent': '#F5B55C',
        'ad-accent': '#F7C873',
        'accent-chip': '#F7C873',
        'live-red': '#E53935',
        'surface-card': '#FFFFFF',
        'text-primary': '#2B2437',
        'text-muted': '#6B7280',
        'text-subdued': '#374151',
        'border-subtle': '#E5E7EB',
        'border-divider': '#F1F3F5',
        'border-input': '#B0B7C3',
        'border-card': '#D1D5DB',
        'alert-red': '#DC2626',

        // Category Theme Palettes
        'cat-business': '#497877',
        'cat-politics': '#B6783A',
        'cat-tech': '#5B69A3',
        'cat-entertainment': '#805D76',
        'cat-sports': '#557E63',
        'cat-education': '#5B6D8A',
        'cat-astro': '#71668C',
        'cat-health': '#B3746E',
        'cat-lifestyle': '#77856E',
        'cat-auto': '#596776',
      },
      borderRadius: {
        'btn': '16px',
        'card-img': '28px',
        'chip': '14px',
        'otp-cell': '12px',
        'input': '16px',
        '2xl': '16px',
        'xl': '12px',
      },
      fontFamily: {
        sans: ['"Noto Sans Devanagari"', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
      boxShadow: {
        'device': '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
        'card-soft': '0 4px 20px -2px rgba(43, 36, 55, 0.06)',
      },
    },
  },
  plugins: [],
}
