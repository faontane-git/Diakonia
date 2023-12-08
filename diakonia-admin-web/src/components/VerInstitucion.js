import React from 'react';
import Cabecera from "./Cabecera";
import ListaInstituciones from "./ListaInstituciones";

const VerInstitucion = ({ instituciones }) => {
  // Ejemplo de datos de instituciones
  

  return (
    <div>
      <Cabecera />
      <h1>Ver Instituciones</h1>
      {/* Muestra la lista de instituciones */}
      <ListaInstituciones instituciones={instituciones} />
    </div>
  );
};

export default VerInstitucion;


