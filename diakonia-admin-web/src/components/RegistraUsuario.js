import React, { useState, useEffect } from 'react';
import Cabecera from "./Cabecera";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importa SweetAlert
import '../estilos/RegistraUsuario.css';

import firebaseApp from "../firebase-config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, collection, setDoc, getDocs, addDoc } from "firebase/firestore";

var bcrypt = require('bcryptjs');

const auth = getAuth(firebaseApp);

const RegistroUsuario = ({ user }) => {

  const navigate = useNavigate();

  const goBack = () => {
    navigate('/usuarios');
  }

  const [data, setData] = useState([]);

  const [email, setemail] = useState('');
  const [rol, setRol] = useState('Administrador');
  const [contraseña, setContraseña] = useState('');
  const [mostrarBarraAdicional, setMostrarBarraAdicional] = useState(false);
  const [institucionId, setInstitucionId] = useState('DiakoníaWeb');
  const [institucionN, setInstitucionN] = useState('DiakoníaWeb');

  useEffect(() => {
    const querydb = getFirestore();
    const queryCollection = collection(querydb, 'instituciones');

    getDocs(queryCollection).then((res) =>
      setData(res.docs.map((institucion) => ({ id: institucion.id, ...institucion.data() })))
    );
  }, []);

  const hashPassword = async (password) => {
    const saltRounds = 10;

    try {
      const hashi = await bcrypt.hash(password, saltRounds);
      return hashi;
    } catch (error) {
      throw new Error('Error al encriptar la contraseña');
    }
  };

  async function registrarUsuario(email, contraseña, rol, institucionId, institucionN) {
    if (contraseña.length < 6) {
      Swal.fire('Error', 'La contraseña debe tener al menos 6 caracteres.', 'error');
      return;
    }

    const firestore = getFirestore(firebaseApp);

    try {
      const hashedPassword = await hashPassword(contraseña);

      const usuariosCollection = collection(firestore, 'usuarios')

      const usuario = {
        correo: email,
        contraseña: hashedPassword,
        rol: rol,
        institucionId: institucionId,
        institucionN: institucionN,
      }

      const agregar = addDoc(usuariosCollection, usuario);

      agregar
        .then((funciono) => {
          Swal.fire('Éxito', 'Nuevo usuario añadido', 'success');
          goBack();
        })

    } catch (error) {
      console.error("Error al registrar usuario:", error.message);
      Swal.fire('Error', 'Error al registrar usuario. Por favor, verificar los datos.', 'error');
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (mostrarBarraAdicional === false) {
      setInstitucionId("DiakoníaWeb");
      setInstitucionN("DiakoníaWeb");
    }
    console.log('institucion:', institucionN)
    registrarUsuario(email, contraseña, rol, institucionId, institucionN);
  };

  return (
    <div>
      <div className="centered-container">
        <Cabecera user={user} />
        <h1>Registrar Usuario</h1>
      </div>

      <form id="form_rusuario" onSubmit={handleSubmit}>

        <div id="txtUemail">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email_usuario"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
        </div>

        <div id="txtUContaseña">
          <label htmlFor="contraseña">Contraseña</label>
          <input
            type="password"
            id="contraseña_usuario"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />
        </div>

        <div id="txtUrol">
          <label htmlFor="rol">Rol</label>
          <select id="rol" onChange={(e) => {
            setRol(e.target.value);
            setMostrarBarraAdicional(e.target.value === "Registrador");
            if (mostrarBarraAdicional === false) {
              setInstitucionId("DiakoníaWeb");
              setInstitucionN("DiakoníaWeb");
            }
          }}>
            <option value="Administrador">Administrador</option>
            <option value="Editor">Editor</option>
            <option value="Registrador">Registrador</option>
          </select>
        </div>

        {mostrarBarraAdicional && (
          <div id="txtUrol">
            <label htmlFor="rol">Institución a la que pertenece</label>
            <select id="rol" onChange={(e) => {
              setInstitucionId(e.target.value);
              const selectedInstitucion = data.find((institucion) => institucion.id === e.target.value);
              setInstitucionN(selectedInstitucion?.nombre);
            }}>
              <option value="" disabled selected>Selecciona una institución</option>
              {data.map((institucion) => (
                <option value={institucion.id}>{institucion.nombre}</option>
              ))}
            </select>
          </div>
        )}

        <button id="buttonIRegistrar" type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegistroUsuario;
