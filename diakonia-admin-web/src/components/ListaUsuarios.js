import React from 'react';
import '../estilos/ListaUsuarios.css';

const ListaUsuarios = ({ usuarios }) => {
  return (
    <div className="centered-container">
      <h1>Lista de Usuarios</h1>
      <ul id="listaUsuarios">
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