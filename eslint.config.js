// eslint.config.js
import neostandard from 'neostandard'
import globals from 'globals'

export default [
  // Base NeoStandard
  ...neostandard(),

  // Ignorar artefactos comunes
  { ignores: ['node_modules/**', 'dist/**', 'coverage/**'] },

  // Configuración específica para archivos de prueba
  {
    files: ['tests/**/*.js', '**/*.test.js', '**/*.spec.js'],
    languageOptions: { globals: { ...globals.jest } }
  },

  // (Opcional) Reglas puntuales del proyecto
  {
    rules: {
      // ejemplos:
      // 'no-console': 'warn',
      // '@stylistic/semi': ['error', 'always']
    }
  }
]
