import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import env from "vite-plugin-env-compatible";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    ENV_API_KEY: JSON.stringify('KEY:XXX-XXX'),
    FIREBASE_APIKEY: JSON.stringify("AIzaSyAkjhiaXchK_GyFO0KWW3U7yYFQTp9_dCg"),
    FIREBASE_DOMAIN: JSON.stringify("ox-game-723da.firebaseapp.com"),
    FIREBASE_PROJECT_ID: JSON.stringify("ox-game-723da"),
    FIREBASE_STORAGE_BUCKET: JSON.stringify("ox-game-723da.appspot.com"),
    FIREBASE_SENDER_ID: JSON.stringify("452868623343"),
    FIREBASE_APP_ID: JSON.stringify("1:452868623343:web:5c6780b08e8c0c218bc41a"),

  },
})
