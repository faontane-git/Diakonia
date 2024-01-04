import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../imagenes/logo-banco-alimentos.png';
import '../estilos/Cabecera.css';
import { useState } from 'react';

import { useAuthContext } from './AuthContext';

import firebaseApp from "../firebase-config";
import { getAuth, signOut } from "firebase/auth";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';


function Cabecera() {

  const { logout, user } = useAuthContext();

  const auth = getAuth(firebaseApp);
const navigate = useNavigate();
const goBack = () => {    
  navigate('/');
}
const goContraseña = () => {    
  navigate('/cambiarContra');
}

const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    goBack();
    logout();
    //signOut(auth);
    handleClose();
  };

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
              <Link to="/instituciones">Instituciones y Convenios</Link>
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
        <IconButton
            id="buttonCCerrarSesion"
            onClick={handleClick}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem>{user.email}</MenuItem>
            <MenuItem onClick={goContraseña}>Cambiar contraseña</MenuItem>
            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
          </Menu>

          {/*<button id="buttonCCerrarSesion" onClick={() => {goBack(); signOut(auth);}}> Cerrar sesión</button>*/}
        </div>

      </div>
    </nav>
  );
}

export default Cabecera;
