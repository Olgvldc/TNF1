import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.guagua.tenerife',   // cámbialo por tu propio identificador único, p.ej. com.tunombre.guagua
  appName: 'Guagua',
  webDir: 'www',
  server: {
    // Durante pruebas locales, deja esto tal cual. Al publicar de verdad, elimina
    // este bloque "server" por completo: la app debe cargar los ficheros locales,
    // no una URL remota.
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 30000,
      launchAutoHide: false,
      backgroundColor: "#F1EFE8",
      showSpinner: false
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#33463F",
      overlaysWebView: true
    }
  }
};

export default config;
