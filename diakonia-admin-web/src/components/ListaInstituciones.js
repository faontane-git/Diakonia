import React from 'react';
import '../estilos/ListaInstituciones.css';

const ListaInstituciones = ({ instituciones }) => {
  return (
    <div className="centered-container">
      <h1>Lista de Instituciones</h1>
      <div className="list-container-lInstituciones">
        <ul id="listaInsituciones">
          {instituciones.map((institucion, index) => (
            <li key={index}>
              <strong>Nombre:</strong> {institucion.nombre},&nbsp;
              <strong>Teléfono:</strong> {institucion.telefono},&nbsp;
              <strong>Ubicación:</strong> {institucion.ubicacion},&nbsp;
              <strong>Servicios:</strong> {institucion.desayuno ? 'Desayuno ' : ''}{institucion.almuerzo ? 'Almuerzo' : ''}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default ListaInstituciones;