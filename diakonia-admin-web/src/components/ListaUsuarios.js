import React from 'react';
import '../estilos/ListaUsuarios.css';

const ListaUsuarios = ({ usuarios }) => {
  return (
    <div className="centered-container">
      <h1>Lista de Usuarios</h1>
      <ul id="listaUsuarios">
        {usuarios.map((usuario, index) => (
          <li key={index}>
            <strong>id:</strong> {usuario.id},&nbsp;
            <strong>Correo:</strong> {usuario.correo},&nbsp;
            <strong>Rol:</strong> {usuario.rol},&nbsp;

          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaUsuarios;