import React from 'react'
import Cabecera from "./Cabecera";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../estilos/Registrar.css';

import firebaseApp from "../firebase-config";
import { getFirestore, doc, collection, setDoc, addDoc } from "firebase/firestore";

const RegistroInstitucion = () => {

  const navigate = useNavigate();
const goBack = () => {    
  navigate('/instituciones');
}

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [desayuno, setDesayuno] = useState(false);
  const [almuerzo, setAlmuerzo] = useState(false);

  const firestore = getFirestore()
  const InstitucionCollection = collection(firestore, 'instituciones');

  // Función para manejar el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    const institucion = {
      nombre:nombre,
      telefono:telefono,
      direccion:direccion,
      desayuno:desayuno,
      almuerzo:almuerzo
    }
    const agregar= addDoc(InstitucionCollection,institucion);
    agregar
    .then((funciono) => {
      alert("Nueva institución añadida");
      goBack();
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error al agragar institución");
    })


    

  };

  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Registrar Institución</h1>
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


        <div id="txtTelefono">
          <label htmlFor="telefono"><b>Teléfono:</b></label>
          <input
            type="text"
            id="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>


        <div id="txtDireccion">
          <label htmlFor="direccion"><b>Dirección:</b></label>
          <input
            type="text"
            id="direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>


        <div id="txtServicios">
          <label><b>Servicios:</b></label>
          <div id="opcionesServicios">
            <input
              type="checkbox"
              id="desayuno"
              checked={desayuno}
              onChange={() => setDesayuno(!desayuno)}
            />
            <label htmlFor="desayuno">Desayuno</label>
        
          <div>
            <input
              type="checkbox"
              id="almuerzo"
              checked={almuerzo}
              onChange={() => setAlmuerzo(!almuerzo)}
            />
            <label htmlFor="almuerzo">Almuerzo</label>
          </div>

          </div>
        </div>


        <button id="buttonFRegistrar" type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegistroInstitucion;


