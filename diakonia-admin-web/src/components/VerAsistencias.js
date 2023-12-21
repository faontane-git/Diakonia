import React,{ useState, useEffect } from 'react';
import Cabecera from "./Cabecera";
import { Link } from "react-router-dom";
import '../estilos/VerAsistencias.css'

import { getFirestore, collection, getDocs } from 'firebase/firestore';

const VerAsistencias = ({ user }) => {
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
      <Cabecera user={user}/>
      <h1>Seguimiento asistencias</h1>
      <h2>Seleccione una institución</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar Institución"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="list-container-verAsistencias">
        <ul id="verAsistencias">
          {filteredData.length > 0 ? (
            filteredData.map((institucion) => (
              <li key={institucion.id}>
                <Link to={`/asistencias/${institucion.id}`}>
                  {institucion.nombre}- Rango de Fecha: {institucion.fecha_inicial}/{institucion.fecha_final}
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

export default VerAsistencias;
