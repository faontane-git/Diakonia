import React, { useState } from 'react';
import Cabecera from './Cabecera';
import { Link } from 'react-router-dom';
import '../estilos/Beneficiarios.css';

const Beneficiarios = ({ instituciones }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredInstituciones = instituciones.filter((institucion) =>
    institucion.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Beneficiarios</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar Nombre"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="list-container">
        <ul id="listaInstituciones">
          {filteredInstituciones.length > 0 ? (
            filteredInstituciones.map((institucion) => (
              <li key={institucion.id}>
                <Link to={`/beneficiarios/${institucion.id}`} className="centered-link">
                  {institucion.nombre}
                </Link>
              </li>
            ))
          ) : (
            <li>No hay instituciones disponibles</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Beneficiarios;
