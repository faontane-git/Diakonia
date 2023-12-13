import React from 'react'
import { Link } from "react-router-dom";
import '../estilos/Cabecera.css';

function cabecera() {
  return (
    <nav>
      <div id='elementos'>
        <ul>
          <li>
            <Link to="/inicio">Inicio</Link>
          </li>
          <li>
            <Link to="/instituciones">Instituciones</Link>

          </li>
          <li>
            <Link to="/beneficiarios">Beneficiarios</Link>
          </li>
          <li>
            <Link to="/seguimiento">Seguimiento</Link>
          </li>
          <li>
            <Link to="/usuarios">Usuarios</Link>
          </li>
        </ul>
      </div>
    </nav>

  )
}

export default cabecera;