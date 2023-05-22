import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "spotify-green": "#1db954",
        "spotify-black": "#121212",
        "spotify-gray": "#212121",
        "spotify-lightgray": "#535353",
        "blur": "rgba(0, 0, 0, 0.5)"
      }
    },
  },
  plugins: [],
} satisfies Config;
