import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cabecera from './Cabecera';
import Popup from './Popup';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../estilos/ListaBeneficiarios.css';

import {getFirestore, collection, getDocs, query, where} from 'firebase/firestore'

const ListaBeneficiarios = ({ instituciones, beneficiarios }) => {
  const { institucionId, institucionN} = useParams();
  
  const navigate = useNavigate();
 

  const goAñadirBenef = () => {
    
      navigate('añadirBenef');
    }
    const [data,setData]= useState([]);

    useEffect(()=>{
      const querydb= getFirestore();
      const beneficiariosCollection = collection(querydb, 'beneficiarios');
      const beneficiarios = query(beneficiariosCollection, where("institucionId", "==", institucionId));
      console.log("entra")
      getDocs(beneficiarios).then(res => setData(res.docs.map(benf => ({id: benf.id,...benf.data()}))))
    
    },[])

  return (
    <div>
      <Cabecera/>
      {<h2>Lista de Beneficiarios de {institucionN}</h2>}
      <button onClick={goAñadirBenef} >Añadir Benneficiarios</button>
     
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cédula</th>
            <th>Fecha de nacimiento</th>
            <th>Género</th>
            <th>Número de personas menores en el hogar</th>
            <th>Número de personas mayores en el hogar</th>
          </tr>
        </thead>
        <tbody>
          {data.map((beneficiario) => (
            <tr>
              <td>{beneficiario.nombre}</td>
              <td>{beneficiario.cedula}</td>
              <td>{beneficiario.fecha_nacimiento}</td>
              <td>{beneficiario.genero}</td>
              <td>{beneficiario.numero_de_personas_menores_en_el_hogar}</td>
              <td>{beneficiario.numero_de_personas_mayores_en_el_hogar}</td>
              <td>
                <Link to={`/editar-beneficiario/${institucionId}/${beneficiario.id}`}>
                <button>Editar</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaBeneficiarios;
