// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMgfXUMaz_DXsupN0GG1AlqdrIBVRfFco",
  authDomain: "paginaweb-f749a.firebaseapp.com",
  projectId: "paginaweb-f749a",
  storageBucket: "paginaweb-f749a.appspot.com",
  messagingSenderId: "258033281931",
  appId: "1:258033281931:web:35c423ca2f07b8b1c35d8e",
  measurementId: "G-NL79BLY17B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;