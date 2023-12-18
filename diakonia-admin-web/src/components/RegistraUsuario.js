import React from 'react'
import Cabecera from "./Cabecera";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../estilos/RegistraUsuario.css';

import firebaseApp from "../firebase-config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithCustomToken,
  getIdToken,
} from "firebase/auth";
import { getFirestore, doc, collection, setDoc } from "firebase/firestore";
const auth = getAuth(firebaseApp);

const RegistroUsuario = () => {
  
  const navigate = useNavigate();
 
  const goBack = () => {    
      navigate('/');
    }

  const [email, setemail] = useState('');
  const [rol, setRol] = useState('admin');
  const [contraseña, setContraseña] = useState('');




  // Función para manejar el envío del formulario

  async function registrarUsuario(email, contraseña, rol) {
    const firestore = getFirestore(firebaseApp);
    const infoUsuario = await createUserWithEmailAndPassword(
      auth,
      email,
      contraseña,
    ).then(async (usuarioFirebase) => {
      console.log("registro: ",usuarioFirebase.user.uid);
      const docuRef = doc(firestore, `usuarios/${usuarioFirebase.user.uid}`);
      await setDoc(docuRef, { correo: email, rol: rol });
      goBack();
    signOut(auth);
      alert("se creo el usuario")
      return usuarioFirebase;
    });
    
    
  }


  function handleSubmit(event) {
    event.preventDefault();
    console.log('rol:',rol)
    registrarUsuario(email, contraseña, rol);    
  };


  return (
    <div className="centered-container">
      <Cabecera />

      <h1>Registrar Usuario</h1>
      <form onSubmit={handleSubmit}>

      <div id="txtUemail">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
        </div>

        <div id="txtUContaseña">
          <label htmlFor="contraseña">Contraseña:</label>
          <input
            type="text"
            id="contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />
        </div>

        <div id="txtUrol">           
          <label htmlFor="rol">Rol:</label>
          <select id="rol" onChange={(e) => setRol(e.target.value)}>
            <option value="admin">Administrador</option>
            <option value="editor">Editor</option>
            <option value="registrador">Registrador</option>
          </select>
        </div>

        <button id="buttonIRegistrar"type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegistroUsuario;
