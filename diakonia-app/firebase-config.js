// Importa las funciones necesarias del SDK de Firebase
import { initializeApp } from 'firebase/app';

// Tu configuración de Firebase para la aplicación React Native
const firebaseConfig = {
  apiKey: "AIzaSyBMgfXUMaz_DXsupN0GG1AlqdrIBVRfFco",
  authDomain: "paginaweb-f749a.firebaseapp.com",
  projectId: "paginaweb-f749a",
  storageBucket: "paginaweb-f749a.appspot.com",
  messagingSenderId: "258033281931",
  appId: "1:258033281931:web:35c423ca2f07b8b1c35d8e",
  measurementId: "G-NL79BLY17B"
};

// Inicializa Firebase en la aplicación React Native
const app = initializeApp(firebaseConfig);

export default app;
