import React, { useState } from 'react';
//import { View, Text, TextInput, Button } from 'react-native';
import Cabecera from './Cabecera';

import firebaseApp from "../firebase-config";

import {getAuth,reauthenticateWithCredential,updatePassword,EmailAuthProvider } from "firebase/auth";

import { useNavigate } from 'react-router-dom';


const CambiarContra = ({user}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();
  const goBack = () => {    
    navigate('/');
  }
  async function handleChangePassword(event) {
    event.preventDefault();
        if(currentPassword!==newPassword){
            try {
                const auth = getAuth(firebaseApp);
                const usuario = auth.currentUser;
      

      // Autenticar al usuario nuevamente con su contraseña actual
                const credential = EmailAuthProvider.credential(usuario.email, currentPassword);

                await reauthenticateWithCredential(usuario, credential);
        

      // Cambiar la contraseña
                await updatePassword(usuario,newPassword);

                alert('Contraseña cambiada exitosamente');
                goBack();
                } catch (error) {
                alert('Error al cambiar la contraseña', error.message);
                }
         }else{
                alert("las contraseñas son iguales")
         }
  };

  return (
    <div>
    <Cabecera user={user}/>
    <h1>Cambiar Contraseña</h1>
      <form onSubmit={handleChangePassword}>

        <div id="CurrentContraseña">
          <label htmlFor="contraseña">Contraseña actual:</label>
          <input
            type="password"
            id="email"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div id="Newcontraseña">
          <label htmlFor="contraseña">Nueva Contraseña:</label>
          <input
            type="password"
            id="contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>


        <button id="buttonIRegistrar" type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default CambiarContra;

