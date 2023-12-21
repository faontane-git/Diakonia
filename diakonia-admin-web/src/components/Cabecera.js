import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../imagenes/logo-banco-alimentos.png';
import '../estilos/Cabecera.css';

import firebaseApp from "../firebase-config";
import { getAuth, signOut } from "firebase/auth";


function Cabecera({user}) {
  const auth = getAuth(firebaseApp);
const navigate = useNavigate();
const goBack = () => {    
  navigate('/');
}
  return (
    <nav>
      <div id="contenedorCabecera">
        <div id="logoCabecera">
          <img id="logoBarra" src={Logo} alt="logo" />
        </div>

        <div id='elementos'>
          <ul id="listaOpciones">

            <li id="opcion">
              <Link to="/">Inicio</Link>
            </li>

            {user.rol !== "Registrador"? 
            <li id="opcion">
              <Link to="/instituciones">Instituciones</Link>
              </li> : <li></li>}

            {user.rol !== "Registrador"? 
            <li id="opcion">
              <Link to="/beneficiarios">Beneficiarios</Link>
              </li> : <li></li>}

            {user.rol !== "Registrador"? 
            <li id="opcion">
              <Link to="/seguimiento">Seguimiento</Link>
              </li> : <li></li>}

            {user.rol === "Administrador"? <li id="opcion">
              <Link to="/usuarios">Usuarios</Link>
            </li> : <li></li>}
            

          </ul>
        </div>

        <div >
          <button id="buttonCCerrarSesion" onClick={() => {goBack(); signOut(auth);}}> Cerrar sesión</button>
        </div>

      </div>
    </nav>
  );
}

export default Cabecera;
