import React, { useState } from 'react';
import '../estilos/ListaUsuarios.css';
import { Link } from 'react-router-dom';
import { getFirestore, deleteUser } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import * as XLSX from 'xlsx';

const ListaUsuarios = ({ usuarios }) => {
  const auth = getAuth();
  const firestore = getFirestore();

  const [selectedInstitucion, setSelectedInstitucion] = useState('');

  const handleInstitucionChange = (e) => {
    setSelectedInstitucion(e.target.value);
  };

  async function eliminarUsuario(usuario) {
    const auth = getAuth();
    const firestore = getFirestore();

    try {
      // Eliminar el usuario de Firebase Auth
      // await deleteUser(usuario);

      // Eliminar el documento del usuario en Firestore
      // await deleteDoc(doc(firestore, 'usuarios', usuario));

      // Actualizar el estado de los usuarios (si es necesario)
      // ...

    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert(error.message);
    }
  }

  const exportToXLSX = () => {
    const filteredUsers = selectedInstitucion
      ? usuarios.filter((usuario) => usuario.institucionN === selectedInstitucion)
      : usuarios;

    const ws = XLSX.utils.json_to_sheet(
      filteredUsers.map(({ correo, rol, institucionN }) => ({
        Correo: correo,
        Rol: rol,
        Institución: institucionN,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
    XLSX.writeFile(wb, 'usuarios.xlsx');
  };

  return (
    <div className="centered-container">
      <h1>Lista de Usuarios</h1>

      <div className="filter-container">
        <label htmlFor="institucionFilter">Filtrar por Institución:</label>
        <select
          id="institucionFilter"
          value={selectedInstitucion}
          onChange={handleInstitucionChange}
          className="custom-select"
        >
          <option value="">Todos</option>
          {Array.from(new Set(usuarios.map((usuario) => usuario.institucionN))).map(
            (institucion, index) => (
              <option key={index} value={institucion}>
                {institucion}
              </option>
            )
          )}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Institución</th>
            <th>Convenio</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {usuarios
            .filter((usuario) =>
              selectedInstitucion ? usuario.institucionN === selectedInstitucion : true
            )
            .map((usuario, index) => (
              <tr key={index}>
                 <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.rol}</td>
                <td>{usuario.institucionN}</td>
                <td>{usuario.convenioN}</td>
                <td>
                  <Link to={`/usuarios/editar-usuario/${usuario.id}`}>
                    <button>Editar</button>
                  </Link>
                  {/* Descomenta la siguiente línea si deseas permitir eliminar usuarios */}
                  {/* <button onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button> */}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div id="export-button-container">
        <button onClick={exportToXLSX}>Exportar Tabla</button>
      </div>
    </div>
  );
};

export default ListaUsuarios;
