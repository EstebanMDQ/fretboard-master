import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/fretboard-master/',
  plugins: [react()],
  test: {
    environment: 'node',
  },
})
