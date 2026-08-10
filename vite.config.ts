import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify('AQ.Ab8RN6JxFpzKKIeOJSABs-nKbeQNQjmOFDvb60pb3HrZLfT2Qw.'),
  },
});
