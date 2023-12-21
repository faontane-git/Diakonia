import React from 'react';
import '../estilos/ListaUsuarios.css';

const ListaUsuarios = ({ usuarios }) => {
  return (
    <div className="centered-container">
      <h1>Lista de Usuarios</h1>
      <table>
        <thead>
          <tr>
            <th>Correo</th>
            <th>Rol</th>
            <th>Institución</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario, index) => (
            <tr key={index}>
              <td>{usuario.correo}</td>
              <td>{usuario.rol}</td>
              <td>{usuario.institucionN}</td>
              <td><button>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaUsuarios;