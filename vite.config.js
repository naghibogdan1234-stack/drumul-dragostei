import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// base './' so the build works on GitHub Pages and when opened from any folder
export default defineConfig({ plugins: [react()], base: './' })
