import React from 'react';
import '../estilos/ListaUsuarios.css';

const ListaUsuarios = ({ usuarios }) => {
  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <ul>
        {usuarios.map((usuario, index) => (
          <li key={index}>
            <strong>Nombre:</strong> {usuario.nombre},&nbsp;
            <strong>usuario:</strong> {usuario.usuario},&nbsp;
            <strong>contraseña:</strong> {usuario.contraseña},&nbsp;

          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaUsuarios;