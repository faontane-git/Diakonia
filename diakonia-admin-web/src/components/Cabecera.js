import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

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
    handleClose();
  };

  const isTabActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav>
      <div id="contenedorCabecera">
        <div id="logoCabecera">
          <img id="logoBarra" src={Logo} alt="logo" onClick={goBack} />
        </div>

        <div id='elementos'>
          <ul id="listaOpciones">
            <li className={isTabActive('/') ? 'opcion active' : 'opcion'}>
              <Link to="/">Inicio</Link>
            </li>

            {user.rol !== "Registrador" &&
              <li className={isTabActive('/verInstitucion') ? 'opcion active' : 'opcion'}>
                <Link to="/verInstitucion">Instituciones y Convenios</Link>
              </li>
            }

            {user.rol !== "Registrador" &&
              <li className={isTabActive('/nutricion') ? 'opcion active' : 'opcion'}>
                <Link to="/nutricion">Seguimiento</Link>
              </li>
            }

            {user.rol === "Administrador" &&
              <li className={isTabActive('/horarios') ? 'opcion active' : 'opcion'}>
                <Link to="/horarios">Horarios</Link>
              </li>
            }

            {user.rol === "Administrador" &&
              <li className={isTabActive('/usuarios/verUsuarios') ? 'opcion active' : 'opcion'}>
                <Link to="/usuarios/verUsuarios">Usuarios</Link>
              </li>
            }
          </ul>
        </div>

        <div>
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
        </div>
      </div>
    </nav>
  );
}

export default Cabecera;