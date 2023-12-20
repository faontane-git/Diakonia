import React, { useState, useEffect } from 'react';
import Cabecera from './Cabecera';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import '../estilos/Beneficiarios.css';
import firebaseApp from '../firebase-config';

const Beneficiarios = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const querydb = getFirestore();
    const queryCollection = collection(querydb, 'instituciones');

    getDocs(queryCollection).then((res) =>
      setData(res.docs.map((institucion) => ({ id: institucion.id, ...institucion.data() })))
    );
  }, []);

  const filteredData = data.filter((institucion) =>
    institucion.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Beneficiarios</h1>
      <h2>Seleccione una institución</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar institución"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="list-container">
        <ul id="listaInstituciones">
          {filteredData.length > 0 ? (
            filteredData.map((institucion) => (
              <li key={institucion.id}>
                <Link to={`/beneficiarios/${institucion.id}/${institucion.nombre}`} className="centered-link">
                  {institucion.nombre}
                </Link>
              </li>
            ))
          ) : (
            <li id="especial">¡No hay instituciones disponibles!</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Beneficiarios;
