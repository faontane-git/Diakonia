import React from 'react';
import '../estilos/ListaInstituciones.css';

const ListaInstituciones = ({ instituciones }) => {
  return (
    <div className="centered-container">
      <h1>Lista de Instituciones</h1>
      <ul>
        {instituciones.map((institucion, index) => (
          <li key={index}>
            <strong>id:</strong> {institucion.id},&nbsp;
            <strong>Nombre:</strong> {institucion.nombre},&nbsp;
            <strong>Teléfono:</strong> {institucion.telefono},&nbsp;
            <strong>Ubicación:</strong> {institucion.direccion},&nbsp;
            <strong>Servicios:</strong> {institucion.desayuno ? 'Desayuno ' : ''}{institucion.almuerzo ? 'Almuerzo' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaInstituciones;