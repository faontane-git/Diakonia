import React from 'react';
import Cabecera from "./Cabecera";
import ListaInstituciones from "./ListaInstituciones";
import '../estilos/VerInstitucion.css';

import { useState, useEffect } from 'react';

import firebaseApp from "../firebase-config";
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';


const VerInstitucion = ({ user }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querydb = getFirestore();
      const queryCollection = collection(querydb, 'instituciones');
      const querySnapshot = await getDocs(query(queryCollection, orderBy('nombre')));

      setData(
        querySnapshot.docs.map((institucion) => ({ id: institucion.id, ...institucion.data() }))
      );
    };

    fetchData();
  }, []);

  return (
    <div className="centered-container">
      <Cabecera user={user} />
      {/* Muestra la lista de instituciones */}
      <ListaInstituciones instituciones={data} />
    </div>
  );
};

export default VerInstitucion;


