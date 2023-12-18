import React, { useState } from 'react';
import Cabecera from './Cabecera';
import { Link } from 'react-router-dom';
import '../estilos/Beneficiarios.css';
import { useState,  useEffect } from 'react';

import firebaseApp from "../firebase-config";
import {getFirestore, collection, getDocs} from 'firebase/firestore'


const Beneficiarios = ({ instituciones }) => {

  const [data,setData]= useState([]);

  useEffect(()=>{
    const querydb= getFirestore();
    const queryCollection = collection(querydb, 'instituciones');
    console.log("entra")
    getDocs(queryCollection).then(res => setData(res.docs.map(institucion => ({id: institucion.id,...institucion.data()}))))
  
  },[])
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
                <Link to={`/beneficiarios/${institucion.id}/${institucion.nombre}`} className="centered-link">
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
