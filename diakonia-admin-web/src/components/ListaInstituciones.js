import React, { useState } from 'react';
import '../estilos/ListaInstituciones.css';
import { Link } from 'react-router-dom';


const ListaInstituciones = ({ instituciones }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInstituciones = instituciones.filter((institucion) =>
    institucion.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="centered-container">
      <h1>Lista de Instituciones</h1>

      <div className="search-container-name">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Ubicación</th>
            <th>Servicios</th>
            <th>Fecha Inicio</th>
            <th>Fecha Final</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredInstituciones.map((institucion, index) => (
            <tr key={index}>
              <td>{institucion.nombre}</td>
              <td>{institucion.telefono}</td>
              <td>{institucion.direccion}</td>
              <td>
                {institucion.desayuno && 'Desayuno '}
                {institucion.almuerzo && 'Almuerzo'}
              </td>
              <td>{institucion.fecha_inicial}</td>
              <td>{institucion.fecha_final}</td>
              <td>
                <Link>
                  <button>Editar</button>
                </Link>

                <Link>
                  <button>Eliminar</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaInstituciones;
