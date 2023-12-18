import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Cabecera from './Cabecera';
import '../estilos/ListaNutricion.css';

const ListaBeneficiarios = ({ instituciones, nutricion }) => {
  const { institucionId } = useParams();
  const institucionSeleccionada = instituciones.find((inst) => inst.id === parseInt(institucionId, 10));
  const beneficiariosDeInstitucion = nutricion.filter(
    (nutricion) => nutricion.institucionId === institucionSeleccionada.id
  );

  return (
    <div className="centered-container">
      <Cabecera />
      <h1>Lista de Nutricion de {institucionSeleccionada.nombre}</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {beneficiariosDeInstitucion.map((beneficiario) => (
            <tr key={beneficiario.id}>
              <td>{beneficiario.nombre}</td>
              <td>
                <Link to={`/verGrafica/${institucionSeleccionada.id}/${beneficiario.id}`}>
                  <button>Ver gráfica</button>
                </Link>
                {/* Agrega más botones según sea necesario */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaBeneficiarios;
