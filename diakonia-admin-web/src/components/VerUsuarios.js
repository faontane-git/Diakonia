import React, { useEffect } from 'react';
import Cabecera from "./Cabecera";

import ListaUsuarios from './ListaUsuarios';
import '../estilos/VerUsuario.css';
import { useState } from 'react';


import firebaseApp from "../firebase-config";
import {getFirestore, collection, getDocs} from 'firebase/firestore'


const VerUsuario = ({ usuarios }) => {
  // Ejemplo de datos de instituciones
  const [data,setData]= useState([]);

  useEffect(()=>{
    const querydb= getFirestore();
    const queryCollection = collection(querydb, 'usuarios');
    console.log("entra")
    const report= getDocs(queryCollection).then(res => setData(res.docs.map(usuarios => ({id: usuarios.id,...usuarios.data()}))))
    /*report
    .catch((error)=>{})*/
  },[])
  

  return (
    <div>
      <Cabecera />
      <ListaUsuarios usuarios={data} />
      
       {/* Muestra la lista de instituciones */}
      {/*<ListaUsuarios usuarios={usuarios} />*/}
    </div>
  );
};

export default VerUsuario;


