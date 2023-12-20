import React from 'react';
import { useState } from "react"
import { NavigationContainer } from '@react-navigation/native';
import MainStack from './navigation/mainStack';

import firebaseApp from "./firebase-config.js"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

const App = () => {

   return (
      <NavigationContainer>
         <MainStack />
      </NavigationContainer>
   )
};

export default App;