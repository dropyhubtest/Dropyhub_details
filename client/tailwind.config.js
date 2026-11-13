/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dropy: {
          bg: '#0c0c0c',
          darkPrimary: '#111111',
          card: '#161616',
          cardHover: '#1f1f1f',
          surface: '#171717',
          surfaceSecondary: '#2c2a2a',
          surfaceTertiary: '#222222',
          borderSubtle: 'rgba(255, 255, 255, 0.08)',
          borderDefault: '#2c2a2a',
          borderStrong: '#3e3e3e',
          accent: '#b6005d',
          accentPink: '#ea0066',
          accentDark: '#900057',
          accentDeep: '#510055',
          textPrimary: '#ffffff',
          textSecondary: '#c5c5c5',
          textMuted: '#807f7f',
          textSubtle: '#565555',
          textSlate: '#9797aa',
          btnDark: '#272727',
          btnHover: '#333333',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Manrope"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        accent: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'dropy-cta': 'linear-gradient(90deg, #ea0066 0%, #b6005d 35.58%, #900057 64.91%, #510055 100%)',
        'dropy-cta-hover': 'linear-gradient(90deg, #ff1a7d 0%, #cf006a 35.58%, #a80066 64.91%, #67006d 100%)',
        'dropy-glow': 'radial-gradient(ellipse at center, rgba(182, 0, 93, 0.15) 0%, rgba(12, 12, 12, 0) 70%)',
      },
      boxShadow: {
        'dropy-card': '0 4px 24px -1px rgba(0, 0, 0, 0.6), 0 2px 8px -1px rgba(0, 0, 0, 0.4)',
        'dropy-glow': '0 0 40px -10px rgba(182, 0, 93, 0.35)',
      },
    },
  },
  plugins: [],
};
