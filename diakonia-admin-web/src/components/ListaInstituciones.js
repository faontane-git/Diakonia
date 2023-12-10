import React from 'react';
import '../estilos/ListaInstituciones.css';

const ListaInstituciones = ({ instituciones }) => {
  return (
    <div>
      <h2>Lista de Instituciones</h2>
      <ul>
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
  );
};

export default ListaInstituciones;