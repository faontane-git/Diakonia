import React, { useState } from 'react';
//import { View, Text, TextInput, Button } from 'react-native';
import Cabecera from './Cabecera';
import firebaseApp from "../firebase-config";
import { useAuthContext } from './AuthContext';
import { getFirestore, doc, getDoc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../estilos/CambiarContra.css';
import Swal from 'sweetalert2';
var bcrypt = require('bcryptjs');


const CambiarContra = () => {
  const [currentPassword, setCurrentPassword] = useState('');

  const [newPassword, setNewPassword] = useState('');

  const navigate = useNavigate();

  const { user } = useAuthContext();

  const goBack = () => {
    if (user.rol === "Registrador") {
      navigate('/Registrador')
    } else {
      navigate('/');
    }
  }


  const hashPassword = async (password) => {
    const saltRounds = 10; // Número de rondas de sal para el hash

    try {
      const hashi = await bcrypt.hash(password, saltRounds);
      return hashi;
    } catch (error) {
      throw new Error('Error al encriptar la contraseña');
    }
  };

  async function ActualizarUsuario(usuarioId, contraseña) {
    const querydb = getFirestore();
    const docuRef = doc(querydb, 'usuarios', usuarioId);
    const usuario = {
      contraseña: contraseña
    };
    console.log(usuarioId)
    try {
      await updateDoc(docuRef, usuario);
      console.log('Datos enviados:', usuario);
      //navigate(`/usuarios/verUsuarios`);
    } catch (error) {
      console.error('Error al modificar beneficiario:', error);
      alert(error.message);
    }
  }



  async function handleChangePassword(event) {
    event.preventDefault();
    if (currentPassword === newPassword) {
      if(currentPassword.length < 6){
        Swal.fire({
          title: 'Error',
          text: '¡La contraseña debe tener 6 caracteres mínimo!',
          icon: 'error',
        });
        return;
      }else{
      try {
        const hashi = await hashPassword(currentPassword);
        ActualizarUsuario(user.id, hashi)
        Swal.fire({
          title: 'Error',
          text: '¡La contraseña debe tener 6 caracteres mínimo!',
          icon: 'error',
        });
        goBack();
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: '¡Error al cambiar contraseña!',
          icon: 'error',
        });
      }}
    } else {
      Swal.fire({
        title: 'Error',
        text: '¡La contraseñas no coinciden!',
        icon: 'error',
      });
    }
  };

  return (
    <div>
      <div className="centered-container">
        <Cabecera user={user} />
        <h1>Cambiar Contraseña</h1>
      </div>

      <form id="form_ccontraseña" onSubmit={handleChangePassword}>

        <div id="CurrentContraseña">
          <label htmlFor="contraseña">Nueva Contraseña</label>
          <input
            type="password"
            id="n_contraseña"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div id="Newcontraseña">
          <label htmlFor="contraseña">Confirme Nueva Contraseña</label>
          <input
            type="password"
            id="n_contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div id='btnRegistrar'>
          <button id="buttonIRegistrar" type="submit">Registrar</button>
        </div>
      </form>
    </div>
  );
};

export default CambiarContra;

