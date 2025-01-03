import flowbite from "flowbite-react/tailwind";
/** @type {import('tailwindcss').Config} */

export default {
  content: [
     "./index.html",  // Make sure this is present
    "./src/**/*.{js,jsx,ts,tsx}",
    flowbite.content()
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbite.plugin()
  ],
 
}

