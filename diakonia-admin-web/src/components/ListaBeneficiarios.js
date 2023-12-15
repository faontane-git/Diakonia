import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Cabecera from './Cabecera';
import Popup from './Popup';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../estilos/ListaBeneficiarios.css';

const ListaBeneficiarios = ({ instituciones, beneficiarios }) => {
  const { institucionId } = useParams();
  
  const navigate = useNavigate();
 

  const goAñadirBenef = () => {
    
      navigate('añadirBenef');
    }

  

  // Encuentra la institución seleccionada por su ID
  const institucionSeleccionada = instituciones.find((inst) => inst.id === parseInt(institucionId, 10));

  // Muestra la lista de beneficiarios de la institución seleccionada
  const beneficiariosDeInstitucion = beneficiarios.filter(
    (beneficiario) => beneficiario.institucionId === institucionSeleccionada.id
  );

  return (
    <div className="centered-container">
      <Cabecera/>
      <h2>Lista de Beneficiarios de {institucionSeleccionada.nombre}</h2>
      <button id="buttonABeneficiarios" onClick={goAñadirBenef} >Añadir Beneficiarios</button>
      {/* Aquí deberías mostrar la lista de beneficiarios de la institución */}
      <ul id="listaBeneficiarios">
        {beneficiariosDeInstitucion.map((beneficiario) => (
          <li key={beneficiario.id}>
            {beneficiario.nombre} - {beneficiario.edad} años - {beneficiario.id}
            <Link to={`/editar-beneficiario/${institucionSeleccionada.id}/${beneficiario.id}`}>Editar</Link>
            {/* Puedes mostrar más información sobre cada beneficiario según tu estructura de datos */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaBeneficiarios;
