import { defineConfig } from 'vite';  
import react from '@vitejs/plugin-react';  

export default defineConfig({  
  plugins: [react()],  
  base: '/', // Isso é importante para o roteamento  
  build: {  
    outDir: 'dist', // Assegura que o conteúdo do build irá para a pasta correta  
  },  
});  