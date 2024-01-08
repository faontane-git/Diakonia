import React, { useState } from 'react';
import Logo from '../imagenes/logo-banco-alimentos.png';
import Img1 from '../imagenes/foto1.png';
import Img2 from '../imagenes/foto2.png';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useAuthContext } from './AuthContext.js';
import '../estilos/login.css';
import Inicio from './Inicio';
import firebaseApp from '../firebase-config';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

var bcrypt = require('bcryptjs');
const auth = getAuth(firebaseApp);

function Login({ user }) {
  const { login, logout } = useAuthContext();

  async function submitHandler(e) {
    e.preventDefault();

    const email = e.target.elements.txtEmail.value;
    const password = e.target.elements.txtPassword.value;

    const firestore = getFirestore(firebaseApp);
    const usuariosCollection = collection(firestore, 'usuarios');

    const q = query(usuariosCollection, where('correo', '==', email));

    try {
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // El correo electrónico no existe en la base de datos
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: '¡El correo electrónico no existe!',
        });
      } else {
        // El correo electrónico existe en la base de datos
        const userDocument = querySnapshot.docs[0];
        const userData = userDocument.data();

        // Compara las contraseñas
        const passwordMatch = await bcrypt.compare(password, userData.contraseña);

        if (passwordMatch) {
          Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión exitoso',
            text: '¡Contraseña correcta. Inicio de sesión exitoso!',
          });

          const correo = userData.correo;
          const rol = userData.rol;
          const nombre = userData.nombre; // Asegúrate de que este campo existe en tu base de datos

          const usuario = {
            id: userDocument.id,
            email: correo,
            rol: rol,
          };
          login(usuario);

          // Muestra un mensaje de bienvenida
          Swal.fire({
            icon: 'success',
            title: `¡Bienvenido, ${nombre || correo}!`,
            text: 'Inicio de sesión exitoso',
          });

          // Redirige al usuario a la página de inicio, por ejemplo
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '¡Contraseña incorrecta. Inicio de sesión fallido!',
          });
        }
        // Aquí puedes continuar con el proceso de inicio de sesión
      }
    } catch (error) {
      console.error('Error al verificar la existencia del correo electrónico:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: '¡Error al verificar la existencia del correo electrónico!',
      });
    }
  }

  return (
    <div className="container">
      <div className="half left">
        <div className='centered-image-container'>
          <img src={Logo} alt="Logo" className="centered-image" />
        </div>

        <div className='centered-image-container'>
          <img src={Img1} alt="Img1" className="centered-image2" />
        </div>

        <div className='centered-image-container'>
          <img src={Img2} alt="Img2" className="centered-image2" />
        </div>
      </div>

      <div className="half right">
        <h1 className="title"> Sistema de Gestión y Análisis de Impacto en Beneficiarios de Alimentos</h1>

        <div className="white-box">
          <p className="title-2">Inicie Sesión</p>
          <div className='formularioInicio'>
            <form id="formInicio" onSubmit={submitHandler}>

              <input type="email" id="txtEmail" placeholder="Correo" />
              <br></br>

              <input type="password" id="txtPassword" placeholder="Contraseña" />
              <br></br>

              <input
                id="submit-button"
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
