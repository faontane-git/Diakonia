import React from 'react';
import Cabecera from "./Cabecera";

import ListaUsuarios from './ListaUsuarios';
import '../estilos/VerUsuario.css';

const VerUsuario = ({ usuarios }) => {
  // Ejemplo de datos de instituciones
  

  return (
    <div>
      <Cabecera />
       {/* Muestra la lista de instituciones */}
      <ListaUsuarios usuarios={usuarios} />
    </div>
  );
};

export default VerUsuario;


