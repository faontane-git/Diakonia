import React from 'react';
import Cabecera from "./Cabecera";
import ListaInstituciones from "./ListaInstituciones";
import '../estilos/VerInstitucion.css';

const VerInstitucion = ({ instituciones }) => {
  // Ejemplo de datos de instituciones
  

  return (
    <div>
      <Cabecera />
      {/* Muestra la lista de instituciones */}
      <ListaInstituciones instituciones={instituciones} />
    </div>
  );
};

export default VerInstitucion;


