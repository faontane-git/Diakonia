import React from 'react';
import Cabecera from './Cabecera';
import { Link } from 'react-router-dom';
import '../estilos/Beneficiarios.css';

const Beneficiarios = ({ instituciones }) => {
  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Beneficiarios</h1>
      <div className="list-container">
        <ul id="listaInstituciones">
          {instituciones ? (
            instituciones.map((institucion) => (
              <li key={institucion.id}>
                <Link to={`/beneficiarios/${institucion.id}`} className="centered-link">
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

export default Beneficiarios;
