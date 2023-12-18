import React from 'react'
import { useState, useEffect } from 'react';
import Cabecera from "./Cabecera";
import { useParams, useNavigate } from 'react-router-dom';
import '../estilos/EditarBeneficiario.css';

import {getFirestore, doc,collection, getDoc, query, where, updateDoc} from 'firebase/firestore'

const EditarBeneficiario = ({ beneficiarios }) => {
  const { institucionId, beneficiarioid } = useParams();
  const navigate = useNavigate();
  const goListaB = () => {

    navigate('/beneficiarios');
  }
  
  const [data,setData]= useState({});

  
    
    /*const documento = await getDoc(docuCifrada).then((docSnapshot) => {
      // Almacena el resultado de 'getDoc' en una nueva variable
      const doc = docSnapshot.data();
  
      // Asigna los valores de 'doc' a 'data' usando el operador de propagación
      const beneficiario = {...doc}
      setData(beneficiario)
      // Imprime el nombre del beneficiario
      console.log("nombre:",data.nombre);
    });*/
 
      /*const beneficiario = {
         nombre:doc.nombre,
         cedula:doc.cedula,
         fecha_nacimiento:doc.fecha_nacimiento,
         genero:doc.genero,
         numero_contacto:doc.numero_contacto,
         numero_de_personas_menores_en_el_hogar:doc.numero_de_personas_menores_en_el_hogar,
         numero_de_personas_mayores_en_el_hogar:doc.numero_de_personas_mayores_en_el_hogar,
      };*/
      
    
    

  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState(''); 
  const [f_nacimiento, setFNacimiento] = useState(''); 
  const [genero, setGenero] = useState(''); 
  const [n_contacto, setNContacto] = useState(''); 
  const [n_menores, setNMenores] = useState(''); 
  const [n_mayores, setNMayores] = useState(''); 

  const handleSubmit = (event) => {
    event.preventDefault();
    const querydb= getFirestore();
    const docuRef = collection(querydb, `beneficiarios`);
    const docuCifrada= doc(docuRef,beneficiarioid);
    
    const beneficiario = {
      nombre:nombre,
      cedula:cedula,
      fecha_nacimiento:f_nacimiento,
      genero:genero,
      numero_contacto:n_contacto,
      numero_de_personas_menores_en_el_hogar:n_menores,
      numero_de_personas_mayores_en_el_hogar:n_mayores,
    }

    const modificar = updateDoc(docuCifrada,beneficiario)
    modificar.catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(error.message);
    })
  
    console.log('Datos enviados:', { nombre, cedula, f_nacimiento,genero,n_contacto, n_menores,n_mayores});
    //goListaB();
  };
  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Editar Beneficiario</h1>

      <form onSubmit={handleSubmit}>

        <div id="txtNombre">
          <label htmlFor="nombre"><b>Nombre:</b></label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>


        <div id="txtcedula">
          <label htmlFor="cedula"><b>cedula:</b></label>
          <input
            type="text"
            id="cedula"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
          />
        </div>

        <div id="txtf_nacimiento">
          <label htmlFor="f_nacimiento"><b>fecha de nacimiento:</b></label>
          <input
            type="text"
            id="f_nacimiento"
            value={f_nacimiento}
            onChange={(e) => setFNacimiento(e.target.value)}
          />
        </div>

        <div id="txtgenero">
          <label htmlFor="genero"><b>genero:</b></label>
          <input
            type="text"
            id="genero"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
          />
        </div>

        <div id="txtn_contacto">
          <label htmlFor="n_contacto"><b>n_contacto:</b></label>
          <input
            type="text"
            id="n_contacto"
            value={n_contacto}
            onChange={(e) => setNContacto(e.target.value)}
          />
        </div>

        <div id="txtn_menores">
          <label htmlFor="n_menores"><b>n_menores:</b></label>
          <input
            type="text"
            id="n_menores"
            value={n_menores}
            onChange={(e) => setNMenores(e.target.value)}
          />
        </div>

        <div id="txtn_mayores">
          <label htmlFor="n_mayores"><b>n_mayores:</b></label>
          <input
            type="text"
            id="n_mayores"
            value={n_mayores}
            onChange={(e) => setNMayores(e.target.value)}
          />
        </div>

        
        <button id="buttonBRegistrar" type="submit">Cambiar Datos</button>
      </form>
    </div>
  )
}

export default EditarBeneficiario