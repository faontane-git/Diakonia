import React from 'react';
import '../estilos/ListaUsuarios.css';
import { Link } from 'react-router-dom';

import { useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc,deleteDoc } from 'firebase/firestore';
import firebaseApp from "../firebase-config";
import {
  getAuth,
  deleteUser,
} from "firebase/auth";

const ListaUsuarios = ({ usuarios }) => {

  async function eliminarUsuario(usuario) {
    const auth = getAuth();
    const firestore = getFirestore();
  
    try {
      console.log("entra")
      // Eliminar el usuario de Firebase Auth
      //await deleteUser(usuario);
  
      // Eliminar el documento del usuario en Firestore
      //await deleteDoc(doc(firestore, 'usuarios', usuario));
  
      // Actualizar el estado de los usuarios (si es necesario)
      // ...
  
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert(error.message);
    }
  }

  return (
    <div className="centered-container">
      <h1>Lista de Usuarios</h1>
      <table>
        <thead>
          <tr>
            <th>Correo</th>
            <th>Rol</th>
            <th>Institución</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario, index) => (
            <tr key={index}>
              <td>{usuario.correo}</td>
              <td>{usuario.rol}</td>
              <td>{usuario.institucionN}</td>
              <td><Link to={`/editar-usuario/${usuario.id}`}>
                  <button>Editar</button>
                </Link>
                {/*<button onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button>*/}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaUsuarios;