import React from 'react';
import Cabecera from "./Cabecera";
import ListaInstituciones from "./ListaInstituciones";
import '../estilos/VerInstitucion.css';
import { useState,  useEffect } from 'react';

import firebaseApp from "../firebase-config";
import {getFirestore, collection, getDocs} from 'firebase/firestore'


const VerInstitucion = ({ instituciones }) => {
  const [data,setData]= useState([]);

  useEffect(()=>{
    const querydb= getFirestore();
    const queryCollection = collection(querydb, 'instituciones');
    getDocs(queryCollection).then(res => setData(res.docs.map(institucion => ({id: institucion.id,...institucion.data()}))))
  
  })

  return (
    <div>
      <Cabecera />
      <h1>Ver Instituciones</h1>
      {/* Muestra la lista de instituciones */}
      <ListaInstituciones instituciones={data} />
    </div>
  );
};

export default VerInstitucion;


