import React from 'react'
import Cabecera from './Cabecera'
import LinesChart from './Linechart'
import { Link } from 'react-router-dom';
import '../estilos/Nutricion.css';


const Nutricion = ({ instituciones }) => {
  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Seguimiento</h1>
      <div className="list-container-nutricion">
        <ul id="listaNutriciones">
          {instituciones ? (
            instituciones.map((institucion) => (
              <li key={institucion.id}>
                <Link to={`/nutricion/${institucion.id}`}>
                  {institucion.nombre}
                </Link>
              </li>
            ))
          ) : (
            <li className="no-instituciones">No hay instituciones disponibles</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Nutricion;
