/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        screens: {
          'sm': '640px',   // Small devices (e.g., mobile phones)
          'md': '769px',   // Medium devices (e.g., tablets/iPads)
          'lg': '1024px',  // Large devices (e.g., laptops)
          'xl': '1280px',  // Extra large devices (e.g., desktops)
        },
      },
    },
    plugins: [],
  }