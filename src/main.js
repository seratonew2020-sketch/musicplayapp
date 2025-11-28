// src/main.js
import { createApp } from 'vue';
import App from './App.vue';

// Vuetify
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css'; // Import MDI Font CSS
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi'; // Use Font-based MDI

const myCustomTheme = {
  dark: true, // กำหนดเป็น Dark Mode ตามต้นฉบับ
  colors: {
    background: '#1c1022', // background-dark
    surface: '#2c1a32',    // สีพื้นผิวรอง
    primary: '#a413ec',    // สีม่วงเข้ม (primary)
    secondary: '#f7f6f8',
    'on-surface-variant': 'rgba(255, 255, 255, 0.6)', // สำหรับข้อความรอง
  },
};

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'myCustomTheme',
    themes: {
      myCustomTheme,
    },
  },
});

createApp(App).use(vuetify).mount('#app');