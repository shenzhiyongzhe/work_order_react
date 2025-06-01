/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                quickSand: ["Quicksand", "sans-serif"]
            },
            animation: {
                fadeIn: "fadeIn 0.2s ease-in-out"
            },
            keyframes: {
                fadeIn: {
                    from: { opacity: "0", transform: "scale(0.95)" },
                    to: { opacity: "1", transform: "scale(1)" }
                }
            },
        },
        plugins: [require('@tailwindcss/forms'),],
        darkMode: "class"
    }
}

