/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// default Theme Definition
const infinityCardTheme = {
  dark: false,
  colors: {
    background: '#F2F6F8',
    surface: '#F2F6FF',
    primary: '#6200EE',
    secondary: '#03DAC6',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'infinityCardTheme',
    themes: {
      infinityCardTheme,
    },
  },
  defaults: {
    VBtn: {
      class: 'text-none',
    },
  },
})
