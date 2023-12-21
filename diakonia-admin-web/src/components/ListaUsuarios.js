import React from 'react';
import '../estilos/ListaUsuarios.css';
import { Link } from 'react-router-dom';

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
              <td><Link to={`/editar-usuario/${usuario.id}`}>
                  <button>Editar</button>
                </Link>
              <button>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaUsuarios; 