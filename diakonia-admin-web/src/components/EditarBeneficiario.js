import React from 'react'
import { useState } from 'react';
import Cabecera from "./Cabecera";
import { useParams, useNavigate } from 'react-router-dom';
import '../estilos/EditarBeneficiario.css';



const EditarBeneficiario = ({ beneficiarios }) => {
  const { institucionId, beneficiarioid } = useParams();
  const navigate = useNavigate();
  const goListaB = () => {

    navigate('/beneficiarios');
  }
  const beneficiarioSeleccionado = beneficiarios.find((benf) => benf.id === parseInt(beneficiarioid, 10) && benf.institucionId === parseInt(institucionId, 10));
  const idb = beneficiarioSeleccionado.id

  const [nombre, setNombre] = useState(beneficiarioSeleccionado.nombre);
  const [edad, setEdad] = useState(beneficiarioSeleccionado.edad);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Datos enviados:', { nombre, edad, idb });
    goListaB();
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


        <div id="txtEdad">
          <label htmlFor="edad"><b>Edad:</b></label>
          <input
            type="text"
            id="edad"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
          />
        </div>
        <button id="buttonBRegistrar" type="submit">Cambiar Datos</button>
      </form>
    </div>
  )
}

export default EditarBeneficiario