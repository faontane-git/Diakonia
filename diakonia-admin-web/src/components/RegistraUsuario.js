import React, { useState, useEffect } from 'react';
import Cabecera from "./Cabecera";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../estilos/RegistraUsuario.css';
import { Button } from '@mui/material';
import firebaseApp from "../firebase-config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, collection, setDoc, getDocs, addDoc, where, query } from "firebase/firestore";

var bcrypt = require('bcryptjs');

const auth = getAuth(firebaseApp);

const RegistroUsuario = ({ user }) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/usuarios/verUsuarios');
  }

  const [data, setData] = useState([]);
  const [email, setemail] = useState('');
  const [nombre, setNombre] = useState('')
  const [rol, setRol] = useState('Administrador');
  const [contraseña, setContraseña] = useState('');
  const [mostrarBarraAdicional, setMostrarBarraAdicional] = useState(false);
  const [institucionId, setInstitucionId] = useState('DiakoníaWeb');
  const [institucionN, setInstitucionN] = useState('DiakoníaWeb');
  const [convenios, setConvenios] = useState('')
  const [convenioN, setConvenioN] = useState('DiakoníaWeb')
  const [convenioId, setConvenioId] = useState('DiakoníaWeb')

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

  async function registrarUsuario(formData) {

    if (formData.contraseña.length < 6) {
      Swal.fire('Error', 'La contraseña debe tener al menos 6 caracteres.', 'error');
      return;
    } else if (formData.convenioN === undefined || formData.convenioId === undefined) {
      Swal.fire('Error', 'Convenio no seleccionado', 'error');
      return;
    }

    const firestore = getFirestore(firebaseApp);

    try {
      const hashedPassword = await hashPassword(formData.contraseña);

      const usuariosCollection = collection(firestore, 'usuarios')

      const correoQuery = query(usuariosCollection, where('correo', '==', formData.email));
      const correoSnapshot = await getDocs(correoQuery);

      if (!correoSnapshot.empty) {
        Swal.fire('Error', 'El correo ya está registrado. Por favor, elige otro correo.', 'error');
        return;
      }

      const usuario = {
        nombre: formData.nombre,
        correo: formData.email,
        contraseña: hashedPassword,
        rol: formData.rol,
        institucionId: formData.institucionId,
        institucionN: formData.institucionN,
        convenioN: formData.convenioN,
        convenioId: formData.convenioId,
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

    if (nombre.trim() === '' || email.trim() === '' || contraseña.trim() === '') {
      Swal.fire('Error', 'Nombre, Email y Constraseña son campos obligatorios.', 'error');
      return;
    }

    if (mostrarBarraAdicional === false) {
      setInstitucionId("DiakoníaWeb");
      setInstitucionN("DiakoníaWeb");
    }
    if (rol === "Registrador") {
      if (institucionId === "DiakoníaWeb") {
        Swal.fire('Error', 'Institución no seleccionado', 'error');
        return
      }
      else if (convenioId === "") {
        Swal.fire('Error', 'Convenio no seleccionado', 'error');
        return
      }
    }

    const formData = {
      nombre,
      email,
      contraseña,
      rol,
      institucionId,
      institucionN,
      convenioN,
      convenioId,
    };

    registrarUsuario(formData);
  };

  useEffect(() => {
    if (institucionId) {
      const querydb = getFirestore();
      const conveniosCollection = collection(querydb, 'convenios');
      const conveniosQuery = query(conveniosCollection, where('institucionId', '==', institucionId));

      getDocs(conveniosQuery).then((res) => {
        if (res !== undefined) {
          setConvenios(res.docs.map((convenio) => ({ id: convenio.id, ...convenio.data() })))
        }
      });
    }
  }, [institucionId]);

  return (
    <div>
      <div className="centered-container">
        <Cabecera user={user} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div id='volver'>
          <Button variant="contained" style={{ marginLeft: '60%', backgroundColor: '#890202', color: 'white' }} onClick={goBack}>
            Volver
          </Button>
        </div>

        <div id='titulo' style={{ marginLeft: '32.0em' }}>
          <h1>Crear Usuario</h1>
        </div>
      </div>


      <form id="form_rusuario" onSubmit={handleSubmit}>



        <div id="txtUemail">
          <label htmlFor="email">Nombre Completo</label>
          <input
            type="nombre"
            id="email_usuario"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

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
              setConvenioId("DiakoníaWeb");
              setConvenioN("DiakoníaWeb");
            }
          }}>
            <option value="Administrador">Administrador</option>
            <option value="Editor">Editor</option>
            <option value="Registrador">Registrador</option>
          </select>
        </div>

        {mostrarBarraAdicional && (
          <>
            <div id="txtUrol">
              <label htmlFor="rol">Institución a la que pertenece</label>
              <select id="rol" onChange={(e) => {
                setInstitucionId(e.target.value);
                const selectedInstitucion = data.find((institucion) => institucion.id === e.target.value);
                setInstitucionN(selectedInstitucion?.nombre);
                setConvenioId("");
                setConvenioN("");
              }}>
                <option value="" disabled selected>Selecciona una institución</option>
                {data.map((institucion) => (
                  <option value={institucion.id}>{institucion.nombre}</option>
                ))}
              </select>
            </div>


            <div id="txtConvenios">
              <label htmlFor="convenios">Convenio</label>
              <select
                id="convenios"
                onChange={(e) => {
                  setConvenioId(e.target.value);
                  const selectedConvenio = convenios.find((convenio) => convenio.id === e.target.value);
                  setConvenioN(selectedConvenio?.nombre);
                }}
              >
                <option value="" disabled selected>Selecciona un convenio</option>
                {convenios.map((convenio) => (
                  <option key={convenio.id} value={convenio.id}>{convenio.nombre}</option>
                ))}
              </select>
            </div>
          </>
        )}

        <button id="buttonIRegistrar" type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegistroUsuario;
