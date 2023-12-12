import React from 'react';
import Cabecera from "./Cabecera";
import { Link } from "react-router-dom";


const VerAsistencias = ({ instituciones }) => {
    return (
      <div>
        <Cabecera />
        <h1>Esta es la página de Asistencias</h1>
        <h2>Lista de Instituciones</h2>
        <ul>
          {instituciones ? (
            instituciones.map((institucion) => (
              <li key={institucion.id}>
                <Link to={`/asistencias/${institucion.id}`}>
                  {institucion.nombre}
                </Link>
              </li>
            ))
          ) : (
            <li>No hay instituciones disponibles</li>
          )}
        </ul>
      </div>
    );
  };

export default VerAsistencias;
