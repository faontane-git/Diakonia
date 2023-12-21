import React from 'react';
import Cabecera from './Cabecera';
import LinesChart from './Linechart';
import { Link } from 'react-router-dom';
import '../estilos/Nutricion.css';

import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';

const Nutricion = ({ user }) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const querydb = getFirestore();
    const queryCollection = collection(querydb, 'instituciones');

    getDocs(queryCollection).then((res) =>
      setData(res.docs.map((institucion) => ({ id: institucion.id, ...institucion.data() })))
    );
  }, []);

  // Función para filtrar la lista por nombre
  const filteredData = data.filter((institucion) =>
    institucion.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="centered-container">
      <Cabecera user={user}/>
      <h1>Seguimiento</h1>
      <div className="list-container-nutricion">
        <h2>Seleccione una institución</h2>
        {/*  
        <div id="txtUopcion">
          <select id="opcion">
            <option value="" disabled selected>
              Selecciona un rol
            </option>
            <option value="desayuno">Desayuno</option>
            <option value="almuerzo">Almuerzo</option>
          </select>
        </div>
         */}

        <div className="search-container-name">
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ul id="listaNutriciones">
          {filteredData.length > 0 ? (
            filteredData.map((institucion) => (
              <li key={institucion.id}>
                <Link to={`/nutricion/${institucion.id}/${institucion.nombre}`}>
                  {institucion.nombre}
                </Link>
              </li>
            ))
          ) : (
            <li id="no-instituciones">¡No hay instituciones disponibles!</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Nutricion;
