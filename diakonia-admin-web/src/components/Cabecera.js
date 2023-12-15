import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../imagenes/logo-banco-alimentos.png';
import '../estilos/Cabecera.css';

import firebaseApp from "../firebase-config";
import { getAuth, signOut } from "firebase/auth";
const auth = getAuth(firebaseApp);


function Cabecera() {
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
            <li id="opcion">
              <Link to="/instituciones">Instituciones</Link>
            </li>
            <li id="opcion">
              <Link to="/beneficiarios">Beneficiarios</Link>
            </li>
            <li id="opcion">
              <Link to="/seguimiento">Seguimiento</Link>
            </li>
            <li id="opcion">
              <Link to="/usuarios">Usuarios</Link>
            </li>
            <li id="opcion">
              <button onClick={() => signOut(auth)}> Cerrar sesión</button>
            </li>
          </ul>
        </div>
        
      </div>
    </nav>
  );
}

export default Cabecera;
