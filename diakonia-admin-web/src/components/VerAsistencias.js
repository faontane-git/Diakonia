import React from 'react';
import Cabecera from "./Cabecera";
import { Link } from "react-router-dom";
import '../estilos/VerAsistencias.css'

const VerAsistencias = ({ instituciones }) => {
  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Seguimiento</h1>
      <div className="list-container-verAsistencias">
        <ul id="verAsistencias">
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

    </div>
  );
};

export default VerAsistencias;
