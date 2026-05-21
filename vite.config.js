import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // ou @vitejs/react-refresh conforme seu projeto

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/voz-da-comunidade-web/', // ← Use exatamente o nome do repositório entre as barras
})
```

### 🌍 Como vai ficar o seu link público na nuvem?
Assim que você rodar o comando "npm run deploy" no terminal do VS Code, o GitHub Pages vai colocar o seu front-end no ar e o link oficial para colocar dentro do **MIT App Inventor** ou abrir no navegador será:
