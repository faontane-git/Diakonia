import React from 'react'
import { Link } from "react-router-dom";

function cabecera() {
  return (
    <nav>
      <ul>
        <li>
        <Link to="/">inicio</Link>
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
    </nav>
  
  )
}

export default cabecera;