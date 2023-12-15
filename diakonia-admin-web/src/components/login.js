import React,{ useState } from 'react';
import Logo  from '../imagenes/logo-banco-alimentos.png'
import Img1  from '../imagenes/foto1.png'
import Img2  from '../imagenes/foto2.png'
import { Link } from 'react-router-dom';

import '../estilos/login.css';
import Inicio from './Inicio';

import firebaseApp from "../firebase-config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, collection, setDoc } from "firebase/firestore";
const auth = getAuth(firebaseApp);

function Login() {
  const firestore = getFirestore(firebaseApp);
  const [isRegistrando, setIsRegistrando] = useState(false);
  
  function submitHandler(e) {
    e.preventDefault();

    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    
    console.log("submit", email, password);
    /*const response = signInWithEmailAndPassword(email, password);

    // Si la autenticación falla, muestra un mensaje de error
    response
      .catch((error) => {
        alert("Datos incorrectos");
      })*/
      const response = signInWithEmailAndPassword(auth, email, password);
      response
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Datos incorrectos");
      })

    }
  
  return (
      <div className="container">
        <div className="half left">
            <div className='centered-image-container'>
                <img src={Logo} alt="Logo" className="centered-image"/>
            </div>

            <div className='centered-image-container'>
                <img src={Img1} alt="Img1" className="centered-image2"/>
            </div>

            <div className='centered-image-container'>
                <img src={Img2} alt="Img2" className="centered-image2"/>
            </div>
        </div>

        <div className="half right">
            <h1 className="title"> Sistema de Gestión y Análisis de Impacto en Beneficiarios de Alimentos</h1>

            <div className="white-box">
                <p className="title-2">Inicie Sesión</p>
                <div className='formulario'>
                <form onSubmit={submitHandler}>
                  <label>
                    Correo electrónico:
                    <input type="email" id="email" />
                  </label>

                  <label>
                    Contraseña:
                    <input type="password" id="password" />
                  </label>
                  <input
                    type="submit"
                    value="Iniciar sesión"
                  />
                </form>
                
                </div>
            </div>
        
        
        </div>
      </div>
    );
  }


export default Login;
