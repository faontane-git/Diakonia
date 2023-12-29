import React from "react";
import { Link } from "react-router-dom";
import Cabecera from "./Cabecera";
import Imagen  from '../imagenes/inicio.png'
import '../estilos/Inicio.css';

import { useAuthContext } from './AuthContext.js';

function Inicio({user}) {
  const { login, logout } = useAuthContext();
  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Sistema de Gestión y Análisis de Impacto en Beneficiarios de Alimentos</h1>

      <div className='centered-image-container'>
                <img src={Imagen} alt="Logo" className="centered-image"/>
        </div>
        

    </div>
  );
}

export default Inicio;