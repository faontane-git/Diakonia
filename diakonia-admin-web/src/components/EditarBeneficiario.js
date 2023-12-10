import React from 'react'
import { useState } from 'react';
import Cabecera from "./Cabecera";
import { useParams,useNavigate } from 'react-router-dom';
import '../estilos/EditarBeneficiario.css';



const EditarBeneficiario= ({beneficiarios}) => {
  const {institucionId,beneficiarioid} = useParams();
  const navigate = useNavigate();
const goListaB = () => {
    
      navigate('/beneficiarios');
    }
  const beneficiarioSeleccionado = beneficiarios.find((benf) => benf.id ===  parseInt(beneficiarioid, 10) && benf.institucionId ===  parseInt(institucionId, 10)) ;
  const idb= beneficiarioSeleccionado.id

  const [nombre, setNombre] = useState(beneficiarioSeleccionado.nombre);
  const [edad, setEdad] = useState(beneficiarioSeleccionado.edad);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Datos enviados:', { nombre, edad, idb});
    goListaB();
  };
  return (
    <div>
    <Cabecera/>
      <h2>EditarBeneficiario  </h2>


      <form onSubmit={handleSubmit}>
        
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        
        <div>
          <label htmlFor="edad">edad:</label>
          <input
            type="text"
            id="edad"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
          />
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  )
}

export default EditarBeneficiario