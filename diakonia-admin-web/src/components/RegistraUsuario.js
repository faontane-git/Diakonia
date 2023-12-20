import React from 'react'
import Cabecera from "./Cabecera";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useState ,useEffect } from 'react';
import '../estilos/RegistraUsuario.css';

import firebaseApp from "../firebase-config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, collection, setDoc, getDocs } from "firebase/firestore";
const auth = getAuth(firebaseApp);

const RegistroUsuario = () => {
  
  const navigate = useNavigate();
 
  const goBack = () => {    
      navigate('/');
    }

    const [data, setData] = useState([]);

  const [email, setemail] = useState('');
  const [rol, setRol] = useState('admin');
  const [contraseña, setContraseña] = useState('');
  const [mostrarBarraAdicional, setMostrarBarraAdicional] = useState(false);
  const [institucion, setInstitucion]=useState('');
  

  useEffect(() => {
    const querydb = getFirestore();
    const queryCollection = collection(querydb, 'instituciones');

    getDocs(queryCollection).then((res) =>
      setData(res.docs.map((institucion) => ({ id: institucion.id, ...institucion.data() })))
    );
  }, []);




  // Función para manejar el envío del formulario

  async function registrarUsuario(email, contraseña, rol,institucion) {
    const firestore = getFirestore(firebaseApp);
    const infoUsuario = await createUserWithEmailAndPassword(
      auth,
      email,
      contraseña,
    ).then(async (usuarioFirebase) => {
      console.log("registro: ",usuarioFirebase.user.uid);
      const docuRef = doc(firestore, `usuarios/${usuarioFirebase.user.uid}`);
      await setDoc(docuRef, { correo: email, rol: rol, institucion:institucion });
      goBack();
    signOut(auth);
      alert("se creo el usuario")
      return usuarioFirebase;
    });
    
    
  }


  function handleSubmit(event) {
    event.preventDefault();
    if(mostrarBarraAdicional === false){setInstitucion("");}
    console.log('institucion:',institucion)
    registrarUsuario(email, contraseña, rol, institucion);    
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
          <select id="rol" onChange={(e) => {setRol(e.target.value);
          setMostrarBarraAdicional(e.target.value === "registrador");}}>
            <option value="admin">Administrador</option>
            <option value="editor">Editor</option>
            <option value="registrador">Registrador</option>
          </select>
        </div>

        {mostrarBarraAdicional && (
  <div id="txtUrol">
    <label htmlFor="rol">Instinción a la que pertenece:</label>
    <select id="rol" onChange={(e) => setInstitucion(e.target.value)}>
    <option value="" disabled selected>Selecciona una institucion</option>
      {data.map((institucion) => (
        <option value={institucion.id}>{institucion.nombre}</option>
      ))}
    </select>
  </div>
)}


        <button id="buttonIRegistrar"type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegistroUsuario;
