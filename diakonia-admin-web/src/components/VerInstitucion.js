import React from 'react';
import Cabecera from "./Cabecera";
import ListaInstituciones from "./ListaInstituciones";
import '../estilos/VerInstitucion.css';

import { useState,  useEffect } from 'react';

import firebaseApp from "../firebase-config";
import {getFirestore, collection, getDocs} from 'firebase/firestore'


const VerInstitucion = ({ user }) => {
  const [data,setData]= useState([]);

  useEffect(()=>{
    const querydb= getFirestore();
    const queryCollection = collection(querydb, 'instituciones');
    console.log("entra")
    getDocs(queryCollection).then(res => setData(res.docs.map(institucion => ({id: institucion.id,...institucion.data()}))))
  
  },[])

  return (
    <div>
      <Cabecera user={user}/>
      {/* Muestra la lista de instituciones */}
      <ListaInstituciones instituciones={data} />
    </div>
  );
};

export default VerInstitucion;


