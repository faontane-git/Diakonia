import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Cabecera from './Cabecera';
import Popup from './Popup';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ListaBeneficiarios = ({ instituciones, nutricion }) => {
  const { institucionId } = useParams();
  // Encuentra la institución seleccionada por su ID
  const institucionSeleccionada = instituciones.find((inst) => inst.id === parseInt(institucionId, 10));

  // Muestra la lista de beneficiarios de la institución seleccionada
  const beneficiariosDeInstitucion = nutricion.filter(
    (nutricion) => nutricion.institucionId === institucionSeleccionada.id
  );

  return (
    <div>
      <Cabecera/>
      <h2>Lista de Nutricion de {institucionSeleccionada.nombre}</h2>
      {/* Aquí deberías mostrar la lista de beneficiarios de la institución */}
      <ul>
        {beneficiariosDeInstitucion.map((beneficiario) => (
          <li key={beneficiario.id}>
            {beneficiario.nombre} -imc {beneficiario.imc}  - id {beneficiario.id} - peso {beneficiario.peso}
            {<Link to={`/verGrafica/${institucionSeleccionada.id}/${beneficiario.id}`}>Ver gráfica</Link>}
          
            {/* Puedes mostrar más información sobre cada beneficiario según tu estructura de datos */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaBeneficiarios;
